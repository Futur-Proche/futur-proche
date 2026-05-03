import { corsHeaders } from '@supabase/supabase-js/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'
import { z } from 'https://esm.sh/zod@3.25.76'

const RequestSchema = z.object({
  candidatureId: z.string().uuid(),
  linkedinUrl: z.string().url(),
  fullName: z.string().min(1).max(200).optional(),
})

const DUCKDUCKGO_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  Referer: 'https://duckduckgo.com/',
}

const normalizeLinkedInUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim())
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '')
  } catch {
    return url.trim().replace(/\/$/, '')
  }
}

const extractSlug = (linkedinUrl: string) => {
  const normalized = normalizeLinkedInUrl(linkedinUrl)
  const match = normalized.match(/linkedin\.com\/(?:in|pub)\/([^/?#]+)/i)
  return match?.[1]?.toLowerCase() ?? ''
}

const extractNameTokens = (linkedinUrl: string) => {
  const slug = extractSlug(linkedinUrl)
  return slug
    .split(/[-_]+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token && !/^\d+$/.test(token) && !['fr', 'en', 'www', 'marketing', 'webmarketing'].includes(token))
}

const buildQuery = (linkedinUrl: string, fullName?: string) => {
  const normalized = normalizeLinkedInUrl(linkedinUrl)
  const namePart = fullName?.trim() || extractNameTokens(normalized).slice(0, 2).join(' ')
  return `${namePart || normalized} LinkedIn`
}

const findLinkedInPhoto = async (linkedinUrl: string, fullName?: string) => {
  const normalizedLinkedIn = normalizeLinkedInUrl(linkedinUrl)
  const slug = extractSlug(normalizedLinkedIn)
  const nameTokens = extractNameTokens(normalizedLinkedIn)
  const query = buildQuery(normalizedLinkedIn, fullName)

  const searchPage = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: DUCKDUCKGO_HEADERS,
  })

  if (!searchPage.ok) {
    throw new Error(`Recherche image indisponible (${searchPage.status})`)
  }

  const html = await searchPage.text()
  const vqdMatch = html.match(/vqd=\"([^\"]+)\"/)
  if (!vqdMatch?.[1]) return null

  const resultResponse = await fetch(
    `https://duckduckgo.com/i.js?l=fr-fr&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqdMatch[1])}&f=,,,&p=1`,
    { headers: DUCKDUCKGO_HEADERS },
  )

  if (!resultResponse.ok) {
    throw new Error(`Résultats image indisponibles (${resultResponse.status})`)
  }

  const payload = (await resultResponse.json()) as { results?: Array<Record<string, string>> }
  const results = payload.results ?? []

  const scored = results
    .map((result) => {
      const title = result.title ?? ''
      const sourceUrl = result.url ?? ''
      const imageUrl = result.image ?? result.thumbnail ?? ''

      if (!imageUrl) return null

      const haystack = `${title} ${sourceUrl} ${imageUrl}`.toLowerCase()
      let score = 0

      if (/profile-displayphoto/.test(imageUrl)) score += 8
      if (/linkedin/.test(sourceUrl)) score += 4
      if (slug && haystack.includes(slug)) score += 8
      const matchedTokens = nameTokens.filter((token) => haystack.includes(token))
      score += matchedTokens.length * 3

      if (/feedshare|article-cover|company-logo|school-logo/.test(imageUrl)) score -= 6
      if (/posts|activity/.test(sourceUrl)) score -= 3

      return { imageUrl, sourceUrl, title, score }
    })
    .filter((item): item is { imageUrl: string; sourceUrl: string; title: string; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (!best || best.score < 8) return null

  return best
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentification requise' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const parsed = RequestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl) throw new Error('SUPABASE_URL is not configured')
    if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    })

    const { data: userData, error: userError } = await admin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: role, error: roleError } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError) throw roleError
    if (!role) {
      return new Response(JSON.stringify({ error: 'Accès refusé' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { candidatureId, linkedinUrl, fullName } = parsed.data
    const match = await findLinkedInPhoto(linkedinUrl, fullName)

    if (!match) {
      return new Response(JSON.stringify({ error: 'Aucune photo exploitable trouvée' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const imageResponse = await fetch(match.imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!imageResponse.ok) {
      throw new Error(`Téléchargement image impossible (${imageResponse.status})`)
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
    const filePath = `candidatures/${candidatureId}/linkedin-avatar.${extension}`
    const bytes = await imageResponse.arrayBuffer()

    const { error: uploadError } = await admin.storage
      .from('avatars')
      .upload(filePath, bytes, { contentType, upsert: true })

    if (uploadError) throw uploadError

    const { data: publicUrlData } = admin.storage.from('avatars').getPublicUrl(filePath)

    const { error: updateError } = await admin
      .from('candidatures')
      .update({
        photo_url: publicUrlData.publicUrl,
        photo_source: match.sourceUrl || linkedinUrl,
        photo_fetched_at: new Date().toISOString(),
      })
      .eq('id', candidatureId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ photoUrl: publicUrlData.publicUrl, sourceUrl: match.sourceUrl || linkedinUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})