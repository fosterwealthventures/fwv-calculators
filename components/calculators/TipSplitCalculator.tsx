"use client";

import { Receipt, RotateCcw, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import EmailResultsForm from "./EmailResultsForm";
import ResultActions from "./ResultActions";

type TipOn = "afterDiscount" | "beforeDiscount";
type DiscountMode = "percent" | "amount";

const DEFAULTS = {
  bill: "120.00",
  people: "3",
  discountMode: "percent" as DiscountMode,
  discountValue: "0",
  taxPct: "8.5",
  tipPct: "18",
  tipOn: "afterDiscount" as TipOn,
};

function toNum(value: string | number) {
  return Number(String(value ?? "").replace(/[^0-9.+-eE]/g, "")) || 0;
}

function fmtUSD(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = "0",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`block w-full rounded-xl border border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-8" : "pr-3"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Toggle({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 text-xs font-semibold transition-colors ${
            value === option.value
              ? "bg-emerald-600 text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-slate-200 pt-3" : ""}`}>
      <span className="text-slate-600">{label}</span>
      <span className={`text-right ${strong ? "text-lg font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

export default function TipSplitCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);

  const result = useMemo(() => {
    const bill = Math.max(toNum(inputs.bill), 0);
    const people = Math.max(Math.floor(toNum(inputs.people)), 1);
    const discountRaw = Math.max(toNum(inputs.discountValue), 0);
    const taxRate = Math.max(toNum(inputs.taxPct), 0) / 100;
    const tipRate = Math.max(toNum(inputs.tipPct), 0) / 100;

    const discount =
      inputs.discountMode === "percent"
        ? Math.min(bill * (discountRaw / 100), bill)
        : Math.min(discountRaw, bill);

    const subtotalAfterDiscount = Math.max(bill - discount, 0);
    const tax = subtotalAfterDiscount * taxRate;
    const tipBase = inputs.tipOn === "beforeDiscount" ? bill : subtotalAfterDiscount;
    const tip = tipBase * tipRate;
    const total = subtotalAfterDiscount + tax + tip;
    const perPerson = total / people;

    return { bill, people, discount, subtotalAfterDiscount, tax, tip, total, perPerson };
  }, [inputs]);

  function update<K extends keyof typeof DEFAULTS>(key: K, value: (typeof DEFAULTS)[K]) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setInputs(DEFAULTS);
  }

  const summaryText = useMemo(() => {
    const generatedAt = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return [
      "Calculator name: Tip & Tab Split Calculator",
      `Date generated: ${generatedAt}`,
      `Bill amount: ${fmtUSD(result.bill)}`,
      `Discount amount: -${fmtUSD(result.discount)}`,
      `Subtotal after discount: ${fmtUSD(result.subtotalAfterDiscount)}`,
      `Tax percentage: ${inputs.taxPct}% (${fmtUSD(result.tax)})`,
      `Tip percentage: ${inputs.tipPct}% (${fmtUSD(result.tip)})`,
      `Tip calculated on: ${inputs.tipOn === "beforeDiscount" ? "Before discount" : "After discount"}`,
      `Total with tax and tip: ${fmtUSD(result.total)}`,
      `Number of people: ${result.people}`,
      `Per-person amount: ${fmtUSD(result.perPerson)}`,
      "Disclaimer: Educational estimate only. Check your receipt for actual tax, service fees, automatic gratuity, and restaurant-specific charges.",
    ].join("\n");
  }, [inputs.taxPct, inputs.tipPct, inputs.tipOn, result]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-emerald-50 p-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Bill details</h3>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <Field label="Bill amount" prefix="$" value={inputs.bill} onChange={(value) => update("bill", value)} />
          <Field label="Number of people" value={inputs.people} onChange={(value) => update("people", value)} min="1" />

          <div className="space-y-2">
            <span className="block text-xs font-medium text-slate-500">Discount</span>
            <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <Toggle
                value={inputs.discountMode}
                onChange={(value) => update("discountMode", value as DiscountMode)}
                options={[
                  { value: "percent", label: "% Off" },
                  { value: "amount", label: "$ Off" },
                ]}
              />
              <Field
                label=""
                value={inputs.discountValue}
                onChange={(value) => update("discountValue", value)}
                prefix={inputs.discountMode === "amount" ? "$" : undefined}
                suffix={inputs.discountMode === "percent" ? "%" : undefined}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tax" suffix="%" value={inputs.taxPct} onChange={(value) => update("taxPct", value)} />
            <Field label="Tip" suffix="%" value={inputs.tipPct} onChange={(value) => update("tipPct", value)} />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-slate-500">Calculate tip on</span>
            <Toggle
              value={inputs.tipOn}
              onChange={(value) => update("tipOn", value as TipOn)}
              options={[
                { value: "afterDiscount", label: "After discount" },
                { value: "beforeDiscount", label: "Before discount" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-100 p-2">
              <Users className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-slate-900">Split results</h3>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Each person pays</p>
            <p className="mt-1 text-4xl font-bold text-emerald-700">{fmtUSD(result.perPerson)}</p>
            <p className="mt-1 text-sm text-slate-500">Split evenly across {result.people} people</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <Row label="Original bill" value={fmtUSD(result.bill)} />
            <Row label="Discount" value={`-${fmtUSD(result.discount)}`} />
            <Row label="Subtotal after discount" value={fmtUSD(result.subtotalAfterDiscount)} />
            <Row label="Tax" value={fmtUSD(result.tax)} />
            <Row label="Tip" value={fmtUSD(result.tip)} />
            <Row label="Total with tax & tip" value={fmtUSD(result.total)} strong />
          </div>

          <ResultActions getSummary={() => summaryText} filenamePrefix="tip-tab-split-summary" showPrint />

          <EmailResultsForm
            calculatorName="Tip & Tab Split Calculator"
            calculatorType="utility"
            summaryText={summaryText}
            ctaLabel="Explore More Free Calculators"
            ctaUrl="/calculators"
            disclaimer="Educational estimate only. Check your receipt for actual tax, service fees, automatic gratuity, and restaurant-specific charges."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h3 className="font-semibold text-slate-900 mb-2">How this works</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Discounts are capped at the bill amount so the subtotal never goes below zero.</li>
          <li>Tax is calculated after the discount.</li>
          <li>You can choose whether the tip is based on the pre-discount or post-discount amount.</li>
          <li>The final total is split evenly across the number of people entered.</li>
        </ul>
        <p className="mt-3">
          Looking for more tools?{" "}
          <Link href="/calculators" className="font-medium text-emerald-600 underline">
            Browse all Foster Wealth calculators.
          </Link>
        </p>
      </div>
    </div>
  );
}
