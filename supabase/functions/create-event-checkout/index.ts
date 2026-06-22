import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import Stripe from "npm:stripe@17";

function stripHtml(s: string | null | undefined, max = 400): string | undefined {
  if (!s) return undefined;
  const txt = String(s)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (!txt) return undefined;
  return txt.length > max ? txt.slice(0, max - 1) + "…" : txt;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      event_id,
      guest_email,
      guest_nom,
      guest_prenom,
      guest_poste,
      guest_entreprise,
    } = body ?? {};
    if (!event_id) return json({ error: "event_id required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
      userId = data?.claims?.sub ?? null;
    }

    const { data: ev, error: evErr } = await admin
      .from("events").select("*").eq("id", event_id).maybeSingle();
    if (evErr || !ev) return json({ error: "event not found" }, 404);
    if (ev.statut !== "published") return json({ error: "event not open" }, 400);
    if (ev.registrations_closed) return json({ error: "registrations_closed" }, 403);

    if (ev.capacite) {
      const { count } = await admin
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id)
        .neq("statut", "cancelled");
      if ((count ?? 0) >= ev.capacite) return json({ error: "event full" }, 400);
    }

    let actorEmail: string | null = null;
    let actorPrenom: string | null = guest_prenom ?? null;
    let actorNom: string | null = guest_nom ?? null;
    let actorPoste: string | null = guest_poste ?? null;
    let actorEntreprise: string | null = guest_entreprise ?? null;
    let isGuest = true;

    if (userId) {
      isGuest = false;
      const { data: profile } = await admin
        .from("profiles").select("email, prenom, nom, poste, entreprise").eq("id", userId).maybeSingle();
      actorEmail = profile?.email ?? null;
      actorPrenom = profile?.prenom ?? null;
      actorNom = profile?.nom ?? null;
      actorPoste = profile?.poste ?? null;
      actorEntreprise = profile?.entreprise ?? null;
    } else {
      if (!guest_email) return json({ error: "email required" }, 400);
      actorEmail = guest_email.trim().toLowerCase();
      if (!ev.is_open_to_all) {
        const { data: isMember } = await admin.rpc("is_member", { _email: actorEmail });
        if (!isMember) return json({ error: "member_only" }, 403);
      }
    }

    if (userId) {
      const { data: existing } = await admin
        .from("event_registrations")
        .select("id")
        .eq("event_id", event_id)
        .eq("user_id", userId)
        .neq("statut", "cancelled")
        .maybeSingle();
      if (existing) return json({ already_registered: true });
    }

    if (actorEmail) {
      const { data: existingGuest } = await admin
        .from("event_registrations")
        .select("id")
        .eq("event_id", event_id)
        .ilike("guest_email", actorEmail)
        .neq("statut", "cancelled")
        .maybeSingle();
      if (existingGuest) return json({ already_registered: true });

      const { data: matchingProfiles } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", actorEmail);

      const matchingProfileIds = (matchingProfiles ?? []).map((p) => p.id).filter(Boolean);
      if (matchingProfileIds.length > 0) {
        const { data: existingMember } = await admin
          .from("event_registrations")
          .select("id")
          .eq("event_id", event_id)
          .in("user_id", matchingProfileIds)
          .neq("statut", "cancelled")
          .maybeSingle();
        if (existingMember) return json({ already_registered: true });
      }
    }

    const price = Number(ev.prix ?? 0);

    if (!price || price <= 0) {
      const insert: any = { event_id, statut: "registered", is_guest: isGuest };
      if (isGuest) {
        insert.guest_email = actorEmail;
        insert.guest_nom = actorNom;
        insert.guest_prenom = actorPrenom;
        insert.guest_poste = actorPoste;
        insert.guest_entreprise = actorEntreprise;
      } else {
        insert.user_id = userId;
      }
      const { error: insErr } = await admin.from("event_registrations").insert(insert);
      if (insErr) return json({ error: insErr.message }, 500);
      return json({ free: true, registered: true });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe non configuré." }, 503);
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-09-30.acacia" as any });

    const origin = req.headers.get("origin") ?? "https://example.com";
    const successUrl = `${origin}/evenements/${ev.slug ?? ev.id}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/evenements/${ev.slug ?? ev.id}`;

    const productDescription = stripHtml(ev.description, 400);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: actorEmail ?? undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: ev.titre,
            ...(productDescription ? { description: productDescription } : {}),
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      metadata: {
        event_id,
        user_id: userId ?? "",
        is_guest: String(isGuest),
        guest_email: actorEmail ?? "",
        guest_prenom: actorPrenom ?? "",
        guest_nom: actorNom ?? "",
        guest_poste: actorPoste ?? "",
        guest_entreprise: actorEntreprise ?? "",
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return json({ url: session.url });
  } catch (e) {
    console.error("create-event-checkout error:", e);
    return json({ error: String((e as any)?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
