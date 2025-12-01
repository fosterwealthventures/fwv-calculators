import LockedProCalculatorPreview from "@/components/LockedProCalculatorPreview";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Expense Split Deluxe (FWV PRO) – Advanced Cost Sharing",
    description:
        "Unlock FWV PRO Expense Split Deluxe tool to divide shared expenses with item-level detail, custom weights, recurring costs, and multiple participants.",
    alternates: {
        canonical: "https://calculators.fosterwealthventures.com/expense-split-deluxe",
    },
    openGraph: {
        title: "Expense Split Deluxe – FWV PRO",
        description:
            "Split expenses fairly using custom weight, item assignments, recurring charges, and multi-person scenarios.",
        url: "https://calculators.fosterwealthventures.com/expense-split-deluxe",
        siteName: "FWV Calculators",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <LockedProCalculatorPreview
                    imageSrc="/images/expense-split-deluxe-preview.png"
                    title="Expense Split Deluxe"
                />

                {/* FAQ Section */}
                <section className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Expense Split Deluxe FAQ</h2>

                    <div>
                        <h3 className="font-semibold">What does Expense Split Deluxe do?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            This tool splits expenses among multiple people using advanced rules like
                            custom weights, specific item assignments, recurring bills, adjustments,
                            and shared percentages. It creates a fair final breakdown for each person.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Who is this for?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Perfect for roommates, households, group travel planners, and business
                            teams who share recurring or itemized expenses and want accuracy and
                            fairness.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Can it handle recurring expenses?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Yes. You can enter monthly or annual recurring items like rent, utilities,
                            subscriptions, or shared business costs, and calculator will allocate
                            them consistently.
                        </p>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-12">
                    <p className="text-gray-700 dark:text-gray-300">
                        For simpler bill splits, you can also use our free{" "}
                        <Link href="/tip-split" className="underline text-emerald-700 dark:text-emerald-400">
                            Tip Split Calculator
                        </Link>{" "}
                        or our{" "}
                        <Link href="/shopping-budget" className="underline text-emerald-700 dark:text-emerald-400">
                            Shopping Budget Calculator
                        </Link>{" "}
                        for planning purchases before splitting them.
                    </p>
                </section>
            </div>

            {/* FAQ Schema */}
            <Script
                id="expense-split-deluxe-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does Expense Split Deluxe do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "Expense Split Deluxe divides expenses with item-level assignment, weighted splits, recurring costs, and multi-person fairness.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Who is Expense Split Deluxe for?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "It's ideal for roommates, households, travel groups, and teams managing shared or recurring expenses.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Can it handle recurring expenses?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "Yes. The calculator supports recurring charges such as rent, utilities, subscriptions, and shared business costs.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}