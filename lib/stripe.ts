import Stripe from "stripe";
import { prisma } from "./prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true,
});

// Helper function to create a Stripe checkout session
export async function createCheckoutSession({
    userId,
    priceId,
    successUrl,
    cancelUrl,
}: {
    userId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
}) {
    // Get the user's Stripe customer ID
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
        throw new Error("User does not have a Stripe customer ID");
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
    });

    return session;
}

// Helper function to create a Stripe billing portal session
export async function createBillingPortalSession({
    customerId,
    returnUrl,
}: {
    customerId: string;
    returnUrl: string;
}) {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return session;
}

// Helper function to handle Stripe webhooks
export async function handleWebhook({
    event,
}: {
    event: Stripe.Event;
}) {
    switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Get the price ID to determine the plan
            const priceId = subscription.items.data[0]?.price?.id;
            if (!priceId) break;

            // Determine the plan based on the price ID
            let plan = "FREE";
            if (priceId === process.env.STRIPE_PRICE_PLUS || priceId === process.env.STRIPE_PRICE_PLUS_YEARLY) {
                plan = "PLUS";
            } else if (priceId === process.env.STRIPE_PRICE_PRO_EMPLOYEE || priceId === process.env.STRIPE_PRICE_PRO_EMPLOYEE_YEARLY) {
                plan = "PRO";
            } else if (priceId === process.env.STRIPE_PRICE_PRO_SPLIT || priceId === process.env.STRIPE_PRICE_PRO_SPLIT_YEARLY) {
                plan = "PRO";
            } else if (priceId === process.env.STRIPE_PRICE_PREMIUM || priceId === process.env.STRIPE_PRICE_PREMIUM_YEARLY) {
                plan = "PREMIUM";
            }

            // Update the user's plan and subscription ID
            await prisma.user.update({
                where: { stripeCustomerId: customerId },
                data: {
                    plan: plan as "FREE" | "PLUS" | "PRO" | "PREMIUM",
                    stripeSubscriptionId: subscription.id,
                    // Set proChoice based on the price ID
                    proChoice: priceId === process.env.STRIPE_PRICE_PRO_EMPLOYEE || priceId === process.env.STRIPE_PRICE_PRO_EMPLOYEE_YEARLY
                        ? "EMPLOYEE"
                        : priceId === process.env.STRIPE_PRICE_PRO_SPLIT || priceId === process.env.STRIPE_PRICE_PRO_SPLIT_YEARLY
                            ? "EXPENSE_SPLIT_DELUXE"
                            : null,
                },
            });
            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Update the user's plan to FREE and clear subscription ID
            await prisma.user.update({
                where: { stripeCustomerId: customerId },
                data: {
                    plan: "FREE",
                    stripeSubscriptionId: null,
                    proChoice: null,
                },
            });
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}