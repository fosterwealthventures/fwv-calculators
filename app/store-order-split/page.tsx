import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Order Split Calculator – FWV Plus Premium Tool",
    description:
        "Learn how the FWV Plus Order Split Calculator helps you divide detailed group orders by item, person, tax, and tip with full transparency.",
    alternates: {
        canonical: "https://fosterwealthventures.store/order-split",
    },
    openGraph: {
        title: "Order Split Calculator – FWV Plus",
        description:
            "Explore the FWV Plus Order Split Calculator and see how it can simplify item-level bill splitting for groups, teams, and households.",
        url: "https://fosterwealthventures.store/order-split",
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
                        Order Split Calculator
                    </h1>
                    <h2 className="mb-6 text-xl text-emerald-600 dark:text-emerald-400">
                        A Premium Tool in the FWV Plus Suite
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                        Split complex group orders with precision by assigning specific items to each person,
                        including quantities, tax, and tip calculations.
                    </p>
                </header>

                <div className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <h3 className="mb-4 text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                        Why Use Our Order Split Calculator?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Split bills by specific items instead of simple equal divisions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Handle complex orders with multiple people and item quantities</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Automatically calculate fair tax and tip distributions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Eliminate disputes over who owes what with transparent calculations</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Perfect For These Scenarios
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Roommates & Households</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Split grocery bills, household expenses, and shared purchases fairly among roommates.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Group Dining</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Handle restaurant bills where everyone ordered different items at varying prices.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Team Events</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Organize office party supplies, team lunches, or group gifts with precise cost sharing.
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Person Assignment</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Assign each item to specific people with just a few taps for precise cost allocation.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Quantity Support</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Handle items with multiple quantities and automatically split costs proportionally.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 0c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Tax & Tip Distribution</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Automatically calculate and distribute tax and tip based on each person's share of the bill.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Detailed Summary</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Get a clear breakdown of what each person owes with itemized details for complete transparency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="https://calculators.fosterwealthventures.com/order-split"
                        className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
                    >
                        Preview the Order Split Calculator
                    </Link>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Available exclusively with FWV Plus membership
                    </p>
                </div>
            </div>
        </div>
    );
}