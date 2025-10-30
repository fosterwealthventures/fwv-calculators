// app/api/stripe/webhook/route.ts
import Stripe from "stripe";

export const runtime = "nodejs";           // required for signature verification
export const dynamic = "force-dynamic";    // don’t cache webhooks

// Use the SDK's pinned/latest API version to match installed types
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Resolve env-driven Stripe Price ID -> plan tier + optional pro choice + billing cycle
type Tier = "free" | "plus" | "pro" | "premium";
type ProChoice = "employee" | "expense_split" | null;
type Cycle = "mo" | "yr";
function planFromPrice(priceId?: string | null): { tier: Tier; choice: ProChoice; cycle: Cycle } | undefined {
    if (!priceId) return undefined;
    const is = (id: string | undefined) => id === priceId;

    if (is(process.env.STRIPE_PRICE_PLUS)) return { tier: "plus", choice: null, cycle: "mo" };
    if (is(process.env.STRIPE_PRICE_PLUS_YEARLY)) return { tier: "plus", choice: null, cycle: "yr" };
    if (is(process.env.STRIPE_PRICE_PREMIUM)) return { tier: "premium", choice: null, cycle: "mo" };
    if (is(process.env.STRIPE_PRICE_PREMIUM_YEARLY)) return { tier: "premium", choice: null, cycle: "yr" };

    if (is(process.env.STRIPE_PRICE_PRO_EMPLOYEE)) return { tier: "pro", choice: "employee", cycle: "mo" };
    if (is(process.env.STRIPE_PRICE_PRO_EMPLOYEE_YEARLY)) return { tier: "pro", choice: "employee", cycle: "yr" };
    if (is(process.env.STRIPE_PRICE_PRO_SPLIT)) return { tier: "pro", choice: "expense_split", cycle: "mo" };
    if (is(process.env.STRIPE_PRICE_PRO_SPLIT_YEARLY)) return { tier: "pro", choice: "expense_split", cycle: "yr" };

    return undefined;
}

function ok(body: any = { received: true }) {
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
function bad(status: number, msg: string) {
    return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req: Request) {
    console.log("[stripe] webhook hit", req.headers.get("stripe-signature"));
    const sig = req.headers.get("stripe-signature");
    if (!sig) return bad(400, "Missing Stripe-Signature header");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return bad(500, "Missing STRIPE_WEBHOOK_SECRET");

    // IMPORTANT: use raw body string for verification
    const payload = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
        console.error("[stripe] signature verification failed:", err?.message);
        return bad(400, `Webhook signature verification failed: ${err?.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                // Fetch line items to read the purchased Price ID
                const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
                const priceId = items.data[0]?.price?.id;

                const resolved = planFromPrice(priceId);
                console.log("[stripe] checkout.session.completed", {
                    id: session.id,
                    mode: session.mode,
                    customer: session.customer,
                    price: priceId,
                    plan: resolved?.tier,
                    proChoice: resolved?.choice,
                    cycle: resolved?.cycle,
                });

                // TODO: map priceId -> plan and persist entitlement in your DB
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                // TODO: upsert subscription status in your DB
                const priceId = sub.items.data[0]?.price?.id;
                const resolved = planFromPrice(priceId);
                console.log(`[stripe] ${event.type}`, {
                    id: sub.id,
                    status: sub.status,
                    customer: sub.customer,
                    price: priceId,
                    plan: resolved?.tier,
                    proChoice: resolved?.choice,
                    cycle: resolved?.cycle,
                });
                break;
            }

            case "payment_intent.succeeded":
            case "invoice.payment_succeeded":
            case "invoice.payment_failed":
                console.log("[stripe] event:", event.type);
                break;

            default:
                console.log("[stripe] unhandled event type:", event.type);
        }

        return ok();
    } catch (e: any) {
        console.error("[stripe] handler error:", e);
        return bad(500, "Webhook handler error");
    }
}
