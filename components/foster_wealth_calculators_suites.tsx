"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  Users,
  PiggyBank,
  Home,
  BarChart3,
} from "lucide-react";
import dynamic from "next/dynamic";

import { AdBannerTop } from "@/components/ads";
import { Gate, useEntitlements } from "@/lib/entitlements-client";

/** ----------------------------------------------------------------------------------------------
 *  Lazy-loaded paid calculators
 * ---------------------------------------------------------------------------------------------- */
const EmployeeCostPro = dynamic(() => import("./EmployeeCostPro"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-sm opacity-70">Loading Employee Cost…</div>
  ),
});

const ExpenseSplitDeluxe = dynamic(() => import("./ExpenseSplitDeluxe"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-sm opacity-70">Loading Expense Split Deluxe…</div>
  ),
});

/** ----------------------------------------------------------------------------------------------
 *  Types & Registry
 * ---------------------------------------------------------------------------------------------- */
type CalcKey =
  | "roi"
  | "break-even"
  | "mortgage"
  | "interest"
  | "freelancer-rate"
  | "tip-split"
  | "savings"
  | "debt-payoff"
  | "employee-cost"
  | "expense-split-deluxe";

const calcMeta = {
  calculators: {
    // Free
    roi: { name: "ROI Calculator", icon: TrendingUp, tier: "free" as const },
    "break-even": {
      name: "Break-Even",
      icon: BarChart3,
      tier: "free" as const,
    },
    mortgage: { name: "Mortgage", icon: Home, tier: "free" as const },
    interest: {
      name: "Interest (Simple/Compound)",
      icon: PiggyBank,
      tier: "free" as const,
    },
    "freelancer-rate": {
      name: "Freelancer Rate",
      icon: DollarSign,
      tier: "free" as const,
    },
    "tip-split": {
      name: "Tip & Tab Split",
      icon: DollarSign,
      tier: "free" as const,
    },

    // PLUS
    savings: { name: "Savings Growth", icon: PiggyBank, tier: "plus" as const },
    "debt-payoff": {
      name: "Debt Payoff",
      icon: DollarSign,
      tier: "plus" as const,
    },

    // PRO (Pro choice handled by <Gate/>; Premium always allowed)
    "employee-cost": {
      name: "Employee Cost",
      icon: Users,
      tier: "pro" as const,
    },
    "expense-split-deluxe": {
      name: "Expense Split Deluxe",
      icon: PiggyBank,
      tier: "pro" as const,
    },
  },
} as const;

/** ----------------------------------------------------------------------------------------------
 *  Small UI helpers
 * ---------------------------------------------------------------------------------------------- */
const fmtUSD = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const fmtPct = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: 2,
  });

const ChipButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm shadow-sm",
      active
        ? "border-brand-green ring-2 ring-brand-green/30"
        : "border-neutral-300 hover:border-brand-green",
    ].join(" ")}
  >
    {children}
  </button>
);

const Input: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ id, label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type === "number" ? "number" : "text"}
      inputMode={type === "number" ? "decimal" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 shadow-sm
                 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
    />
  </div>
);

const ToggleGroup: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="inline-flex overflow-hidden rounded-lg border border-neutral-300">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={[
          "px-3 py-2 text-sm",
          value === o.value
            ? "bg-brand-green text-white"
            : "bg-white hover:bg-neutral-50",
        ].join(" ")}
      >
        {o.label}
      </button>
    ))}
  </div>
);


/** ---------- Small UI: ModeSwitch (slide toggle) ---------- */
const ModeSwitch: React.FC<{
  value: "simple" | "compound";
  onChange: (v: "simple" | "compound") => void;
}> = ({ value, onChange }) => {
  const isCompound = value === "compound";
  return (
    <div className="inline-block">
      <div
        className="relative w-[300px] select-none rounded-full border border-neutral-300 bg-white p-1"
        role="group"
        aria-label="Interest mode"
      >
        {/* Sliding knob */}
        <div
          className={`absolute top-1 h-8 rounded-full bg-brand-green transition-all duration-200 ease-out
                      ${isCompound ? "left-1 w-[calc(50%-0.25rem)]" : "left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]"}`}
          aria-hidden
        />
        {/* Buttons */}
        <button
          type="button"
          className={`relative z-10 w-1/2 py-2 text-sm font-medium ${isCompound ? "text-white" : "text-gray-700"}`}
          onClick={() => onChange("compound")}
          aria-pressed={isCompound}
        >
          Compound
        </button>
        <button
          type="button"
          className={`relative z-10 w-1/2 py-2 text-sm font-medium ${!isCompound ? "text-white" : "text-gray-700"}`}
          onClick={() => onChange("simple")}
          aria-pressed={!isCompound}
        >
          Simple
        </button>
      </div>
    </div>
  );
};

const ExplanationPanel: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
    <h3 className="mb-2 text-sm font-semibold text-brand-green">{title}</h3>
    <div className="prose prose-sm max-w-none text-gray-700">{children}</div>
  </div>
);

const InputsPanel: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
    <h3 className="mb-4 text-sm font-semibold text-brand-green">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const ResultsPanel: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
    <h3 className="mb-4 text-sm font-semibold text-brand-green">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const KV: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const Header: React.FC<{ title: string }> = ({ title }) => (
  <div className="border-b border-neutral-100 px-4 py-3">
    <h2 className="heading-section">{title}</h2>
  </div>
);

/** ----------------------------------------------------------------------------------------------
 *  Component
 * ---------------------------------------------------------------------------------------------- */
export default function FosterWealthCalculators({
  freeOnly = false,
}: {
  freeOnly?: boolean;
}) {
  const { planId } = useEntitlements(); // single source of truth for plan (Free shows ads)
  const [activeCalc, setActiveCalc] = useState<CalcKey>("roi");

  // Deep-link support (?calc=), with safety if freeOnly hides paid calcs
  const search = useSearchParams();
  useEffect(() => {
    const q = (search.get("calc") || "").toLowerCase() as CalcKey;
    if (q && q in calcMeta.calculators) {
      const tier = (calcMeta.calculators as any)[q]?.tier as
        | "free"
        | "plus"
        | "pro";
      if (freeOnly && tier !== "free") {
        setActiveCalc("roi");
      } else {
        setActiveCalc(q);
      }
    }
  }, [search, freeOnly]);

  const visibleCalcs = Object.entries(calcMeta.calculators).filter(
    ([, meta]) => !(freeOnly && meta.tier !== "free"),
  );

  // Upgrade handler for paid calculators
  const handleUpgrade = () => {
    // This will trigger the upgrade flow in your app
    // You can integrate with your existing upgrade modal or navigation
    console.log("Upgrade triggered for calculator:", activeCalc);
    // Example: window.location.href = "/upgrade";
    // Or: openUpgradeModal();
  };

  /* ---------------- ROI ---------------- */
  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: "10000",
    finalValue: "15000",
    timeHorizon: "2",
  });
  const roi = useMemo(() => {
    const P = parseFloat(roiInputs.initialInvestment) || 0;
    const F = parseFloat(roiInputs.finalValue) || 0;
    const Y = parseFloat(roiInputs.timeHorizon) || 1;
    const total = P === 0 ? 0 : (F - P) / P;
    const annual = P === 0 || Y <= 0 ? 0 : Math.pow(F / P, 1 / Y) - 1;
    return { total, annual };
  }, [roiInputs]);

  /* ------------- Break-Even ------------- */
  const [beInputs, setBeInputs] = useState({
    fixedCosts: "5000",
    variableCostPerUnit: "15",
    pricePerUnit: "25",
  });
  const breakEvenUnits = useMemo(() => {
    const FC = parseFloat(beInputs.fixedCosts) || 0;
    const VC = parseFloat(beInputs.variableCostPerUnit) || 0;
    const P = parseFloat(beInputs.pricePerUnit) || 0;
    const cm = P - VC;
    return cm <= 0 ? Infinity : Math.ceil(FC / cm);
  }, [beInputs]);

  /* --------------- Mortgage -------------- */
  const [mtgInputs, setMtgInputs] = useState({
    loanAmount: "400000",
    interestRate: "6.5",
    loanTerm: "30",
    downPayment: "80000",
  });
  const mtg = useMemo(() => {
    const loan = Math.max(
      (parseFloat(mtgInputs.loanAmount) || 0) -
        (parseFloat(mtgInputs.downPayment) || 0),
      0,
    );
    const annualRate = (parseFloat(mtgInputs.interestRate) || 0) / 100;
    const nYears = parseFloat(mtgInputs.loanTerm) || 30;
    const r = annualRate / 12;
    const n = nYears * 12;
    if (r <= 0) return { monthly: loan / Math.max(n, 1), total: loan };
    const monthly = (loan * r) / (1 - Math.pow(1 + r, -n));
    return { monthly, total: monthly * n };
  }, [mtgInputs]);

  /* ---------- Simple vs Compound Interest ---------- */
  const [interestMode, setInterestMode] = useState<"simple" | "compound">(
    "compound",
  );
  const [intInputs, setIntInputs] = useState({
    principal: "10000",
    annualRatePct: "5",
    years: "5",
    compoundsPerYear: "12",
  });
  const interest = useMemo(() => {
    const P = parseFloat(intInputs.principal) || 0;
    const r = (parseFloat(intInputs.annualRatePct) || 0) / 100;
    const t = parseFloat(intInputs.years) || 0;
    if (interestMode === "simple") {
      const A = P * (1 + r * t);
      return { amount: A, interest: A - P };
    } else {
      const n = Math.max(parseFloat(intInputs.compoundsPerYear) || 1, 1);
      const A = P * Math.pow(1 + r / n, n * t);
      return { amount: A, interest: A - P };
    }
  }, [intInputs, interestMode]);

  /* --------------- Freelancer Rate --------------- */
  const [frInputs, setFrInputs] = useState({
    annualIncome: "120000",
    weeksOff: "4",
    hoursPerWeek: "30",
    overheadPct: "10",
  });
  const freelancer = useMemo(() => {
    const income = parseFloat(frInputs.annualIncome) || 0;
    const weeksOff = parseFloat(frInputs.weeksOff) || 0;
    const hoursPerWeek = parseFloat(frInputs.hoursPerWeek) || 0;
    const overhead = (parseFloat(frInputs.overheadPct) || 0) / 100;
    const weeksWorked = Math.max(52 - weeksOff, 1);
    const billableHours = Math.max(weeksWorked * hoursPerWeek, 1);
    const target = income * (1 + overhead);
    return {
      hourly: target / billableHours,
      weeksWorked,
      billableHours,
      target,
    };
  }, [frInputs]);

  /* ---------------- Tip & Tab Split ---------------- */
  const [tipInputs, setTipInputs] = useState({
    bill: "120.00",
    people: "3",
    discountMode: "percent" as "percent" | "amount",
    discountValue: "0",
    taxPct: "8.5",
    tipPct: "18",
    tipOn: "afterDiscount" as "afterDiscount" | "beforeDiscount",
  });
  const tipSplit = useMemo(() => {
    const bill = parseFloat(tipInputs.bill) || 0;
    const people = Math.max(parseInt(tipInputs.people || "1", 10) || 1, 1);
    const discountValue = parseFloat(tipInputs.discountValue) || 0;
    const taxPct = (parseFloat(tipInputs.taxPct) || 0) / 100;
    const tipPct = (parseFloat(tipInputs.tipPct) || 0) / 100;

    const discount =
      tipInputs.discountMode === "percent"
        ? bill * (discountValue / 100)
        : Math.min(discountValue, bill);

    const subtotalAfterDiscount = Math.max(bill - discount, 0);
    const taxBase = subtotalAfterDiscount;
    const taxAmt = taxBase * taxPct;

    const tipBase =
      tipInputs.tipOn === "beforeDiscount" ? bill : subtotalAfterDiscount;
    const tipAmt = tipBase * tipPct;

    const total = subtotalAfterDiscount + taxAmt + tipAmt;
    const perPerson = total / people;

    return {
      discountValue: discount,
      subtotalAfterDiscount,
      taxAmt,
      tipAmt,
      total,
      perPerson,
    };
  }, [tipInputs]);

  /* ---------------- Savings Growth ---------------- */
  const [sav, setSav] = useState({
    start: "10000",
    monthly: "250",
    ratePct: "6",
    years: "10",
  });
  const savings = useMemo(() => {
    const P = parseFloat(sav.start) || 0;
    const PMT = parseFloat(sav.monthly) || 0;
    const r = (parseFloat(sav.ratePct) || 0) / 100 / 12;
    const n = (parseFloat(sav.years) || 0) * 12;
    const growth = r > 0 ? PMT * ((Math.pow(1 + r, n) - 1) / r) : PMT * n;
    const total = P * Math.pow(1 + r, n) + growth;
    const contributed = P + PMT * n;
    return { total, contributed, growth: total - contributed };
  }, [sav]);

  /* ---------------- Debt Payoff ---------------- */
  const [debt, setDebt] = useState({
    balance: "12000",
    aprPct: "19.99",
    monthlyPay: "350",
  });
  const payoff = useMemo(() => {
    const B = parseFloat(debt.balance) || 0;
    const i = (parseFloat(debt.aprPct) || 0) / 100 / 12;
    const P = parseFloat(debt.monthlyPay) || 0;
    if (i <= 0) {
      const months = Math.ceil(B / Math.max(P, 1));
      return {
        months,
        totalPaid: Math.max(P, 1) * months,
        interest: Math.max(P, 1) * months - B,
      };
    }
    if (P <= B * i)
      return { months: Infinity, totalPaid: Infinity, interest: Infinity };
    const months = Math.ceil(-Math.log(1 - (i * B) / P) / Math.log(1 + i));
    const totalPaid = P * months;
    const interest = totalPaid - B;
    return { months, totalPaid, interest };
  }, [debt]);

  /** --------------------------------------------------------------------------------------------
   *  Render
   * -------------------------------------------------------------------------------------------- */
  return (
    <div className="flex min-h-screen flex-col">
      {/* Calculator selector */}
      <div className="fwv-container pt-2">
        <div className="flex flex-wrap gap-2">
          {visibleCalcs.map(([key, meta]) => {
            const Icon = (meta.icon as any) || BarChart3;
            const active = key === activeCalc;
            return (
              <ChipButton
                key={key}
                active={active}
                onClick={() => setActiveCalc(key as CalcKey)}
              >
                <Icon size={16} />
                {meta.name}
                {meta.tier !== "free" && (
                  <span className="ml-1 rounded-md border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-[11px]">
                    {meta.tier === "plus" ? "Plus" : "Pro"}
                  </span>
                )}
              </ChipButton>
            );
          })}
        </div>

        {/* Top in-suite ad — show only for Free plan */}
        <div className="mt-3">{planId === "free" ? <AdBannerTop /> : null}</div>
      </div>

      {/* Main calculator body */}
      <main className="fwv-container mt-6 flex-grow space-y-10 pb-12">
        {/* ROI */}
        {activeCalc === "roi" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="ROI Calculator" />
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <InputsPanel title="Inputs">
                <Input
                  id="roi_initial"
                  label="Initial Investment"
                  value={roiInputs.initialInvestment}
                  onChange={(v) =>
                    setRoiInputs((s) => ({ ...s, initialInvestment: v }))
                  }
                />
                <Input
                  id="roi_final"
                  label="Final Value"
                  value={roiInputs.finalValue}
                  onChange={(v) =>
                    setRoiInputs((s) => ({ ...s, finalValue: v }))
                  }
                />
                <Input
                  id="roi_time"
                  label="Time Horizon (years)"
                  value={roiInputs.timeHorizon}
                  onChange={(v) =>
                    setRoiInputs((s) => ({ ...s, timeHorizon: v }))
                  }
                />
              </InputsPanel>
              <ResultsPanel title="Results">
                <KV label="Total ROI" value={fmtPct(roi.total)} />
                <KV label="Annualized ROI" value={fmtPct(roi.annual)} />
              </ResultsPanel>
            </div>
            <div className="px-6 pb-5">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>
                    <b>ROI:</b> (Final − Initial) ÷ Initial
                  </li>
                  <li>
                    <b>Annualized:</b> (Final ÷ Initial)<sup>1/years</sup> − 1
                  </li>
                  <li>
                    Annualizing lets you compare across different time horizons
                    fairly.
                  </li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/roi-vs-annualized-roi"
                  >
                    ROI vs Annualized ROI—How to Read Them & Boost Your
                    Investment Strategy
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* Break-Even */}
        {activeCalc === "break-even" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="Break-Even Calculator" />
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <InputsPanel title="Inputs">
                <Input
                  id="be_fixed"
                  label="Fixed Costs"
                  value={beInputs.fixedCosts}
                  onChange={(v) =>
                    setBeInputs((s) => ({ ...s, fixedCosts: v }))
                  }
                />
                <Input
                  id="be_var"
                  label="Variable Cost per Unit"
                  value={beInputs.variableCostPerUnit}
                  onChange={(v) =>
                    setBeInputs((s) => ({ ...s, variableCostPerUnit: v }))
                  }
                />
                <Input
                  id="be_price"
                  label="Price per Unit"
                  value={beInputs.pricePerUnit}
                  onChange={(v) =>
                    setBeInputs((s) => ({ ...s, pricePerUnit: v }))
                  }
                />
              </InputsPanel>
              <ResultsPanel title="Results">
                <KV
                  label="Break-Even (units)"
                  value={isFinite(breakEvenUnits) ? breakEvenUnits : "N/A"}
                />
              </ResultsPanel>
            </div>
            <div className="px-6 pb-6">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>Units = Fixed Costs ÷ (Price − Variable Cost).</li>
                  <li>
                    If price ≤ variable cost, break-even isn't achievable.
                  </li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/break-even-made-simple"
                  >
                    Break-Even Made Simple—Use Our Calculator to Master Costs &
                    Profit Margins
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* Mortgage */}
        {activeCalc === "mortgage" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="Mortgage Calculator" />
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <InputsPanel title="Inputs">
                <Input
                  id="mtg_loan"
                  label="Home Price / Loan Amount"
                  value={mtgInputs.loanAmount}
                  onChange={(v) =>
                    setMtgInputs((s) => ({ ...s, loanAmount: v }))
                  }
                />
                <Input
                  id="mtg_down"
                  label="Down Payment"
                  value={mtgInputs.downPayment}
                  onChange={(v) =>
                    setMtgInputs((s) => ({ ...s, downPayment: v }))
                  }
                />
                <Input
                  id="mtg_rate"
                  label="Interest Rate (%)"
                  value={mtgInputs.interestRate}
                  onChange={(v) =>
                    setMtgInputs((s) => ({ ...s, interestRate: v }))
                  }
                />
                <Input
                  id="mtg_term"
                  label="Loan Term (years)"
                  value={mtgInputs.loanTerm}
                  onChange={(v) => setMtgInputs((s) => ({ ...s, loanTerm: v }))}
                />
              </InputsPanel>
              <ResultsPanel title="Results">
                <KV label="Monthly Payment" value={fmtUSD(mtg.monthly)} />
                <KV label="Total Paid" value={fmtUSD(mtg.total)} />
              </ResultsPanel>
            </div>
            <div className="px-6 pb-6">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>
                    Monthly payment uses p = rL / (1 − (1+r)<sup>−n</sup>),
                    where r=rate/12, n=months.
                  </li>
                  <li>
                    Higher rates/longer terms increase total interest paid.
                  </li>
                  <li>Extra principal payments reduce total interest.</li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/mortgage-payment-breakdown"
                  >
                    Mortgage Payment Breakdown—Use Our Calculator to See What
                    Impacts Your Monthly Cost
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* Tip & Tab Split */}
        {activeCalc === "tip-split" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="Restaurant Tip & Tab Split Calculator" />
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <InputsPanel title="Inputs">
                <div className="grid gap-4">
                  <Input
                    id="tip_bill"
                    label="Bill Amount ($)"
                    value={tipInputs.bill}
                    onChange={(v) => setTipInputs((s) => ({ ...s, bill: v }))}
                  />
                  <Input
                    id="tip_people"
                    label="Number of People"
                    value={tipInputs.people}
                    onChange={(v) => setTipInputs((s) => ({ ...s, people: v }))}
                  />

                  <div className="flex items-center gap-3">
                    <ToggleGroup
                      value={tipInputs.discountMode}
                      onChange={(v) =>
                        setTipInputs((s) => ({
                          ...s,
                          discountMode: v as "percent" | "amount",
                        }))
                      }
                      options={[
                        { value: "percent", label: "% Off" },
                        { value: "amount", label: "$ Off" },
                      ]}
                    />
                    <Input
                      id="tip_disc"
                      label="Discount"
                      value={tipInputs.discountValue}
                      onChange={(v) =>
                        setTipInputs((s) => ({ ...s, discountValue: v }))
                      }
                      type="number"
                      placeholder={
                        tipInputs.discountMode === "percent"
                          ? "10 = 10%"
                          : "10 = $10"
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="tip_tax"
                      label="Tax (%)"
                      value={tipInputs.taxPct}
                      onChange={(v) =>
                        setTipInputs((s) => ({ ...s, taxPct: v }))
                      }
                    />
                    <Input
                      id="tip_tip"
                      label="Tip (%)"
                      value={tipInputs.tipPct}
                      onChange={(v) =>
                        setTipInputs((s) => ({ ...s, tipPct: v }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      Tip On
                    </span>
                    <ToggleGroup
                      value={tipInputs.tipOn}
                      onChange={(v) =>
                        setTipInputs((s) => ({
                          ...s,
                          tipOn: v as "afterDiscount" | "beforeDiscount",
                        }))
                      }
                      options={[
                        { value: "afterDiscount", label: "After Discount" },
                        { value: "beforeDiscount", label: "Before Discount" },
                      ]}
                    />
                  </div>
                </div>
              </InputsPanel>

              <ResultsPanel title="Results">
                <div className="space-y-3">
                  <KV label="Discount" value={fmtUSD(tipSplit.discountValue)} />
                  <KV
                    label="Subtotal (after discount)"
                    value={fmtUSD(tipSplit.subtotalAfterDiscount)}
                  />
                  <KV label="Tax" value={fmtUSD(tipSplit.taxAmt)} />
                  <KV label="Tip" value={fmtUSD(tipSplit.tipAmt)} />
                  <KV
                    label="Total (with tax & tip)"
                    value={fmtUSD(tipSplit.total)}
                  />
                  <KV label="Per Person" value={fmtUSD(tipSplit.perPerson)} />
                </div>
              </ResultsPanel>
            </div>

            <div className="px-6 pb-6">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>
                    <b>Discount:</b> Choose % or $ off the bill. We cap the
                    discount at the bill amount.
                  </li>
                  <li>
                    <b>Tax:</b> Typically applied after the discount; toggle if
                    your locale differs.
                  </li>
                  <li>
                    <b>Tip:</b> Common practice is to tip on the discounted,
                    pre-tax subtotal; toggle if needed.
                  </li>
                  <li>Set people to split the final total fairly.</li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/restaurant-tip-tab-split"
                  >
                    Guide: Tip &amp; Tab Split (with Discounts &amp; Tax)
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* Interest (Simple/Compound) */}
        {activeCalc === "interest" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="Interest Calculator (Simple / Compound)" />
            <div className="p-6">
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setInterestMode("compound")}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    interestMode === "compound"
                      ? "bg-brand-green text-white"
                      : "border border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  Compound
                </button>
                <button
                  type="button"
                  onClick={() => setInterestMode("simple")}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    interestMode === "simple"
                      ? "bg-brand-green text-white"
                      : "border border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  Simple
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <InputsPanel title="Inputs">
                  <Input
                    id="int_principal"
                    label="Principal ($)"
                    value={intInputs.principal}
                    onChange={(v) =>
                      setIntInputs((s) => ({ ...s, principal: v }))
                    }
                  />
                  <Input
                    id="int_rate"
                    label="Annual Rate (%)"
                    value={intInputs.annualRatePct}
                    onChange={(v) =>
                      setIntInputs((s) => ({ ...s, annualRatePct: v }))
                    }
                  />
                  <Input
                    id="int_years"
                    label="Years"
                    value={intInputs.years}
                    onChange={(v) => setIntInputs((s) => ({ ...s, years: v }))}
                  />
                  {interestMode === "compound" && (
                    <Input
                      id="int_n"
                      label="Compounds / Year"
                      value={intInputs.compoundsPerYear}
                      onChange={(v) =>
                        setIntInputs((s) => ({ ...s, compoundsPerYear: v }))
                      }
                    />
                  )}
                </InputsPanel>
                <ResultsPanel title="Results">
                  <KV label="Final Amount" value={fmtUSD(interest.amount)} />
                  <KV
                    label="Total Interest"
                    value={fmtUSD(interest.interest)}
                  />
                </ResultsPanel>
              </div>
            </div>
            <div className="px-6 pb-6">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>
                    <b>Simple:</b> A = P(1 + rt)
                  </li>
                  <li>
                    <b>Compound:</b> A = P(1 + r/n)<sup>nt</sup>
                  </li>
                  <li>Use compound interest when earnings are reinvested.</li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/simple-vs-compound-interest"
                  >
                    Simple vs Compound Interest—Which One Grows Your Money
                    Faster?
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* Freelancer Rate */}
        {activeCalc === "freelancer-rate" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <Header title="Freelancer Rate Calculator" />
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <InputsPanel title="Inputs">
                <Input
                  id="fr_income"
                  label="Desired Annual Income ($)"
                  value={frInputs.annualIncome}
                  onChange={(v) =>
                    setFrInputs((s) => ({ ...s, annualIncome: v }))
                  }
                />
                <Input
                  id="fr_weeks"
                  label="Weeks Off"
                  value={frInputs.weeksOff}
                  onChange={(v) => setFrInputs((s) => ({ ...s, weeksOff: v }))}
                />
                <Input
                  id="fr_hours"
                  label="Billable Hours / Week"
                  value={frInputs.hoursPerWeek}
                  onChange={(v) =>
                    setFrInputs((s) => ({ ...s, hoursPerWeek: v }))
                  }
                />
                <Input
                  id="fr_oh"
                  label="Overhead (%)"
                  value={frInputs.overheadPct}
                  onChange={(v) =>
                    setFrInputs((s) => ({ ...s, overheadPct: v }))
                  }
                />
              </InputsPanel>
              <ResultsPanel title="Results">
                <KV
                  label="Weeks Worked"
                  value={
                    frInputs.weeksOff
                      ? `${freelancer.weeksWorked}`
                      : freelancer.weeksWorked
                  }
                />
                <KV
                  label="Billable Hours"
                  value={freelancer.billableHours.toFixed(0)}
                />
                <KV label="Target Gross" value={fmtUSD(freelancer.target)} />
                <KV
                  label="Required Hourly Rate"
                  value={fmtUSD(freelancer.hourly)}
                />
              </ResultsPanel>
            </div>
            <div className="px-6 pb-6">
              <ExplanationPanel title="How this works">
                <ul className="ml-5 list-disc">
                  <li>Hourly = (Income × (1 + overhead)) ÷ billable hours.</li>
                  <li>Consider buffer for admin, marketing, revisions.</li>
                  <li>
                    Account for vacations, holidays, and non-billable time.
                  </li>
                </ul>
                <p className="mt-2">
                  Learn more:{" "}
                  <Link
                    className="text-brand-green underline"
                    href="/guide/set-your-freelancer-rate-right"
                  >
                    Set Your Freelancer Rate Right—Use Our Calculator to Avoid
                    Undervaluing Your Time
                  </Link>
                </p>
              </ExplanationPanel>
            </div>
          </section>
        )}

        {/* ===== Paid calculators (Plus & Pro/Premium) via unified <Gate /> ===== */}

        {/* Savings (Plus) */}
        {!freeOnly && activeCalc === "savings" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft relative">
            <Header title="Savings Growth Calculator" />
            {/* Gate will allow for plus/pro/premium; show upgrade card otherwise */}
            <Gate calc="savings">
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <InputsPanel title="Inputs">
                  <Input
                    id="sav_start"
                    label="Starting Balance ($)"
                    value={sav.start}
                    onChange={(v) => setSav((s) => ({ ...s, start: v }))}
                  />
                  <Input
                    id="sav_monthly"
                    label="Monthly Contribution ($)"
                    value={sav.monthly}
                    onChange={(v) => setSav((s) => ({ ...s, monthly: v }))}
                  />
                  <Input
                    id="sav_rate"
                    label="Annual Return (%)"
                    value={sav.ratePct}
                    onChange={(v) => setSav((s) => ({ ...s, ratePct: v }))}
                  />
                  <Input
                    id="sav_years"
                    label="Years"
                    value={sav.years}
                    onChange={(v) => setSav((s) => ({ ...s, years: v }))}
                  />
                </InputsPanel>
                <ResultsPanel title="Results (monthly compounding)">
                  <KV
                    label="Total Future Value"
                    value={fmtUSD(savings.total)}
                  />
                  <KV
                    label="Total Contributed"
                    value={fmtUSD(savings.contributed)}
                  />
                  <KV label="Total Growth" value={fmtUSD(savings.growth)} />
                </ResultsPanel>
              </div>
              <div className="px-6 pb-6">
                <ExplanationPanel title="How this works">
                  <ul className="ml-5 list-disc">
                    <li>
                      FV = P(1+r)<sup>n</sup> + PMT × [((1+r)<sup>n</sup> − 1) /
                      r], with monthly r and n.
                    </li>
                    <li>
                      Change years/contributions to see compounding effects.
                    </li>
                  </ul>
                </ExplanationPanel>
              </div>
            </Gate>
          </section>
        )}

        {/* Debt Payoff (Plus) */}
        {!freeOnly && activeCalc === "debt-payoff" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft relative">
            <Header title="Debt Payoff Calculator" />
            <Gate calc="debt-payoff">
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <InputsPanel title="Inputs">
                  <Input
                    id="debt_bal"
                    label="Balance ($)"
                    value={debt.balance}
                    onChange={(v) => setDebt((s) => ({ ...s, balance: v }))}
                  />
                  <Input
                    id="debt_apr"
                    label="APR (%)"
                    value={debt.aprPct}
                    onChange={(v) => setDebt((s) => ({ ...s, aprPct: v }))}
                  />
                  <Input
                    id="debt_pay"
                    label="Monthly Payment ($)"
                    value={debt.monthlyPay}
                    onChange={(v) => setDebt((s) => ({ ...s, monthlyPay: v }))}
                  />
                </InputsPanel>
                <ResultsPanel title="Results (fixed payment)">
                  <KV
                    label="Months to Payoff"
                    value={
                      payoff.months === Infinity
                        ? "Payment too small"
                        : payoff.months.toString()
                    }
                  />
                  <KV label="Total Paid" value={fmtUSD(payoff.totalPaid)} />
                  <KV label="Total Interest" value={fmtUSD(payoff.interest)} />
                </ResultsPanel>
              </div>
              <div className="px-6 pb-6">
                <ExplanationPanel title="How this works">
                  <ul className="ml-5 list-disc">
                    <li>Months = −ln(1 − iB/P) ÷ ln(1+i) with monthly i.</li>
                    <li>
                      If payment ≤ monthly interest, balance won't fall —
                      increase payment.
                    </li>
                  </ul>
                </ExplanationPanel>
              </div>
            </Gate>
          </section>
        )}

        {/* Employee Cost (Pro choice via Gate) */}
        {!freeOnly && activeCalc === "employee-cost" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft relative">
            <Header title="Employee Cost Calculator" />
            {/* Gate calc id maps to entitlements-client ("employee_cost") */}
            <Gate calc="employee-cost">
              <div className="p-0 md:p-0">
                <EmployeeCostPro onUpgrade={handleUpgrade} />
              </div>
            </Gate>
          </section>
        )}

        {/* Expense Split Deluxe (Pro / Premium via Gate) */}
        {!freeOnly && activeCalc === "expense-split-deluxe" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft relative">
            <Header title="Expense Split Deluxe" />
            <Gate calc="expense-split-deluxe">
              <div className="p-4 md:p-6">
                <ExpenseSplitDeluxe onUpgrade={handleUpgrade} />
              </div>
            </Gate>
          </section>
        )}
      </main>
    </div>
  );
}

