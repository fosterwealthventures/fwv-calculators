/** Savings Growth Calculator component (client) */
"use client";
import { PiggyBank, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

type ContributionFrequency = "monthly" | "yearly";

export default function SavingsGrowthCalculator() {
    const [startingBalance, setStartingBalance] = useLocalStorage<string>("savings.starting", "10000");
    const [contribution, setContribution] = useLocalStorage<string>("savings.contribution", "500");
    const [frequency, setFrequency] = useLocalStorage<ContributionFrequency>("savings.frequency", "monthly");
    const [interestRate, setInterestRate] = useLocalStorage<string>("savings.rate", "7");
    const [years, setYears] = useLocalStorage<string>("savings.years", "20");

    const parsedStartingBalance = useMemo(() => parseFloat(startingBalance) || 0, [startingBalance]);
    const parsedContribution = useMemo(() => parseFloat(contribution) || 0, [contribution]);
    const parsedInterestRate = useMemo(() => parseFloat(interestRate) || 0, [interestRate]);
    const parsedYears = useMemo(() => parseInt(years, 10) || 0, [years]);

    const { finalBalance, totalContributions, totalInterest, yearlyData } = useMemo(() => {
        const monthlyRate = parsedInterestRate / 100 / 12;
        const monthlyContribution = frequency === "monthly" ? parsedContribution : parsedContribution / 12;
        const months = parsedYears * 12;

        let balance = parsedStartingBalance;
        let totalContrib = 0;
        let totalInt = 0;

        const yearlyBreakdown = [];

        for (let month = 1; month <= months; month++) {
            // Add interest for the month
            const monthlyInterest = balance * monthlyRate;
            balance += monthlyInterest;
            totalInt += monthlyInterest;

            // Add contribution for the month
            balance += monthlyContribution;
            totalContrib += monthlyContribution;

            // Record yearly data
            if (month % 12 === 0) {
                yearlyBreakdown.push({
                    year: month / 12,
                    balance,
                    contributions: totalContrib,
                    interest: totalInt,
                });
            }
        }

        return {
            finalBalance: balance,
            totalContributions: totalContrib,
            totalInterest: totalInt,
            yearlyData: yearlyBreakdown,
        };
    }, [parsedStartingBalance, parsedContribution, frequency, parsedInterestRate, parsedYears]);

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <PiggyBank className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <h1 className="text-2xl font-semibold">Savings Growth Calculator</h1>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Input Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Savings Parameters</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Starting Balance
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={startingBalance}
                                    onChange={(e) => setStartingBalance(e.target.value)}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="10000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Regular Contribution
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={contribution}
                                    onChange={(e) => setContribution(e.target.value)}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Contribution Frequency
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setFrequency("monthly")}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${frequency === "monthly"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setFrequency("yearly")}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${frequency === "yearly"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Interest Rate
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">%</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="7"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Time Horizon
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={years}
                                    onChange={(e) => setYears(e.target.value)}
                                    className="w-full rounded-lg border pl-3 pr-10 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="20"
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">years</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Projected Growth</h2>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                <TrendingUp className="h-5 w-5" />
                                <h3 className="font-semibold">Final Balance</h3>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                                {currency.format(finalBalance)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Your Contributions</p>
                                <p className="font-medium">{currency.format(totalContributions)}</p>
                            </div>
                            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Interest Earned</p>
                                <p className="font-medium">{currency.format(totalInterest)}</p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Interest as % of Final Balance</p>
                                <p className="font-medium">
                                    {finalBalance > 0 ? percentFormat.format(totalInterest / finalBalance) : "0%"}
                                </p>
                            </div>
                        </div>

                        <div className="h-40 w-full">
                            <div className="flex h-full items-end justify-between gap-1">
                                {yearlyData.slice(0, 10).map((data, index) => (
                                    <div key={index} className="flex flex-1 flex-col items-center">
                                        <div
                                            className="w-full rounded-t bg-emerald-500 dark:bg-emerald-400"
                                            style={{
                                                height: `${Math.min(100, (data.balance / Math.max(...yearlyData.map(d => d.balance), 1)) * 90)}%`,
                                            }}
                                        />
                                        <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {data.year}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                Yearly Balance Growth
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Yearly Breakdown Table */}
            <section className="mt-8 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Yearly Breakdown</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Year</th>
                                <th className="px-4 py-3 text-right font-medium">Balance</th>
                                <th className="px-4 py-3 text-right font-medium">Contributions</th>
                                <th className="px-4 py-3 text-right font-medium">Interest</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearlyData.map((data, index) => (
                                <tr key={index} className="border-t dark:border-neutral-800">
                                    <td className="px-4 py-3">{data.year}</td>
                                    <td className="px-4 py-3 text-right">{currency.format(data.balance)}</td>
                                    <td className="px-4 py-3 text-right">{currency.format(data.contributions)}</td>
                                    <td className="px-4 py-3 text-right">{currency.format(data.interest)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}