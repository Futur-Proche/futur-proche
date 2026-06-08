import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("stripe not configured", { status: 503 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-09-30.acacia" as any });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`signature verification failed: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const isGuest = meta.is_guest === "true";
    const amount = (session.amount_total ?? 0) / 100;

    const row: any = {
      event_id: meta.event_id,
      statut: "paid",
      stripe_session_id: session.id,
      amount_paid: amount,
      paid_at: new Date().toISOString(),
      is_guest: isGuest,
    };
    if (isGuest) {
      row.guest_email = meta.guest_email || session.customer_email;
      row.guest_nom = meta.guest_nom || null;
      row.guest_prenom = meta.guest_prenom || null;
    } else {
      row.user_id = meta.user_id;
    }

    // Upsert via stripe_session_id to keep webhook idempotent
    const { error } = await admin
      .from("event_registrations")
      .upsert(row, { onConflict: "stripe_session_id" });
    if (error) {
      console.error("insert registration failed", error);
      return new Response(`db error: ${error.message}`, { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
