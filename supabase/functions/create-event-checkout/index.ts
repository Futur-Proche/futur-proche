import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import Stripe from "npm:stripe@17";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { event_id, guest_email, guest_nom, guest_prenom } = body ?? {};
    if (!event_id) {
      return json({ error: "event_id required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Identify caller (member or guest)
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

    // Fetch event
    const { data: ev, error: evErr } = await admin
      .from("events")
      .select("*")
      .eq("id", event_id)
      .maybeSingle();
    if (evErr || !ev) return json({ error: "event not found" }, 404);
    if (ev.statut !== "published") return json({ error: "event not open" }, 400);
    if (ev.registrations_closed) return json({ error: "registrations_closed" }, 403);

    // Capacity check
    if (ev.capacite) {
      const { count } = await admin
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id)
        .neq("statut", "cancelled");
      if ((count ?? 0) >= ev.capacite) return json({ error: "event full" }, 400);
    }

    // Authorization: member, or open_to_all, or recognized member email
    let actorEmail: string | null = null;
    let actorPrenom: string | null = guest_prenom ?? null;
    let actorNom: string | null = guest_nom ?? null;
    let isGuest = true;

    if (userId) {
      isGuest = false;
      const { data: profile } = await admin
        .from("profiles").select("email, prenom, nom").eq("id", userId).maybeSingle();
      actorEmail = profile?.email ?? null;
      actorPrenom = profile?.prenom ?? null;
      actorNom = profile?.nom ?? null;
    } else {
      if (!guest_email) return json({ error: "email required" }, 400);
      actorEmail = guest_email.trim().toLowerCase();

      if (!ev.is_open_to_all) {
        // Guest must be a recognized member
        const { data: isMember } = await admin.rpc("is_member", { _email: actorEmail });
        if (!isMember) return json({ error: "member_only" }, 403);
      }
    }

    // Already registered?
    if (userId) {
      const { data: existing } = await admin
        .from("event_registrations").select("id").eq("event_id", event_id).eq("user_id", userId).maybeSingle();
      if (existing) return json({ already_registered: true });
    } else if (actorEmail) {
      const { data: existing } = await admin
        .from("event_registrations").select("id").eq("event_id", event_id).ilike("guest_email", actorEmail).maybeSingle();
      if (existing) return json({ already_registered: true });
    }

    const price = Number(ev.prix ?? 0);

    // FREE → insert directly
    if (!price || price <= 0) {
      const insert: any = {
        event_id,
        statut: "registered",
        is_guest: isGuest,
      };
      if (isGuest) {
        insert.guest_email = actorEmail;
        insert.guest_nom = actorNom;
        insert.guest_prenom = actorPrenom;
      } else {
        insert.user_id = userId;
      }
      const { error: insErr } = await admin.from("event_registrations").insert(insert);
      if (insErr) return json({ error: insErr.message }, 500);
      return json({ free: true, registered: true });
    }

    // PAID → Stripe Checkout
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return json({ error: "Stripe n'est pas encore configuré. Contactez l'organisateur." }, 503);
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-09-30.acacia" as any });

    const origin = req.headers.get("origin") ?? "https://example.com";
    const successUrl = `${origin}/evenements/${ev.slug ?? ev.id}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/evenements/${ev.slug ?? ev.id}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: actorEmail ?? undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: ev.titre, description: ev.description ?? undefined },
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
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return json({ url: session.url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
