import { authOptions } from "@/lib/auth"
import { createBillingPortalSession } from "@/lib/stripe"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const { returnUrl } = (await req.json()) as {
            returnUrl?: string
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: "Stripe not configured (missing STRIPE_SECRET_KEY)" },
                { status: 500 }
            )
        }

        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        const defaultReturnUrl = `${base}/account`

        const portalSession = await createBillingPortalSession({
            customerId: session.user.stripeCustomerId as string,
            returnUrl: returnUrl || defaultReturnUrl,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Billing portal error" },
            { status: 500 }
        )
    }
}