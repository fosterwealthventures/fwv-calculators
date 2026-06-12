"use client";

import { Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmailResultsForm from "./EmailResultsForm";
import ResultActions from "./ResultActions";

function num(v: string) { return parseFloat(v) || 0; }
function pct(v: string) { return (parseFloat(v) || 0) / 100; }
function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtUSD(n: number) { return "$" + fmt(n, 2); }
function fmtPct(n: number) { return (n * 100).toFixed(2) + "%"; }

interface Inputs {
  purchasePrice: string;
  downPaymentPct: string;
  interestRate: string;
  loanTermYears: string;
  closingCostsPct: string;
  rehabBudget: string;
  monthlyRent: string;
  vacancyPct: string;
  propertyTaxMonthly: string;
  insuranceMonthly: string;
  hoaMonthly: string;
  maintenancePct: string;
  mgmtPct: string;
}

const DEFAULTS: Inputs = {
  purchasePrice: "250000",
  downPaymentPct: "20",
  interestRate: "7.25",
  loanTermYears: "30",
  closingCostsPct: "3",
  rehabBudget: "0",
  monthlyRent: "2200",
  vacancyPct: "5",
  propertyTaxMonthly: "250",
  insuranceMonthly: "120",
  hoaMonthly: "0",
  maintenancePct: "5",
  mgmtPct: "8",
};

function dealScore(cashOnCash: number, capRate: number, dscr: number): { label: string; color: string; bg: string; border: string } {
  const score = (cashOnCash >= 0.08 ? 2 : cashOnCash >= 0.05 ? 1 : 0)
    + (capRate >= 0.07 ? 2 : capRate >= 0.05 ? 1 : 0)
    + (dscr >= 1.25 ? 2 : dscr >= 1.1 ? 1 : 0);
  if (score >= 5) return { label: "Strong Deal", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" };
  if (score >= 3) return { label: "Watch & Negotiate", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" };
  return { label: "Weak Deal", color: "text-red-700", bg: "bg-red-50", border: "border-red-300" };
}

function InputField({ label, value, onChange, prefix, suffix, placeholder, helper }: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string; helper?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>}
        <input
          type="number"
          min="0"
          className={`block w-full rounded-xl border border-slate-200 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-8" : "pr-3"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{suffix}</span>}
      </div>
      {helper && <p className="text-xs text-slate-400 mt-0.5">{helper}</p>}
    </div>
  );
}

function KV({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-slate-100 last:border-0 ${highlight ? "font-semibold" : ""}`}>
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm ${highlight ? "text-emerald-700 text-base" : "text-slate-800"} font-medium`}>{value}</span>
    </div>
  );
}

export default function DealSnapshotCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);

  function set(field: keyof Inputs) {
    return (v: string) => setInputs((s) => ({ ...s, [field]: v }));
  }

  function reset() { setInputs(DEFAULTS); }

  // ── Calculations ──────────────────────────────────────────────────
  const price = num(inputs.purchasePrice);
  const downPct = pct(inputs.downPaymentPct);
  const downAmt = price * downPct;
  const loanAmt = price - downAmt;
  const rate = num(inputs.interestRate) / 100 / 12;
  const n = num(inputs.loanTermYears) * 12;
  const closingCosts = price * pct(inputs.closingCostsPct);
  const rehab = num(inputs.rehabBudget);
  const totalCashIn = downAmt + closingCosts + rehab;

  // Mortgage P&I
  const pi = rate > 0 && n > 0
    ? loanAmt * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
    : loanAmt / n;

  // Income
  const grossRent = num(inputs.monthlyRent);
  const vacancyLoss = grossRent * pct(inputs.vacancyPct);
  const effectiveIncome = grossRent - vacancyLoss;

  // Expenses
  const taxes = num(inputs.propertyTaxMonthly);
  const insurance = num(inputs.insuranceMonthly);
  const hoa = num(inputs.hoaMonthly);
  const maintenance = grossRent * pct(inputs.maintenancePct);
  const mgmt = grossRent * pct(inputs.mgmtPct);
  const totalExpenses = taxes + insurance + hoa + maintenance + mgmt;

  // NOI & Cash flow
  const noi = effectiveIncome - totalExpenses;
  const monthlyCashFlow = noi - pi;
  const annualCashFlow = monthlyCashFlow * 12;

  // Metrics
  const annualNOI = noi * 12;
  const capRate = price > 0 ? annualNOI / price : 0;
  const cashOnCash = totalCashIn > 0 ? annualCashFlow / totalCashIn : 0;
  const dscr = pi > 0 ? noi / pi : 0;
  const breakEvenRent = pi + totalExpenses;
  const grossYield = price > 0 ? (grossRent * 12) / price : 0;

  const score = dealScore(cashOnCash, capRate, dscr);
  const hasVisibleResults = price > 0 && grossRent > 0;

  const summaryText = [
    "Calculator name: Real Estate Deal Snapshot",
    `Date generated: ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}`,
    `Purchase price: ${fmtUSD(price)}`,
    `Down payment: ${fmtUSD(downAmt)}`,
    `Loan amount: ${fmtUSD(loanAmt)}`,
    `Estimated rent: ${fmtUSD(grossRent)}`,
    `Estimated monthly expenses: ${fmtUSD(totalExpenses)}`,
    `Estimated mortgage payment: ${fmtUSD(pi)}`,
    `Estimated monthly cash flow: ${fmtUSD(monthlyCashFlow)}`,
    `Cap rate: ${fmtPct(capRate)}`,
    `Cash-on-cash return: ${fmtPct(cashOnCash)}`,
    `DSCR: ${dscr.toFixed(2)}`,
    `Deal score: ${score.label}`,
    "CTA note: The calculator shows the numbers. HavenMIND helps you think through the decision.",
    "Disclaimer: Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability.",
  ].join("\n");

  return (
    <div className="space-y-6">
      {/* Inputs — two column grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Purchase</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InputField label="Purchase price" value={inputs.purchasePrice} onChange={set("purchasePrice")} prefix="$" placeholder="250000" />
          <InputField label="Down payment" value={inputs.downPaymentPct} onChange={set("downPaymentPct")} suffix="%" placeholder="20" helper={downAmt > 0 ? `$${fmt(downAmt)}` : ""} />
          <InputField label="Interest rate" value={inputs.interestRate} onChange={set("interestRate")} suffix="%" placeholder="7.25" />
          <InputField label="Loan term" value={inputs.loanTermYears} onChange={set("loanTermYears")} suffix="yrs" placeholder="30" />
          <InputField label="Closing costs" value={inputs.closingCostsPct} onChange={set("closingCostsPct")} suffix="%" placeholder="3" helper={closingCosts > 0 ? `$${fmt(closingCosts)}` : ""} />
          <InputField label="Rehab budget" value={inputs.rehabBudget} onChange={set("rehabBudget")} prefix="$" placeholder="0" />
        </div>

        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide pt-2">Income</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InputField label="Monthly rent" value={inputs.monthlyRent} onChange={set("monthlyRent")} prefix="$" placeholder="2200" />
          <InputField label="Vacancy rate" value={inputs.vacancyPct} onChange={set("vacancyPct")} suffix="%" placeholder="5" />
        </div>

        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide pt-2">Expenses</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InputField label="Property tax /mo" value={inputs.propertyTaxMonthly} onChange={set("propertyTaxMonthly")} prefix="$" placeholder="250" />
          <InputField label="Insurance /mo" value={inputs.insuranceMonthly} onChange={set("insuranceMonthly")} prefix="$" placeholder="120" />
          <InputField label="HOA /mo" value={inputs.hoaMonthly} onChange={set("hoaMonthly")} prefix="$" placeholder="0" />
          <InputField label="Maintenance" value={inputs.maintenancePct} onChange={set("maintenancePct")} suffix="% rent" placeholder="5" />
          <InputField label="Mgmt fee" value={inputs.mgmtPct} onChange={set("mgmtPct")} suffix="% rent" placeholder="8" />
        </div>
      </div>

      <button
        onClick={reset}
        className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
      >
        Reset to defaults
      </button>

      {/* Deal Score */}
      {hasVisibleResults && (
        <div className={`rounded-2xl border-2 p-5 ${score.bg} ${score.border}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Deal Score</p>
            <span className={`text-lg font-bold ${score.color}`}>{score.label}</span>
          </div>

          {/* Results grid */}
          <div className="bg-white/70 rounded-xl p-4 space-y-0">
            <KV label="Monthly cash flow" value={`${monthlyCashFlow >= 0 ? "" : "-"}${fmtUSD(Math.abs(monthlyCashFlow))}`} highlight />
            <KV label="Annual cash flow" value={`${annualCashFlow >= 0 ? "" : "-"}${fmtUSD(Math.abs(annualCashFlow))}`} />
            <KV label="Cap rate" value={fmtPct(capRate)} />
            <KV label="Cash-on-cash return" value={fmtPct(cashOnCash)} />
            <KV label="DSCR" value={dscr.toFixed(2)} />
            <KV label="Gross rent yield" value={fmtPct(grossYield)} />
            <KV label="Break-even rent" value={fmtUSD(breakEvenRent)} />
          </div>

          {/* Cash-in summary */}
          <div className="mt-3 bg-white/70 rounded-xl p-4 space-y-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total cash needed</p>
            <KV label="Down payment" value={fmtUSD(downAmt)} />
            <KV label="Closing costs" value={fmtUSD(closingCosts)} />
            <KV label="Rehab budget" value={fmtUSD(rehab)} />
            <KV label="Total cash in" value={fmtUSD(totalCashIn)} highlight />
          </div>

          {/* Monthly breakdown */}
          <div className="mt-3 bg-white/70 rounded-xl p-4 space-y-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Monthly breakdown</p>
            <KV label="Gross rent" value={fmtUSD(grossRent)} />
            <KV label="Vacancy loss" value={`-${fmtUSD(vacancyLoss)}`} />
            <KV label="Operating expenses" value={`-${fmtUSD(totalExpenses)}`} />
            <KV label="NOI" value={fmtUSD(noi)} />
            <KV label="Mortgage P&I" value={`-${fmtUSD(pi)}`} />
            <KV label="Net cash flow" value={`${monthlyCashFlow >= 0 ? "" : "-"}${fmtUSD(Math.abs(monthlyCashFlow))}`} highlight />
          </div>
        </div>
      )}

      {hasVisibleResults && (
        <>
          <ResultActions getSummary={() => summaryText} filenamePrefix="deal-snapshot-summary" showPrint />

          <EmailResultsForm
            calculatorName="Real Estate Deal Snapshot"
            calculatorType="real-estate"
            summaryText={summaryText}
            ctaLabel="Explore HavenMIND"
            ctaUrl="https://fosterwealthventures.com/havenmind"
            disclaimer="Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability."
          />
        </>
      )}

      {/* CTA to HavenMIND */}
      {price > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 rounded-lg p-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">The numbers are a start. HavenMIND helps you think through the full decision.</p>
              <p className="text-sm text-slate-300 mt-1">
                Market intelligence, compliance tracking, LOA financing, and a deal feed built
                for investors and homebuyers — powered by AI and rooted in faith.
              </p>
              <Link
                href="https://fosterwealthventures.com/havenmind"
                target="_blank"
                className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Explore HavenMIND AI →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
