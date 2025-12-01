import OrderSplitCalculator from "@/components/order-split-calc";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Order Split Calculator (FWV Plus) – Advanced Split for Shared Orders",
    description:
        "Unlock the FWV Plus Order Split Calculator to divide complex orders by item, person, tax, and tip. Perfect for group orders, teams, and shared expenses.",
    alternates: {
        canonical: "https://calculators.fosterwealthventures.com/order-split",
    },
    openGraph: {
        title: "Order Split Calculator (FWV Plus)",
        description:
            "Use the Order Split Calculator to handle advanced splits for shared orders with different items, quantities, and people.",
        url: "https://calculators.fosterwealthventures.com/order-split",
        siteName: "FWV Calculators",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <OrderSplitCalculator />

                {/* FAQ Section */}
                <section className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Order Split Calculator FAQ</h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold">What does the Order Split Calculator do?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            The Order Split Calculator is built for complex group orders. You can
                            assign specific items to different people, include quantities, and apply
                            tax and tip so that everyone pays only for what they ordered.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">
                            How is this different from the regular tip split calculator?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            The Tip & Tab Split Calculator is great for simple, even splits. The Order
                            Split Calculator is a FWV Plus tool designed for more detailed scenarios
                            where people order different items and want an exact breakdown.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Who is this calculator best for?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            It's ideal for roommates, group trips, work teams, club events, or
                            anyone regularly managing detailed shared bills or orders where fairness
                            really matters.
                        </p>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-12">
                    <p className="text-gray-700 dark:text-gray-300">
                        For simpler nights out, you can still use our free{" "}
                        <Link href="/tip-split" className="underline text-emerald-700 dark:text-emerald-400">
                            Tip & Tab Split Calculator
                        </Link>
                        , and when you need the extra detail, the Order Split Calculator is ready
                        inside FWV Plus.
                    </p>
                </section>
            </div>

            {/* FAQ Schema */}
            <Script
                id="order-split-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does the Order Split Calculator do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The Order Split Calculator lets you split complex group orders by assigning specific items, quantities, tax, and tip to each person so everyone pays their fair share.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "How is this different from the regular tip split calculator?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The regular tip split calculator is designed for simple, mostly even bill splits, while the Order Split Calculator is a FWV Plus tool that handles detailed, item-level split scenarios.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Who is this calculator best for?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The Order Split Calculator is ideal for roommates, group travel, shared households, or teams that frequently manage detailed shared bills or complex orders.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}