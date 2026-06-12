"use client";

import { DollarSign, Plus, Trash2, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmailResultsForm from "./EmailResultsForm";
import ResultActions from "./ResultActions";

interface Card {
  id: number;
  name: string;
  limit: string;
  balance: string;
  payment: string;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function pct(n: number) {
  return n.toFixed(1) + "%";
}

function riskLabel(util: number): { label: string; color: string; bg: string } {
  if (util >= 50) return { label: "High Risk", color: "text-red-700", bg: "bg-red-50 border-red-200" };
  if (util >= 30) return { label: "Moderate", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
  return { label: "Healthy", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
}

export default function CreditUtilizationCalculator() {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, name: "Card 1", limit: "5000", balance: "2800", payment: "500" },
    { id: 2, name: "Card 2", limit: "3000", balance: "900", payment: "200" },
  ]);
  const nextId = Math.max(...cards.map((c) => c.id)) + 1;

  function addCard() {
    setCards((prev) => [...prev, { id: nextId, name: `Card ${nextId}`, limit: "", balance: "", payment: "" }]);
  }

  function removeCard(id: number) {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function update(id: number, field: keyof Card, value: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  const parsed = cards.map((c) => ({
    ...c,
    limitN: parseFloat(c.limit) || 0,
    balanceN: parseFloat(c.balance) || 0,
    paymentN: parseFloat(c.payment) || 0,
  }));

  const totalLimit = parsed.reduce((s, c) => s + c.limitN, 0);
  const totalBalance = parsed.reduce((s, c) => s + c.balanceN, 0);
  const totalPayment = parsed.reduce((s, c) => s + c.paymentN, 0);
  const newBalance = Math.max(totalBalance - totalPayment, 0);

  const currentUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
  const newUtil = totalLimit > 0 ? (newBalance / totalLimit) * 100 : 0;

  const current = riskLabel(currentUtil);
  const after = riskLabel(newUtil);

  // Which card to pay first: highest utilization per card
  const ranked = [...parsed]
    .filter((c) => c.limitN > 0)
    .map((c) => ({ ...c, util: c.limitN > 0 ? (c.balanceN / c.limitN) * 100 : 0 }))
    .sort((a, b) => b.util - a.util);

  const topCard = ranked[0];

  const summaryText = [
    "Calculator name: Credit Utilization Optimizer",
    `Date generated: ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}`,
    `Card summary: ${parsed
      .map((card) => `${card.name} - limit ${fmt(card.limitN)}, balance ${fmt(card.balanceN)}, planned payment ${fmt(card.paymentN)}`)
      .join("; ")}`,
    `Total credit limit: ${fmt(totalLimit)}`,
    `Total current balance: ${fmt(totalBalance)}`,
    `Current utilization: ${pct(currentUtil)}`,
    `Planned payment: ${fmt(totalPayment)}`,
    `New projected balance: ${fmt(newBalance)}`,
    `New projected utilization: ${pct(newUtil)}`,
    `Utilization risk level: ${current.label} current, ${after.label} projected`,
    `Suggested next step: ${topCard ? `Pay down ${topCard.name} first because it has the highest utilization.` : "Add a card with a positive limit to see a next step."}`,
    "CTA note: For a deeper review, explore Credit Insight Intelligence.",
    "Disclaimer: Educational estimate only. This does not predict or guarantee a credit score change and is not credit repair, legal, or financial advice.",
  ].join("\n");

  return (
    <div className="space-y-6">
      {/* Cards input */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                className="text-sm font-semibold text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-500 w-32"
                value={card.name}
                onChange={(e) => update(card.id, "name", e.target.value)}
                placeholder="Card name"
              />
              <button
                onClick={() => removeCard(card.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Remove card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Credit limit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    className="block w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                    value={card.limit}
                    onChange={(e) => update(card.id, "limit", e.target.value)}
                    placeholder="5000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Current balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    className="block w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                    value={card.balance}
                    onChange={(e) => update(card.id, "balance", e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Planned payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    className="block w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                    value={card.payment}
                    onChange={(e) => update(card.id, "payment", e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
            {/* Per-card utilization bar */}
            {parseFloat(card.limit) > 0 && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Card utilization</span>
                  <span className="font-medium">
                    {pct((parseFloat(card.balance) || 0) / (parseFloat(card.limit) || 1) * 100)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(card.balance) || 0) / (parseFloat(card.limit) || 1) * 100, 100)}%`,
                      backgroundColor:
                        (parseFloat(card.balance) || 0) / (parseFloat(card.limit) || 1) >= 0.5
                          ? "#ef4444"
                          : (parseFloat(card.balance) || 0) / (parseFloat(card.limit) || 1) >= 0.3
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addCard}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add another card
        </button>
      </div>

      {/* Results */}
      {totalLimit > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Your results</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-2xl border p-4 ${current.bg}`}>
              <p className="text-xs font-medium text-slate-500 mb-1">Current utilization</p>
              <p className="text-2xl font-bold text-slate-800">{pct(currentUtil)}</p>
              <span className={`text-xs font-semibold ${current.color}`}>{current.label}</span>
            </div>
            <div className={`rounded-2xl border p-4 ${after.bg}`}>
              <p className="text-xs font-medium text-slate-500 mb-1">After payment</p>
              <p className="text-2xl font-bold text-slate-800">{pct(newUtil)}</p>
              <span className={`text-xs font-semibold ${after.color}`}>{after.label}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total credit limit</span>
              <span className="font-semibold">${fmt(totalLimit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total balance</span>
              <span className="font-semibold">${fmt(totalBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total planned payment</span>
              <span className="font-semibold text-emerald-700">${fmt(totalPayment)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-600">Balance after payment</span>
              <span className="font-semibold">${fmt(newBalance)}</span>
            </div>
          </div>

          {/* Pay first recommendation */}
          {topCard && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-lg p-2 mt-0.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pay this card first</p>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-semibold text-emerald-700">{topCard.name}</span> has the highest
                    utilization at <span className="font-semibold">{pct(topCard.util)}</span>. Paying it down
                    will have the biggest impact on your overall credit profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          <ResultActions getSummary={() => summaryText} filenamePrefix="credit-utilization-summary" />

          <EmailResultsForm
            calculatorName="Credit Utilization Optimizer"
            calculatorType="credit"
            summaryText={summaryText}
            ctaLabel="Start Credit Insight Intelligence"
            ctaUrl="https://fosterwealthventures.com/credit-insight"
            disclaimer="Educational estimate only. This does not predict or guarantee a credit score change and is not credit repair, legal, or financial advice."
          />

          {/* CTA to CII */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 rounded-lg p-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Utilization is only part of your credit picture.</p>
                <p className="text-sm text-slate-300 mt-1">
                  Credit Insight Intelligence gives you a full 9-page audit — accounts, collections,
                  inquiries, consumer law citations, and a dispute readiness review.
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
