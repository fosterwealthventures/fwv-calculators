/** Debt Payoff Calculator component (client) */
"use client";
import { CreditCard, Edit, Plus, TrendingDown, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Debt = {
    id: string;
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
};

type PayoffMethod = "snowball" | "avalanche";

export default function DebtPayoffCalculator() {
    const [debts, setDebts] = useLocalStorage<Debt[]>("debt-payoff.debts", []);
    const [extraPayment, setExtraPayment] = useLocalStorage<string>("debt-payoff.extra", "100");
    const [method, setMethod] = useLocalStorage<PayoffMethod>("debt-payoff.method", "snowball");

    const [newDebt, setNewDebt] = useState({
        name: "",
        balance: "",
        interestRate: "",
        minimumPayment: ""
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDebt, setEditDebt] = useState({
        name: "",
        balance: "",
        interestRate: "",
        minimumPayment: ""
    });

    const parsedExtraPayment = useMemo(() => parseFloat(extraPayment) || 0, [extraPayment]);

    const { totalBalance, totalMinimumPayment, payoffResults } = useMemo(() => {
        const totalBal = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const totalMin = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

        if (debts.length === 0) {
            return {
                totalBalance: 0,
                totalMinimumPayment: 0,
                payoffResults: {
                    months: 0,
                    totalInterest: 0,
                    totalPaid: 0,
                    paymentSchedule: []
                }
            };
        }

        // Create a copy of debts to work with
        const workingDebts = [...debts].map(debt => ({ ...debt }));

        // Sort based on method
        if (method === "snowball") {
            workingDebts.sort((a, b) => a.balance - b.balance);
        } else { // avalanche
            workingDebts.sort((a, b) => b.interestRate - a.interestRate);
        }

        let month = 0;
        let totalInterestPaid = 0;
        let totalPaid = 0;
        const paymentSchedule = [];

        // Continue until all debts are paid off
        while (workingDebts.some(debt => debt.balance > 0)) {
            month++;
            let monthlyPayment = totalMin + parsedExtraPayment;
            let remainingPayment = monthlyPayment;

            // Process each debt for this month
            for (const debt of workingDebts) {
                if (debt.balance <= 0) continue;

                // Calculate interest for this month
                const monthlyInterest = debt.balance * (debt.interestRate / 100 / 12);
                debt.balance += monthlyInterest;
                totalInterestPaid += monthlyInterest;

                // Apply minimum payment
                const paymentAmount = Math.min(debt.minimumPayment, debt.balance);
                debt.balance -= paymentAmount;
                remainingPayment -= paymentAmount;
                totalPaid += paymentAmount;

                // If debt is paid off, redistribute remaining payment
                if (debt.balance <= 0 && remainingPayment > 0) {
                    // Find the next debt with balance > 0
                    const nextDebt = workingDebts.find(d => d.balance > 0);
                    if (nextDebt) {
                        const extraPaymentAmount = Math.min(remainingPayment, nextDebt.balance);
                        nextDebt.balance -= extraPaymentAmount;
                        totalPaid += extraPaymentAmount;
                        remainingPayment -= extraPaymentAmount;
                    }
                }
            }

            // If there's still remaining payment after minimums, apply to first debt
            if (remainingPayment > 0) {
                const firstDebt = workingDebts.find(debt => debt.balance > 0);
                if (firstDebt) {
                    const extraPaymentAmount = Math.min(remainingPayment, firstDebt.balance);
                    firstDebt.balance -= extraPaymentAmount;
                    totalPaid += extraPaymentAmount;
                }
            }

            // Record status every 12 months
            if (month % 12 === 0) {
                paymentSchedule.push({
                    year: month / 12,
                    totalBalance: workingDebts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0),
                    totalInterestPaid,
                    totalPaid
                });
            }
        }

        return {
            totalBalance: totalBal,
            totalMinimumPayment: totalMin,
            payoffResults: {
                months: month,
                totalInterest: totalInterestPaid,
                totalPaid,
                paymentSchedule
            }
        };
    }, [debts, extraPayment, method]);

    const addDebt = () => {
        if (!newDebt.name.trim() ||
            isNaN(parseFloat(newDebt.balance)) || parseFloat(newDebt.balance) <= 0 ||
            isNaN(parseFloat(newDebt.interestRate)) || parseFloat(newDebt.interestRate) < 0 ||
            isNaN(parseFloat(newDebt.minimumPayment)) || parseFloat(newDebt.minimumPayment) <= 0) {
            return;
        }

        const debt: Debt = {
            id: Date.now().toString(),
            name: newDebt.name.trim(),
            balance: parseFloat(newDebt.balance),
            interestRate: parseFloat(newDebt.interestRate),
            minimumPayment: parseFloat(newDebt.minimumPayment)
        };

        setDebts([...debts, debt]);

        // Reset form
        setNewDebt({
            name: "",
            balance: "",
            interestRate: "",
            minimumPayment: ""
        });
    };

    const startEdit = (debt: Debt) => {
        setEditingId(debt.id);
        setEditDebt({
            name: debt.name,
            balance: debt.balance.toString(),
            interestRate: debt.interestRate.toString(),
            minimumPayment: debt.minimumPayment.toString()
        });
    };

    const saveEdit = () => {
        if (!editingId ||
            !editDebt.name.trim() ||
            isNaN(parseFloat(editDebt.balance)) || parseFloat(editDebt.balance) <= 0 ||
            isNaN(parseFloat(editDebt.interestRate)) || parseFloat(editDebt.interestRate) < 0 ||
            isNaN(parseFloat(editDebt.minimumPayment)) || parseFloat(editDebt.minimumPayment) <= 0) {
            return;
        }

        setDebts(debts.map(debt =>
            debt.id === editingId
                ? {
                    ...debt,
                    name: editDebt.name.trim(),
                    balance: parseFloat(editDebt.balance),
                    interestRate: parseFloat(editDebt.interestRate),
                    minimumPayment: parseFloat(editDebt.minimumPayment)
                }
                : debt
        ));

        cancelEdit();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDebt({
            name: "",
            balance: "",
            interestRate: "",
            minimumPayment: ""
        });
    };

    const deleteDebt = (id: string) => {
        setDebts(debts.filter(debt => debt.id !== id));
    };

    const yearsToPayoff = payoffResults.months > 0 ? payoffResults.months / 12 : 0;
    const payoffDate = payoffResults.months > 0
        ? new Date(new Date().setMonth(new Date().getMonth() + payoffResults.months))
        : null;

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <h1 className="text-2xl font-semibold">Debt Payoff Calculator</h1>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Input Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Your Debts</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Debt Name
                            </label>
                            <input
                                type="text"
                                value={newDebt.name}
                                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="Credit Card, Car Loan, etc."
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Balance
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={newDebt.balance}
                                    onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="5000"
                                />
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
                                    value={newDebt.interestRate}
                                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="18.9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Minimum Monthly Payment
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={newDebt.minimumPayment}
                                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="150"
                                />
                            </div>
                        </div>

                        <button
                            onClick={addDebt}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                            <Plus className="h-4 w-4" /> Add Debt
                        </button>
                    </div>
                </section>

                {/* Strategy Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Payoff Strategy</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Payoff Method
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setMethod("snowball")}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${method === "snowball"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Snowball
                                </button>
                                <button
                                    onClick={() => setMethod("avalanche")}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${method === "avalanche"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Avalanche
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {method === "snowball"
                                    ? "Pay smallest debts first for quick wins"
                                    : "Pay highest interest rates first to save money"}
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                                Extra Monthly Payment
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={extraPayment}
                                    onChange={(e) => setExtraPayment(e.target.value)}
                                    className="w-full rounded-lg border pl-8 pr-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        {debts.length > 0 && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                    <TrendingDown className="h-5 w-5" />
                                    <h3 className="font-semibold">Payoff Summary</h3>
                                </div>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                        {payoffDate
                                            ? `Debt-free by ${payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                                            : "No debts to pay off"}
                                    </p>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                        {yearsToPayoff > 0 ? `${yearsToPayoff.toFixed(1)} years to payoff` : ""}
                                    </p>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                        Total interest: {currency.format(payoffResults.totalInterest)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Debts List */}
            {debts.length > 0 && (
                <section className="mt-8 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Your Debts</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Debt</th>
                                    <th className="px-4 py-3 text-right font-medium">Balance</th>
                                    <th className="px-4 py-3 text-right font-medium">Rate</th>
                                    <th className="px-4 py-3 text-right font-medium">Min Payment</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {debts.map((debt) => (
                                    <tr key={debt.id} className="border-t dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                                        <td className="px-4 py-3">
                                            {editingId === debt.id ? (
                                                <input
                                                    type="text"
                                                    value={editDebt.name}
                                                    onChange={(e) => setEditDebt({ ...editDebt, name: e.target.value })}
                                                    className="w-full rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                                                />
                                            ) : (
                                                debt.name
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {editingId === debt.id ? (
                                                <input
                                                    type="number"
                                                    value={editDebt.balance}
                                                    onChange={(e) => setEditDebt({ ...editDebt, balance: e.target.value })}
                                                    className="w-24 rounded border px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-950"
                                                />
                                            ) : (
                                                currency.format(debt.balance)
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {editingId === debt.id ? (
                                                <input
                                                    type="number"
                                                    value={editDebt.interestRate}
                                                    onChange={(e) => setEditDebt({ ...editDebt, interestRate: e.target.value })}
                                                    className="w-16 rounded border px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-950"
                                                />
                                            ) : (
                                                `${debt.interestRate}%`
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {editingId === debt.id ? (
                                                <input
                                                    type="number"
                                                    value={editDebt.minimumPayment}
                                                    onChange={(e) => setEditDebt({ ...editDebt, minimumPayment: e.target.value })}
                                                    className="w-24 rounded border px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-950"
                                                />
                                            ) : (
                                                currency.format(debt.minimumPayment)
                                            )}
                                        </td>
                                        <td className="px-2 py-3 text-right">
                                            {editingId === debt.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={saveEdit} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                                        Save
                                                    </button>
                                                    <button onClick={cancelEdit} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => startEdit(debt)} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => deleteDebt(debt.id)} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Payment Schedule */}
            {payoffResults.paymentSchedule.length > 0 && (
                <section className="mt-8 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Payment Schedule</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Year</th>
                                    <th className="px-4 py-3 text-right font-medium">Remaining Balance</th>
                                    <th className="px-4 py-3 text-right font-medium">Interest Paid</th>
                                    <th className="px-4 py-3 text-right font-medium">Total Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payoffResults.paymentSchedule.map((schedule, index) => (
                                    <tr key={index} className="border-t dark:border-neutral-800">
                                        <td className="px-4 py-3">{schedule.year}</td>
                                        <td className="px-4 py-3 text-right">{currency.format(schedule.totalBalance)}</td>
                                        <td className="px-4 py-3 text-right">{currency.format(schedule.totalInterestPaid)}</td>
                                        <td className="px-4 py-3 text-right">{currency.format(schedule.totalPaid)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
