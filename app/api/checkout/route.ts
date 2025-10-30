import { NextResponse } from "next/server";
import Stripe from "stripe";

type PlanKey = "plus" | "pro_employee" | "pro_split" | "premium";
type Cycle = "mo" | "yr";

const MONTHLY: Record<PlanKey, string | undefined> = {
    plus: process.env.STRIPE_PRICE_PLUS,
    pro_employee: process.env.STRIPE_PRICE_PRO_EMPLOYEE,
    pro_split: process.env.STRIPE_PRICE_PRO_SPLIT,
    premium: process.env.STRIPE_PRICE_PREMIUM,
};

const YEARLY: Record<PlanKey, string | undefined> = {
    plus: process.env.STRIPE_PRICE_PLUS_YEARLY,
    pro_employee: process.env.STRIPE_PRICE_PRO_EMPLOYEE_YEARLY,
    pro_split: process.env.STRIPE_PRICE_PRO_SPLIT_YEARLY,
    premium: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
};

export async function POST(req: Request) {
    try {
        const { plan, cycle = "mo" } = (await req.json()) as {
            plan: PlanKey;
            cycle?: Cycle;
        };

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: "Stripe not configured (missing STRIPE_SECRET_KEY)" },
                { status: 500 }
            );
        }
        if (!["plus", "pro_employee", "pro_split", "premium"].includes(plan)) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const priceId = (cycle === "yr" ? YEARLY : MONTHLY)[plan];
        if (!priceId) {
            return NextResponse.json(
                { error: `Price not configured for ${plan} (${cycle})` },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const base =
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${base}/pricing?canceled=1`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Checkout error" },
            { status: 500 }
        );
    }
}
