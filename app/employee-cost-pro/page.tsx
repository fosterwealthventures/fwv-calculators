import LockedProCalculatorPreview from "@/components/LockedProCalculatorPreview";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Employee Cost Pro Calculator (FWV PRO) – True Cost of Hiring",
    description:
        "Unlock FWV PRO Employee Cost Calculator to estimate true hiring costs, including benefits, taxes, equipment, PTO, and overhead. Perfect for business owners and managers.",
    alternates: {
        canonical: "https://calculators.fosterwealthventures.com/employee-cost-pro",
    },
    openGraph: {
        title: "Employee Cost Pro – True Cost of Hiring",
        description:
            "See real cost of each employee with taxes, benefits, gear, onboarding, PTO, and overhead. Available in FWV PRO.",
        url: "https://calculators.fosterwealthventures.com/employee-cost-pro",
        siteName: "FWV Calculators",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <LockedProCalculatorPreview
                    imageSrc="/images/employee-cost-pro-preview.png"
                    title="Employee Cost Pro Calculator"
                />

                {/* FAQ Section */}
                <section className="mt-16 space-y-4">
                    <h2 className="text-2xl font-semibold">Employee Cost Pro FAQ</h2>

                    <div>
                        <h3 className="font-semibold">What does Employee Cost Pro Calculator do?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            This tool calculates full cost of hiring an employee by including
                            wages, payroll taxes, benefits, equipment, onboarding, PTO, and overhead.
                            It gives businesses a realistic view of annual and hourly employee cost.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Who is this calculator for?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            It's ideal for small businesses, HR teams, managers, and entrepreneurs who
                            need accurate hiring cost projections before expanding their team.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Does this include employer payroll taxes?</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Yes. It includes employer-side taxes such as Social Security, Medicare,
                            unemployment, and any other regional contributions.
                        </p>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-12">
                    <p className="text-gray-700 dark:text-gray-300">
                        If you're budgeting for hiring, you can also use our{" "}
                        <Link href="/break-even" className="underline text-emerald-700 dark:text-emerald-400">
                            Break-Even Calculator
                        </Link>{" "}
                        and{" "}
                        <Link href="/roi" className="underline text-emerald-700 dark:text-emerald-400">
                            ROI Calculator
                        </Link>{" "}
                        to evaluate how new roles impact profitability.
                    </p>
                </section>
            </div>

            {/* FAQ Schema */}
            <Script
                id="employee-cost-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does Employee Cost Pro Calculator do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "The Employee Cost Pro Calculator shows full cost of hiring, including wages, taxes, benefits, equipment, PTO and overhead.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Who is this calculator for?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "This calculator is built for small businesses, HR teams, hiring managers, and entrepreneurs needing accurate labor cost projections.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Does this include employer payroll taxes?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text:
                                        "Yes. It includes employer-side payroll taxes such as Social Security, Medicare, unemployment, and other local contributions.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}