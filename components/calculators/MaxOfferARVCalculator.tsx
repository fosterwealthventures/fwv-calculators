"use client";

import { Building2, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmailResultsForm from "./EmailResultsForm";
import ResultActions from "./ResultActions";

function num(v: string) { return parseFloat(v) || 0; }
function fmt(n: number, d = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtUSD(n: number) { return "$" + fmt(n); }

interface Inputs {
  arv: string;
  rehabCost: string;
  closingBuy: string;
  closingSell: string;
  holdingMonths: string;
  holdingCostMonthly: string;
  desiredProfit: string;
  customMaoRulePct: string;
  ruleset: "70" | "custom";
  dealNotes: string;
}

const DEFAULTS: Inputs = {
  arv: "300000",
  rehabCost: "35000",
  closingBuy: "3000",
  closingSell: "18000",
  holdingMonths: "4",
  holdingCostMonthly: "1200",
  desiredProfit: "30000",
  customMaoRulePct: "65",
  ruleset: "70",
  dealNotes: "",
};

function InputField({ label, value, onChange, prefix, suffix, placeholder, helper, tooltip }: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string; helper?: string; tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="block text-xs font-medium text-slate-600">{label}</label>
        {tooltip && (
          <span className="group relative cursor-help">
            <Info className="w-3 h-3 text-slate-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 text-xs bg-slate-800 text-white rounded-lg p-2 z-10 shadow-lg">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>}
        <input
          type="number"
          min="0"
          className={`block w-full rounded-xl border border-slate-200 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-10" : "pr-3"}`}
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

function ResultRow({ label, value, sub, highlight, negative }: {
  label: string; value: string; sub?: string; highlight?: boolean; negative?: boolean;
}) {
  return (
    <div className={`flex justify-between items-start py-2.5 border-b border-slate-100 last:border-0`}>
      <div>
        <span className={`text-sm ${highlight ? "font-semibold text-slate-800" : "text-slate-600"}`}>{label}</span>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <span className={`text-sm font-semibold ml-4 ${
        highlight ? "text-emerald-700 text-base" : negative ? "text-red-600" : "text-slate-800"
      }`}>{value}</span>
    </div>
  );
}

export default function MaxOfferARVCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);

  function set(field: keyof Inputs) {
    return (v: string) => setInputs((s) => ({ ...s, [field]: v }));
  }
  function reset() { setInputs(DEFAULTS); }

  const arv = num(inputs.arv);
  const rehab = num(inputs.rehabCost);
  const closingBuy = num(inputs.closingBuy);
  const closingSell = num(inputs.closingSell);
  const holdingTotal = num(inputs.holdingMonths) * num(inputs.holdingCostMonthly);
  const profit = num(inputs.desiredProfit);
  const totalCosts = rehab + closingBuy + closingSell + holdingTotal;

  // 70% Rule MAO
  const mao70 = arv * 0.70 - rehab;

  // Custom rule MAO
  const customPct = num(inputs.customMaoRulePct) / 100;
  const maoCustom = arv * customPct - rehab;

  // Full cost-based MAO
  const maoCostBased = arv - totalCosts - profit;

  const activeMao = inputs.ruleset === "70" ? mao70 : maoCustom;

  // At active MAO, what's the actual profit?
  const profitAtMAO = arv - rehab - closingBuy - closingSell - holdingTotal - activeMao;

  const offerStatus = (mao: number) => {
    if (mao <= 0) return { label: "Deal not viable", color: "text-red-700", bg: "bg-red-50 border-red-200" };
    if (mao >= arv * 0.8) return { label: "Verify your numbers", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    return { label: "Viable offer ceiling", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
  };

  const status = offerStatus(activeMao);

  const summaryText = [
    "Calculator name: Max Offer & ARV Calculator",
    `Date generated: ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}`,
    `ARV: ${fmtUSD(arv)}`,
    `Repair/rehab estimate: ${fmtUSD(rehab)}`,
    `Desired profit or margin: ${fmtUSD(profit)}`,
    `Estimated selling/closing costs: ${fmtUSD(closingSell)}`,
    `Estimated buying/closing costs: ${fmtUSD(closingBuy)}`,
    `Holding costs: ${fmtUSD(holdingTotal)}`,
    `Max allowable offer: ${activeMao > 0 ? fmtUSD(activeMao) : "Not viable"}`,
    inputs.dealNotes.trim() ? `Deal notes: ${inputs.dealNotes.trim()}` : null,
    "CTA note: HavenMIND helps you think through the decision.",
    "Disclaimer: Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability.",
  ].filter(Boolean).join("\n");

  return (
    <div className="space-y-6">
      {/* ARV & Rehab */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Property values</h3>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="After Repair Value (ARV)"
            value={inputs.arv}
            onChange={set("arv")}
            prefix="$"
            placeholder="300000"
            tooltip="The estimated market value of the property after all repairs are complete."
          />
          <InputField
            label="Rehab / repair cost"
            value={inputs.rehabCost}
            onChange={set("rehabCost")}
            prefix="$"
            placeholder="35000"
            tooltip="Your total estimated cost to repair and renovate the property."
          />
        </div>

        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide pt-2">Costs & profit target</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InputField label="Closing costs (buy)" value={inputs.closingBuy} onChange={set("closingBuy")} prefix="$" placeholder="3000" />
          <InputField label="Closing costs (sell)" value={inputs.closingSell} onChange={set("closingSell")} prefix="$" placeholder="18000" helper="~6% of ARV typical" />
          <InputField label="Holding period" value={inputs.holdingMonths} onChange={set("holdingMonths")} suffix="mo" placeholder="4" />
          <InputField label="Monthly holding cost" value={inputs.holdingCostMonthly} onChange={set("holdingCostMonthly")} prefix="$" placeholder="1200" helper={holdingTotal > 0 ? `Total: $${fmt(holdingTotal)}` : ""} />
          <InputField label="Desired profit" value={inputs.desiredProfit} onChange={set("desiredProfit")} prefix="$" placeholder="30000" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Deal notes</label>
          <textarea
            className="block w-full min-h-24 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
            value={inputs.dealNotes}
            onChange={(e) => setInputs((s) => ({ ...s, dealNotes: e.target.value }))}
            placeholder="Optional notes about the property, comps, financing, or assumptions"
          />
        </div>

        {/* Rule selector */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide pt-2 mb-3">MAO rule</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setInputs((s) => ({ ...s, ruleset: "70" }))}
              className={`rounded-2xl border p-3 text-left transition-all ${
                inputs.ruleset === "70"
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className={`text-sm font-semibold ${inputs.ruleset === "70" ? "text-emerald-700" : "text-slate-700"}`}>70% Rule</p>
              <p className="text-xs text-slate-500 mt-0.5">ARV × 70% − Rehab</p>
            </button>
            <button
              onClick={() => setInputs((s) => ({ ...s, ruleset: "custom" }))}
              className={`rounded-2xl border p-3 text-left transition-all ${
                inputs.ruleset === "custom"
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className={`text-sm font-semibold ${inputs.ruleset === "custom" ? "text-emerald-700" : "text-slate-700"}`}>Custom %</p>
              <p className="text-xs text-slate-500 mt-0.5">Set your own rule</p>
            </button>
          </div>

          {inputs.ruleset === "custom" && (
            <div className="mt-3 max-w-xs">
              <InputField
                label="Custom rule percentage"
                value={inputs.customMaoRulePct}
                onChange={set("customMaoRulePct")}
                suffix="%"
                placeholder="65"
                helper="e.g. 65 means ARV × 65% − Rehab"
              />
            </div>
          )}
        </div>
      </div>

      <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors">
        Reset to defaults
      </button>

      {/* Results */}
      {arv > 0 && (
        <div className="space-y-4">
          {/* MAO highlight */}
          <div className={`rounded-2xl border-2 p-5 ${status.bg}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Maximum Allowable Offer</p>
            <p className={`text-4xl font-bold tracking-tight ${status.color}`}>
              {activeMao > 0 ? fmtUSD(activeMao) : "—"}
            </p>
            <p className={`text-sm font-semibold mt-1 ${status.color}`}>{status.label}</p>
            {activeMao > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {inputs.ruleset === "70"
                  ? `Using 70% rule: $${fmt(arv)} × 70% − $${fmt(rehab)} rehab`
                  : `Using ${inputs.customMaoRulePct}% rule: $${fmt(arv)} × ${inputs.customMaoRulePct}% − $${fmt(rehab)} rehab`}
              </p>
            )}
          </div>

          {/* Full breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Full cost-based breakdown</p>
            <ResultRow label="ARV (after repair value)" value={fmtUSD(arv)} />
            <ResultRow label="Rehab cost" value={`−${fmtUSD(rehab)}`} negative />
            <ResultRow label="Buying closing costs" value={`−${fmtUSD(closingBuy)}`} negative />
            <ResultRow label="Selling closing costs" value={`−${fmtUSD(closingSell)}`} negative />
            <ResultRow label="Holding costs" value={`−${fmtUSD(holdingTotal)}`} negative sub={`${inputs.holdingMonths} mo × $${fmt(num(inputs.holdingCostMonthly))}/mo`} />
            <ResultRow label="Desired profit" value={`−${fmtUSD(profit)}`} negative />
            <ResultRow label="Cost-based MAO" value={maoCostBased > 0 ? fmtUSD(maoCostBased) : "Not viable"} highlight />
          </div>

          {/* Profit at rule-based MAO */}
          {activeMao > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                If you pay exactly {inputs.ruleset === "70" ? "70% Rule" : `${inputs.customMaoRulePct}%`} MAO
              </p>
              <ResultRow label="Purchase price (MAO)" value={fmtUSD(activeMao)} />
              <ResultRow label="Total all-in costs" value={fmtUSD(totalCosts)} />
              <ResultRow label="Estimated profit" value={profitAtMAO > 0 ? fmtUSD(profitAtMAO) : `−${fmtUSD(Math.abs(profitAtMAO))}`} highlight />
            </div>
          )}

          <ResultActions getSummary={() => summaryText} filenamePrefix="max-offer-arv-summary" showPrint />

          <EmailResultsForm
            calculatorName="Max Offer & ARV Calculator"
            calculatorType="real-estate"
            summaryText={summaryText}
            ctaLabel="Explore HavenMIND"
            ctaUrl="https://fosterwealthventures.com/havenmind"
            disclaimer="Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability."
          />

          {/* CTA to HavenMIND */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 rounded-lg p-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Know your max offer. Now make the right decision.</p>
                <p className="text-sm text-slate-300 mt-1">
                  HavenMIND AI adds market intelligence, neighborhood trends, compliance checks,
                  and financing guidance to help you move with confidence.
                </p>
                <Link
                  href="https://fosterwealthventures.com/havenmind"
                  target="_blank"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Explore HavenMIND AI →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
