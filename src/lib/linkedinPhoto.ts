export type LinkedInPhotoCandidate = {
  imageUrl: string;
  sourceUrl?: string;
  title?: string;
};

const DUCKDUCKGO_HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Referer: "https://duckduckgo.com/",
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLinkedInUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim());
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url.trim().replace(/\/$/, "");
  }
};

const extractSlug = (linkedinUrl: string) => {
  const normalized = normalizeLinkedInUrl(linkedinUrl);
  const match = normalized.match(/linkedin\.com\/(?:in|pub)\/([^/?#]+)/i);
  return match?.[1]?.toLowerCase() ?? "";
};

const extractNameTokens = (linkedinUrl: string) => {
  const slug = extractSlug(linkedinUrl);
  return slug
    .split(/[-_]+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token && !/^\d+$/.test(token) && !["fr", "en", "www", "marketing", "webmarketing"].includes(token));
};

const buildQuery = (linkedinUrl: string, fullName?: string) => {
  const normalized = normalizeLinkedInUrl(linkedinUrl);
  const namePart = fullName?.trim() || extractNameTokens(normalized).slice(0, 2).join(" ");
  return `${namePart || normalized} LinkedIn`;
};

export const findLinkedInPhoto = async (linkedinUrl: string, fullName?: string): Promise<LinkedInPhotoCandidate | null> => {
  const normalizedLinkedIn = normalizeLinkedInUrl(linkedinUrl);
  const slug = extractSlug(normalizedLinkedIn);
  const nameTokens = extractNameTokens(normalizedLinkedIn);
  const query = buildQuery(normalizedLinkedIn, fullName);

  const searchPage = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: DUCKDUCKGO_HEADERS,
  });

  if (!searchPage.ok) {
    throw new Error(`Recherche image indisponible (${searchPage.status})`);
  }

  const html = await searchPage.text();
  const vqdMatch = html.match(/vqd=\"([^\"]+)\"/);
  if (!vqdMatch?.[1]) return null;

  const resultResponse = await fetch(
    `https://duckduckgo.com/i.js?l=fr-fr&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqdMatch[1])}&f=,,,&p=1`,
    { headers: DUCKDUCKGO_HEADERS },
  );

  if (!resultResponse.ok) {
    throw new Error(`Résultats image indisponibles (${resultResponse.status})`);
  }

  const payload = (await resultResponse.json()) as { results?: Array<Record<string, string>> };
  const results = payload.results ?? [];

  const scored = results
    .map((result) => {
      const title = result.title ?? "";
      const sourceUrl = result.url ?? "";
      const imageUrl = result.image ?? result.thumbnail ?? "";

      if (!imageUrl) return null;

      const haystack = `${title} ${sourceUrl} ${imageUrl}`.toLowerCase();

      let score = 0;
      if (/profile-displayphoto/.test(imageUrl)) score += 8;
      if (/linkedin/.test(sourceUrl)) score += 4;
      if (slug && haystack.includes(slug)) score += 8;

      const matchedTokens = nameTokens.filter((token) => haystack.includes(token));
      score += matchedTokens.length * 3;

      if (/feedshare|article-cover|company-logo|school-logo/.test(imageUrl)) score -= 6;
      if (/posts|activity/.test(sourceUrl)) score -= 3;

      return { imageUrl, sourceUrl, title, score };
    })
    .filter((item): item is LinkedInPhotoCandidate & { score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < 8) return null;

  return {
    imageUrl: best.imageUrl,
    sourceUrl: best.sourceUrl,
    title: best.title,
  };
};

export const getInitials = (prenom?: string | null, nom?: string | null) =>
  `${prenom?.trim()?.[0] ?? ""}${nom?.trim()?.[0] ?? ""}`.toUpperCase() || "FP";

export const isLikelyLinkedInUrl = (value?: string | null) => {
  if (!value) return false;
  return /linkedin\.com\/(?:in|pub)\//i.test(value);
};