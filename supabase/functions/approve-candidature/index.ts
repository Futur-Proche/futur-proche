import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BodySchema = z.object({ candidatureId: z.string().uuid() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentification requise" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Verify admin
    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { candidatureId } = parsed.data;

    const { data: c, error: cErr } = await admin
      .from("candidatures")
      .select("*")
      .eq("id", candidatureId)
      .maybeSingle();
    if (cErr || !c) {
      return new Response(JSON.stringify({ error: "Candidature introuvable" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark approved (idempotent)
    await admin
      .from("candidatures")
      .update({ statut: "approved", reviewed_at: new Date().toISOString(), reviewed_by: userData.user.id })
      .eq("id", candidatureId);

    // Check if a profile already exists for this email
    const { data: existingByEmail } = await admin
      .from("profiles")
      .select("id")
      .ilike("email", c.email)
      .maybeSingle();

    if (existingByEmail) {
      return new Response(
        JSON.stringify({ status: "already_member", profileId: existingByEmail.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to find auth user by email, otherwise create one
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find(
      (u) => (u.email ?? "").toLowerCase() === c.email.toLowerCase()
    );
    if (found) {
      userId = found.id;
    } else {
      const password = crypto.randomUUID() + "Aa1!";
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: c.email,
        password,
        email_confirm: true,
        user_metadata: { prenom: c.prenom, nom: c.nom, source: "candidature_approved" },
      });
      if (createErr || !created.user) throw createErr ?? new Error("Création utilisateur échouée");
      userId = created.user.id;
    }

    const { error: insertErr } = await admin.from("profiles").insert({
      id: userId,
      prenom: c.prenom,
      nom: c.nom,
      email: c.email,
      poste: c.poste ?? null,
      entreprise: c.entreprise ?? null,
      secteur: c.secteur ?? null,
      telephone: c.telephone ?? null,
      linkedin: c.linkedin ?? null,
      photo_url: c.photo_url ?? null,
      ville: c.code_postal ?? null,
    });
    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ status: "created", profileId: userId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
