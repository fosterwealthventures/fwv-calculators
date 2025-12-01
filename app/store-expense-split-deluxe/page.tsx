import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Expense Split Deluxe – FWV PRO Premium Tool",
    description:
        "Discover how FWV PRO's Expense Split Deluxe makes splitting complex, itemized, or recurring expenses simple and fair.",
    alternates: {
        canonical: "https://fosterwealthventures.store/expense-split-deluxe",
    },
    openGraph: {
        title: "Expense Split Deluxe – FWV PRO",
        description:
            "Explore Expense Split Deluxe and see how it assigns costs by item, weight, and custom rules for perfect fairness.",
        url: "https://fosterwealthventures.store/expense-split-deluxe",
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
                        Expense Split Deluxe
                    </h1>
                    <h2 className="mb-6 text-xl text-purple-600 dark:text-purple-400">
                        A Premium Tool in FWV PRO Suite
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                        The most advanced expense splitting tool that handles complex scenarios with
                        custom weights, recurring costs, and multi-person fairness.
                    </p>
                </header>

                <div className="mb-12 rounded-2xl border border-purple-200 bg-purple-50 p-8 dark:border-purple-900/30 dark:bg-purple-900/10">
                    <h3 className="mb-4 text-xl font-semibold text-purple-800 dark:text-purple-300">
                        Why Use Expense Split Deluxe?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Split expenses with custom weights and percentages instead of just equal shares</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Handle recurring monthly or annual expenses with automatic allocation</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Assign specific items to specific people with complete precision</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Track payment history and settle up balances with detailed records</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Advanced Splitting Features
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Custom Weighting</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Assign different weights to participants based on income, usage, or any custom factor.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Item Assignment</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Assign specific items to specific people for precise cost allocation.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Recurring Expenses</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Set up monthly or annual recurring expenses that automatically split among participants.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Percentage Splits</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Split expenses by custom percentages instead of equal amounts or weights.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Balance Tracking</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Keep track of who owes whom with running balances and settlement history.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Multi-Currency</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Handle expenses in different currencies with automatic conversion and calculation.
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
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Multi-Person Groups</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Handle expense splitting for any size group with custom rules per person.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Detailed Reports</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate comprehensive reports of all expenses, splits, and balances.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 0c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Fairness Algorithms</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Advanced algorithms ensure the fairest split based on your custom rules.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Cloud Sync</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Access your expense splits from any device with secure cloud synchronization.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="https://calculators.fosterwealthventures.com/expense-split-deluxe"
                        className="inline-flex px-6 py-3 rounded-xl bg-purple-700 text-white font-semibold"
                    >
                        Preview Expense Split Deluxe
                    </Link>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Available exclusively with FWV PRO membership
                    </p>
                </div>
            </div>
        </div>
    );
}