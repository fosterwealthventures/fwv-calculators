import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Debt Payoff Calculator – FWV Plus Premium Tool",
    description:
        "Learn how the FWV Plus Debt Payoff Calculator helps you choose between snowball and avalanche methods and build a real payoff plan.",
    alternates: {
        canonical: "https://fosterwealthventures.store/debt-payoff",
    },
    openGraph: {
        title: "Debt Payoff Calculator – FWV Plus",
        description:
            "Explore the FWV Plus Debt Payoff Calculator and see how it helps you organize balances, rates, and payments into a clear roadmap toward debt freedom.",
        url: "https://fosterwealthventures.store/debt-payoff",
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
                        Debt Payoff Calculator
                    </h1>
                    <h2 className="mb-6 text-xl text-emerald-600 dark:text-emerald-400">
                        A Premium Tool in the FWV Plus Suite
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                        Take control of your debt with our advanced calculator that helps you compare payoff strategies
                        and create a customized plan to become debt-free faster.
                    </p>
                </header>

                <div className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <h3 className="mb-4 text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                        Why Use Our Debt Payoff Calculator?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Compare snowball vs. avalanche payoff strategies with real calculations</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>See exactly when you'll be debt-free with extra payments</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Visualize interest savings from different payoff approaches</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-emerald-600 dark:text-emerald-400">•</span>
                            <span>Track multiple debts in one organized dashboard</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Choose Your Payoff Strategy
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Snowball Method</h4>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Pay off debts from smallest to largest balance, regardless of interest rate.
                                This approach builds momentum with quick wins.
                            </p>
                            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Best for: Those who need motivation from early victories
                                </p>
                            </div>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-emerald-600 dark:text-emerald-400">Avalanche Method</h4>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Pay off debts with the highest interest rates first, regardless of balance.
                                This approach minimizes total interest paid.
                            </p>
                            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                                <p className="text-sm text-purple-800 dark:text-purple-300">
                                    Best for: Those focused on maximizing financial efficiency
                                </p>
                            </div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Multiple Debt Tracking</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Organize all your debts in one place with balances, rates, and minimum payments.
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
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Strategy Comparison</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    See side-by-side comparisons of snowball vs. avalanche payoff timelines and interest savings.
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
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Payoff Timeline</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Get a clear date when you'll be debt-free based on your current plan and extra payments.
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
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Extra Payment Impact</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    See how additional monthly payments accelerate your debt freedom and reduce interest.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="https://calculators.fosterwealthventures.com/debt-payoff"
                        className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
                    >
                        Preview the Debt Payoff Calculator
                    </Link>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Available exclusively with FWV Plus membership
                    </p>
                </div>
            </div>
        </div>
    );
}