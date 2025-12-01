import SavingsGrowthCalculator from "@/components/savings-growth-calc";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Savings Growth Calculator (FWV Plus) – See Your Future Balance",
    description:
        "Unlock the FWV Plus Savings Growth Calculator to project your future balance with contributions, interest rate, and time. See how consistent saving grows your money.",
    alternates: {
        canonical: "https://calculators.fosterwealthventures.com/savings-growth",
    },
    openGraph: {
        title: "Savings Growth Calculator (FWV Plus)",
        description:
            "Model your savings growth with deposits, interest rates, and timelines. Available in the FWV Plus suite of premium money tools.",
        url: "https://calculators.fosterwealthventures.com/savings-growth",
        siteName: "FWV Calculators",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <SavingsGrowthCalculator />

                {/* FAQ Section */}
                <section className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Savings Growth Calculator FAQ</h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold">What does the Savings Growth Calculator do?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            The Savings Growth Calculator helps you project how your money may grow
                            over time. You can combine a starting balance, regular contributions, an
                            interest rate, and a time horizon to see your potential future balance and
                            total interest earned.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">
                            What inputs do I need for the Savings Growth Calculator?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            You'll typically enter your starting savings balance, how much you
                            plan to contribute monthly or yearly, your expected interest or growth
                            rate, and how long you plan to save. The calculator uses these inputs to
                            estimate growth over time.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">
                            Is this calculator only for retirement savings?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            No. You can use it for any savings goal: emergency funds, down payments,
                            travel, college savings, or long-term investing. It's designed to
                            help you see the impact of consistent contributions over time.
                        </p>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-12">
                    <p className="text-gray-700 dark:text-gray-300">
                        Once you've mapped out your savings path, you can also use our{" "}
                        <Link href="/interest" className="underline text-emerald-700 dark:text-emerald-400">
                            Interest Calculator
                        </Link>{" "}
                        to understand simple vs compound growth, or our{" "}
                        <Link href="/mortgage" className="underline text-emerald-700 dark:text-emerald-400">
                            Mortgage Calculator
                        </Link>{" "}
                        if you're saving toward a future home.
                    </p>
                </section>
            </div>

            {/* FAQ Schema */}
            <Script
                id="savings-growth-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does the Savings Growth Calculator do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The Savings Growth Calculator projects how your savings may grow over time by combining your starting balance, regular contributions, an interest rate, and your time horizon.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "What inputs do I need for the Savings Growth Calculator?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "To use the Savings Growth Calculator you typically enter your starting balance, planned monthly or yearly contributions, expected interest or growth rate, and how long you plan to save.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Is this calculator only for retirement savings?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "No. The Savings Growth Calculator can be used for many goals, including emergency funds, down payments, travel, and long-term investing. It helps you visualize the effect of consistent contributions.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}