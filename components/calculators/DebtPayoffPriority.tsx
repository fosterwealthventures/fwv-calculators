"use client";

import { DollarSign, Plus, Trash2, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmailResultsForm from "./EmailResultsForm";
import ResultActions from "./ResultActions";

interface Debt {
  id: number;
  name: string;
  balance: string;
  rate: string;
  minPayment: string;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function monthsToPayoff(balance: number, rate: number, payment: number): number {
  if (balance <= 0) return 0;
  if (rate === 0) return Math.ceil(balance / payment);
  const r = rate / 100 / 12;
  if (payment <= balance * r) return Infinity;
  return Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
}

function totalInterest(balance: number, rate: number, payment: number): number {
  if (balance <= 0) return 0;
  if (rate === 0) return 0;
  const months = monthsToPayoff(balance, rate, payment);
  if (!isFinite(months)) return Infinity;
  return payment * months - balance;
}

function formatMonths(m: number): string {
  if (!isFinite(m) || m <= 0) return "—";
  const years = Math.floor(m / 12);
  const months = m % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr`;
  return `${years}yr ${months}mo`;
}

const STRATEGY_INFO = {
  avalanche: {
    label: "Avalanche",
    sublabel: "Highest interest first",
    description: "Pay minimums on all debts, then throw every extra dollar at the highest-rate debt. Saves the most money in interest.",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  snowball: {
    label: "Snowball",
    sublabel: "Lowest balance first",
    description: "Pay minimums on all debts, then attack the smallest balance first. Gives you quick wins that build momentum.",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
  },
};

export default function DebtPayoffPriority() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card A", balance: "4200", rate: "24.99", minPayment: "105" },
    { id: 2, name: "Credit Card B", balance: "1800", rate: "19.99", minPayment: "45" },
    { id: 3, name: "Personal Loan", balance: "6500", rate: "11.5", minPayment: "150" },
  ]);
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");
  const [extraPayment, setExtraPayment] = useState("100");

  const nextId = Math.max(...debts.map((d) => d.id)) + 1;

  function addDebt() {
    setDebts((prev) => [...prev, { id: nextId, name: `Debt ${nextId}`, balance: "", rate: "", minPayment: "" }]);
  }

  function removeDebt(id: number) {
    if (debts.length <= 1) return;
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }

  function update(id: number, field: keyof Debt, value: string) {
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  const parsed = debts.map((d) => ({
    ...d,
    balanceN: parseFloat(d.balance) || 0,
    rateN: parseFloat(d.rate) || 0,
    minN: parseFloat(d.minPayment) || 0,
  })).filter((d) => d.balanceN > 0);

  const extra = parseFloat(extraPayment) || 0;
  const totalMinimums = parsed.reduce((s, d) => s + d.minN, 0);
  const totalBalance = parsed.reduce((s, d) => s + d.balanceN, 0);

  // Sort by strategy
  const ranked = [...parsed].sort((a, b) =>
    strategy === "avalanche"
      ? b.rateN - a.rateN
      : a.balanceN - b.balanceN
  );

  // Calculate payoff for each debt with extra applied to #1 priority
  const withPayoff = ranked.map((d, i) => {
    const payment = i === 0 ? d.minN + extra : d.minN;
    const months = monthsToPayoff(d.balanceN, d.rateN, payment);
    const interest = totalInterest(d.balanceN, d.rateN, payment);
    return { ...d, payment, months, interest };
  });

  const totalInterestPaid = withPayoff.reduce((s, d) => s + (isFinite(d.interest) ? d.interest : 0), 0);

  // Compare: same debts without extra payment
  const baseInterest = parsed.reduce((s, d) => {
    const i = totalInterest(d.balanceN, d.rateN, d.minN);
    return s + (isFinite(i) ? i : 0);
  }, 0);

  const interestSaved = baseInterest - totalInterestPaid;
  const info = STRATEGY_INFO[strategy];

  const summaryText = [
    "Calculator name: Debt Payoff Priority Ranker",
    `Date generated: ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}`,
    `Debt list summary: ${parsed
      .map((debt) => `${debt.name} - balance ${fmt(debt.balanceN)}, APR ${debt.rateN}%, minimum ${fmt(debt.minN)}`)
      .join("; ")}`,
    `Recommended payoff order: ${withPayoff.map((debt, index) => `${index + 1}. ${debt.name}`).join("; ")}`,
    `Strategy selected: ${info.label}`,
    `Estimated priority reasoning: ${info.description}`,
    `Extra monthly payment: ${fmt(extra)}`,
    `Estimated interest: ${fmt(totalInterestPaid)}`,
    `Interest saved versus minimums: ${fmt(Math.max(interestSaved, 0))}`,
    "CTA note: For a deeper review, explore Credit Insight Intelligence.",
    "Disclaimer: Educational estimate only. This is not financial, legal, or credit repair advice and does not guarantee savings or credit outcomes.",
  ].join("\n");

  return (
    <div className="space-y-6">
      {/* Strategy toggle */}
      <div className="grid grid-cols-2 gap-3">
        {(["avalanche", "snowball"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              strategy === s
                ? `${STRATEGY_INFO[s].bg} border-current`
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className={`text-sm font-semibold ${strategy === s ? STRATEGY_INFO[s].color : "text-slate-700"}`}>
              {STRATEGY_INFO[s].label}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{STRATEGY_INFO[s].sublabel}</p>
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 text-sm ${info.bg}`}>
        <p className={info.color}>{info.description}</p>
      </div>

      {/* Extra payment input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Extra monthly payment (above minimums)
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            min="0"
            className="block w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            placeholder="100"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Total monthly: <span className="font-medium">${fmt(totalMinimums + extra)}</span>
        </p>
      </div>

      {/* Debt inputs */}
      <div className="space-y-3">
        {debts.map((debt) => (
          <div key={debt.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                className="text-sm font-semibold text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-500 w-36"
                value={debt.name}
                onChange={(e) => update(debt.id, "name", e.target.value)}
                placeholder="Debt name"
              />
              <button
                onClick={() => removeDebt(debt.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Remove debt"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    className="block w-full rounded-xl border border-slate-200 pl-6 pr-2 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    value={debt.balance}
                    onChange={(e) => update(debt.id, "balance", e.target.value)}
                    placeholder="4200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">APR %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  value={debt.rate}
                  onChange={(e) => update(debt.id, "rate", e.target.value)}
                  placeholder="24.99"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Min payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    className="block w-full rounded-xl border border-slate-200 pl-6 pr-2 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    value={debt.minPayment}
                    onChange={(e) => update(debt.id, "minPayment", e.target.value)}
                    placeholder="105"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addDebt}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add another debt
        </button>
      </div>

      {/* Results */}
      {parsed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Your payoff order</h3>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Total owed</p>
              <p className="text-lg font-bold text-slate-800">${fmt(totalBalance)}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Est. interest</p>
              <p className="text-lg font-bold text-slate-800">${fmt(totalInterestPaid)}</p>
            </div>
            <div className={`rounded-2xl border p-3 text-center ${interestSaved > 0 ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
              <p className="text-xs text-slate-500 mb-1">Interest saved</p>
              <p className={`text-lg font-bold ${interestSaved > 0 ? "text-emerald-700" : "text-slate-800"}`}>
                ${fmt(Math.max(interestSaved, 0))}
              </p>
            </div>
          </div>

          {/* Ranked list */}
          <div className="space-y-2">
            {withPayoff.map((debt, i) => (
              <div
                key={debt.id}
                className={`rounded-2xl border p-4 flex items-center gap-4 ${
                  i === 0 ? "bg-white border-emerald-300 shadow-sm" : "bg-white border-slate-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  i === 0 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {i === 0 ? <Trophy className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{debt.name}</p>
                    {i === 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.badge}`}>
                        Attack first
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ${fmt(debt.balanceN)} · {debt.rateN}% APR · min ${fmt(debt.minN)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-800">{formatMonths(debt.months)}</p>
                  <p className="text-xs text-slate-500">${fmt(isFinite(debt.interest) ? debt.interest : 0)} interest</p>
                </div>
              </div>
            ))}
          </div>

          <ResultActions getSummary={() => summaryText} filenamePrefix="debt-payoff-priority-summary" />

          <EmailResultsForm
            calculatorName="Debt Payoff Priority Ranker"
            calculatorType="credit"
            summaryText={summaryText}
            ctaLabel="Start Credit Insight Intelligence"
            ctaUrl="https://fosterwealthventures.com/credit-insight"
            disclaimer="Educational estimate only. This is not financial, legal, or credit repair advice and does not guarantee savings or credit outcomes."
          />

          {/* CTA to CII */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 rounded-lg p-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Debt payoff is step one. Your full credit profile is step two.</p>
                <p className="text-sm text-slate-300 mt-1">
                  Credit Insight Intelligence reviews your complete credit file — accounts, collections,
                  inquiries, and consumer law protections you may not know you have.
                </p>
                <Link
                  href="https://fosterwealthventures.com/credit-insight"
                  target="_blank"
                  className="inline-block mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Start My Credit Insight Review →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
