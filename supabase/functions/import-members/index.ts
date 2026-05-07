import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify caller is admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No auth header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: { user: caller } } = await supabaseAdmin.auth.getUser(
    authHeader.replace("Bearer ", "")
  );
  if (!caller) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check admin role
  const { data: roleData } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", caller.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: "Admin only" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { members } = await req.json();
  const results: { email: string; status: string; error?: string }[] = [];

  for (const m of members) {
    try {
      // Generate random password
      const password = crypto.randomUUID() + "Aa1!";

      // Create auth user with email confirmed
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: m.email,
          password,
          email_confirm: true,
        });

      if (authError) {
        results.push({ email: m.email, status: "error", error: authError.message });
        continue;
      }

      const userId = authData.user.id;

      // Insert profile
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userId,
        nom: m.nom,
        prenom: m.prenom,
        email: m.email,
        poste: m.poste || null,
        entreprise: m.entreprise || null,
        secteur: m.secteur || null,
        ville: m.ville || null,
        telephone: m.telephone || null,
        linkedin: m.linkedin || null,
      });

      if (profileError) {
        results.push({ email: m.email, status: "profile_error", error: profileError.message });
        continue;
      }

      results.push({ email: m.email, status: "ok" });
    } catch (err) {
      results.push({ email: m.email, status: "error", error: String(err) });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
