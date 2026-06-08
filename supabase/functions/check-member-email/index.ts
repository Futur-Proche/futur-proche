import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const lower = email.trim().toLowerCase();

    const { data: profile } = await admin
      .from("profiles")
      .select("prenom, nom")
      .ilike("email", lower)
      .maybeSingle();

    if (profile) {
      return new Response(JSON.stringify({ is_member: true, prenom: profile.prenom, nom: profile.nom }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: cand } = await admin
      .from("candidatures")
      .select("prenom, nom")
      .ilike("email", lower)
      .eq("statut", "approved")
      .maybeSingle();

    if (cand) {
      return new Response(JSON.stringify({ is_member: true, prenom: cand.prenom, nom: cand.nom }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ is_member: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
