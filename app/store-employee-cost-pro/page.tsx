import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Employee Cost Pro – FWV PRO Premium Calculator",
    description:
        "Learn how FWV PRO Employee Cost Calculator helps you measure true labor cost across wages, benefits, taxes, PTO, and overhead.",
    alternates: {
        canonical: "https://fosterwealthventures.store/employee-cost-pro",
    },
    openGraph: {
        title: "Employee Cost Pro – FWV PRO",
        description:
            "Explore Employee Cost Pro, advanced calculator that helps you understand full financial impact of hiring.",
        url: "https://fosterwealthventures.store/employee-cost-pro",
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
                        Employee Cost Pro Calculator
                    </h1>
                    <h2 className="mb-6 text-xl text-purple-600 dark:text-purple-400">
                        A Premium Tool in FWV PRO Suite
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                        Calculate the true cost of hiring with our advanced calculator that factors in
                        wages, benefits, taxes, equipment, and all hidden employment expenses.
                    </p>
                </header>

                <div className="mb-12 rounded-2xl border border-purple-200 bg-purple-50 p-8 dark:border-purple-900/30 dark:bg-purple-900/10">
                    <h3 className="mb-4 text-xl font-semibold text-purple-800 dark:text-purple-300">
                        Why Use Our Employee Cost Pro Calculator?
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>See the complete financial picture beyond just salary</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Accurately budget for new hires before making offers</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Calculate true hourly cost for better project pricing</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-600 dark:text-purple-400">•</span>
                            <span>Make informed decisions about outsourcing vs. hiring</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
                        Comprehensive Cost Analysis
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Base Compensation</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Factor in salary, bonuses, commissions, and other direct payments to employees.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Benefits & Insurance</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Include health insurance, retirement plans, life insurance, and other benefits.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Payroll Taxes</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Account for employer portion of Social Security, Medicare, unemployment taxes.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Equipment & Workspace</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Calculate costs for computers, software, office space, and other work tools.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">Training & Onboarding</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Include recruitment costs, training time, and onboarding expenses.
                            </p>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h4 className="mb-3 font-medium text-purple-600 dark:text-purple-400">PTO & Paid Leave</h4>
                            <p className="text-gray-700 dark:text-gray-300">
                                Factor in paid time off, holidays, sick leave, and other paid absences.
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Comprehensive Cost Breakdown</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    See detailed breakdown of all employment costs with percentages and totals.
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
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Annual & Hourly Costs</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    View both total annual cost and true hourly rate for accurate budgeting.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Comparison Tools</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Compare multiple employee scenarios or locations to optimize hiring decisions.
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
                                <h4 className="mb-1 font-medium text-neutral-900 dark:text-white">Secure Data Storage</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Save and access your employee cost scenarios securely for future reference.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="https://calculators.fosterwealthventures.com/employee-cost-pro"
                        className="inline-flex px-6 py-3 rounded-xl bg-purple-700 text-white font-semibold"
                    >
                        Preview Employee Cost Pro
                    </Link>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Available exclusively with FWV PRO membership
                    </p>
                </div>
            </div>
        </div>
    );
}