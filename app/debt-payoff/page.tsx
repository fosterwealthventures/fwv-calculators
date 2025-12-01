import DebtPayoffCalculator from "@/components/debt-payoff-calc";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Debt Payoff Calculator (FWV Plus) – Snowball & Avalanche Planner",
    description:
        "Unlock the FWV Plus Debt Payoff Calculator to build a custom payoff plan using snowball or avalanche methods. See payoff dates and interest saved.",
    alternates: {
        canonical: "https://calculators.fosterwealthventures.com/debt-payoff",
    },
    openGraph: {
        title: "Debt Payoff Calculator (FWV Plus)",
        description:
            "Use the FWV Plus Debt Payoff Calculator to organize your balances, rates, and payments into a clear payoff roadmap.",
        url: "https://calculators.fosterwealthventures.com/debt-payoff",
        siteName: "FWV Calculators",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <DebtPayoffCalculator />

                {/* FAQ Section */}
                <section className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Debt Payoff Calculator FAQ</h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold">What does the Debt Payoff Calculator do?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            The Debt Payoff Calculator helps you organize multiple debts into a clear
                            payoff plan. You can compare strategies like snowball (smallest balance
                            first) or avalanche (highest rate first) and see estimated payoff dates
                            and total interest paid.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">
                            What information do I need for this calculator?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            You'll need each debt's balance, interest rate, and minimum
                            payment. You can also add an extra monthly amount you want to put toward
                            debt. The calculator uses this to simulate how quickly you can pay off
                            each balance.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">
                            What is the difference between snowball and avalanche?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            With the snowball method, you pay off the smallest balances first to build
                            quick wins. With the avalanche method, you target the highest interest
                            rates first to minimize total interest paid. This calculator lets you
                            compare both.
                        </p>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-12">
                    <p className="text-gray-700 dark:text-gray-300">
                        As you plan your payoff journey, you can also use our{" "}
                        <Link href="/shopping-budget" className="underline text-emerald-700 dark:text-emerald-400">
                            Shopping Budget Calculator
                        </Link>{" "}
                        to free up extra cash each month or our{" "}
                        <Link href="/roi" className="underline text-emerald-700 dark:text-emerald-400">
                            ROI Calculator
                        </Link>{" "}
                        to evaluate which debts or investments to tackle first.
                    </p>
                </section>
            </div>

            {/* FAQ Schema */}
            <Script
                id="debt-payoff-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does the Debt Payoff Calculator do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The Debt Payoff Calculator creates a payoff plan by organizing multiple debts, showing estimated payoff dates, and comparing strategies like snowball and avalanche.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "What information do I need for this calculator?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "To use the Debt Payoff Calculator you need each debt's balance, interest rate, and minimum payment, plus any extra amount you plan to pay each month.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "What is the difference between snowball and avalanche?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The snowball method pays off the smallest balances first to create motivation, while the avalanche method targets the highest interest rates first to reduce the total interest you pay.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}