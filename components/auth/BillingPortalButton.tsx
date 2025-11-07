"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export function BillingPortalButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();

    if (!session || !session.user.stripeCustomerId) {
        return null; // Don't show billing portal button if user is not signed in or doesn't have a Stripe customer ID
    }

    const handleOpenBillingPortal = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/billing-portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    returnUrl: window.location.href,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Failed to open billing portal:", data.error);
            }
        } catch (error) {
            console.error("Billing portal error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleOpenBillingPortal}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
            {isLoading ? "Opening..." : "Manage Subscription"}
        </button>
    );
}