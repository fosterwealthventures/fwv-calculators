import { handleWebhook, stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err)
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        )
    }

    try {
        await handleWebhook({ event })
        return NextResponse.json({ received: true })
    } catch (err) {
        console.error(`Webhook handling failed.`, err)
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}