import { NextResponse } from "next/server";
import Stripe from "stripe";

/** Map env to plan keys (same keys you use in /api/checkout) */
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

/** Build reverse lookup: priceId -> { plan, cycle } */
function buildPriceIndex() {
    const index = new Map<string, { plan: PlanKey; cycle: Cycle }>();
    (Object.keys(MONTHLY) as PlanKey[]).forEach((plan) => {
        const pid = MONTHLY[plan];
        if (pid) index.set(pid, { plan, cycle: "mo" });
    });
    (Object.keys(YEARLY) as PlanKey[]).forEach((plan) => {
        const pid = YEARLY[plan];
        if (pid) index.set(pid, { plan, cycle: "yr" });
    });
    return index;
}

async function resolvePriceFromSession(stripe: Stripe, sessionId: string) {
    // Retrieve session; we’ll fetch the subscription separately for clarity
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Prefer subscription items (source of truth for recurring)
    if (session.subscription && typeof session.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(session.subscription, {
            expand: ["items.data.price"],
        });
        const firstItem = sub.items?.data?.[0];
        const priceId = firstItem?.price?.id;
        return priceId || null;
    }

    // Fallback: expand line_items if available in your flow (not guaranteed)
    // If you want this fallback, you can re-retrieve with expansion:
    // const sess2 = await stripe.checkout.sessions.retrieve(sessionId, {
    //   expand: ["line_items.data.price"],
    // });
    // const priceId = (sess2.line_items?.data?.[0] as any)?.price?.id;
    // return priceId || null;

    return null;
}

function setPlanCookies(res: NextResponse, plan: PlanKey, cycle: Cycle) {
    const secure = process.env.NODE_ENV === "production";
    const common = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure,
        path: "/",
    };

    // 1 year maxAge for plan; 30 days for cycle (adjust as you wish)
    res.cookies.set("fwv_plan", plan, { ...common, maxAge: 60 * 60 * 24 * 365 });
    res.cookies.set("fwv_cycle", cycle, { ...common, maxAge: 60 * 60 * 24 * 30 });
}

export async function POST(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: "Stripe not configured (missing STRIPE_SECRET_KEY)" },
                { status: 500 }
            );
        }

        const { session_id } = (await req.json().catch(() => ({}))) as {
            session_id?: string;
        };
        if (!session_id) {
            return NextResponse.json(
                { error: "Missing session_id in request body" },
                { status: 400 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const priceId = await resolvePriceFromSession(stripe, session_id);
        if (!priceId) {
            return NextResponse.json(
                { error: "Unable to resolve price from Stripe session" },
                { status: 422 }
            );
        }

        const index = buildPriceIndex();
        const found = index.get(priceId);
        if (!found) {
            return NextResponse.json(
                { error: `Unrecognized price ${priceId}. Check your env price IDs.` },
                { status: 422 }
            );
        }

        const res = NextResponse.json({ ok: true, plan: found.plan, cycle: found.cycle });
        setPlanCookies(res, found.plan, found.cycle);
        return res;
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Confirm error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: "Stripe not configured (missing STRIPE_SECRET_KEY)" },
                { status: 500 }
            );
        }

        const url = new URL(req.url);
        const sessionId = url.searchParams.get("session_id");
        if (!sessionId) {
            return NextResponse.json(
                { error: "Missing session_id in query string" },
                { status: 400 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const priceId = await resolvePriceFromSession(stripe, sessionId);
        if (!priceId) {
            return NextResponse.json(
                { error: "Unable to resolve price from Stripe session" },
                { status: 422 }
            );
        }

        const index = buildPriceIndex();
        const found = index.get(priceId);
        if (!found) {
            return NextResponse.json(
                { error: `Unrecognized price ${priceId}. Check your env price IDs.` },
                { status: 422 }
            );
        }

        const res = NextResponse.json({ ok: true, plan: found.plan, cycle: found.cycle });
        setPlanCookies(res, found.plan, found.cycle);
        return res;
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Confirm error" },
            { status: 500 }
        );
    }
}
