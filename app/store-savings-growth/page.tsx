import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Savings Growth Calculator – FWV Plus Premium Tool",
    description:
        "Discover how the FWV Plus Savings Growth Calculator helps you forecast your future balance with contributions, interest, and time. Learn how it supports real savings goals.",
    alternates: {
        canonical: "https://fosterwealthventures.store/savings-growth",
    },
    openGraph: {
        title: "Savings Growth Calculator – FWV Plus",
        description:
            "Explore the FWV Plus Savings Growth Calculator and see how consistent saving and interest can grow your money over time.",
        url: "https://fosterwealthventures.store/savings-growth",
        siteName: "Foster Wealth Ventures Store",
        type: "website",
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <header className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl">
                        Savings Growth Calculator
                    </h1>
                    <h2 className="mb-6 text-xl text-emerald-600 dark:text-emerald-400">
                        A Premium Tool in the FWV Plus Suite
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                        Project your future savings with precision using our advanced calculator that factors in
                        regular contributions, interest rates, and time horizons.
                    </p>
                </header>

                <div className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <h3 className="mb-4 text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                        Why Use Our Savings Growth Calculator?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Visualize how regular contributions compound over time</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Compare different savings scenarios and strategies</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Set realistic goals with detailed yearly breakdowns</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Understand the impact of interest rates on your savings</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Perfect For Your Financial Goals
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Emergency Funds</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Calculate how quickly you can build a robust emergency fund with regular contributions.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Down Payments</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Plan and track your progress toward a home down payment with realistic timelines.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Education Savings</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Project college fund growth and ensure you're on track for future education expenses.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Key Features
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 0c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Flexible Contributions</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Set up monthly or yearly contributions that fit your budget and savings goals.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Visual Growth Charts</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    See your savings projected over time with easy-to-understand charts and graphs.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Yearly Breakdowns</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Track your progress with detailed annual summaries of balance and interest earned.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Secure Data Storage</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Your savings plans are securely saved and accessible whenever you need them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="https://calculators.fosterwealthventures.com/savings-growth"
                        className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
                    >
                        Preview the Savings Growth Calculator
                    </Link>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Available exclusively with FWV Plus membership
                    </p>
                </div>
            </div>
        </div>
    );
}