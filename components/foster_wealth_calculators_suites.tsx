"use client";

import {
  BarChart3,
  DollarSign,
  Home,
  PiggyBank,
  ShoppingCart,
  RotateCcw,
  TrendingUp,
  Users
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import AdsterraBanner from "@/components/AdsterraBanner";

import PremiumResultCard from "@/components/ui/PremiumResultCard";
import ProfessionalCard from "@/components/ui/ProfessionalCard";
import ProfessionalInput from "@/components/ui/ProfessionalInput";
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

const ShoppingBudget = dynamic(() => import("./shopping-budget-calc"), {
  ssr: false,
  loading: () => (<div className="p-4 text-sm opacity-70">Loading Shopping Budget…</div>),
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
  | "tip-split-by-order"
  | "shopping-budget"
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
    "shopping-budget": {
      name: "Shopping Budget",
      icon: ShoppingCart,
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

const ROI_DEFAULTS = {
  initialInvestment: "10000",
  finalValue: "15000",
  timeHorizon: "2",
};
const BE_DEFAULTS = {
  fixedCosts: "5000",
  variableCostPerUnit: "15",
  pricePerUnit: "25",
  profitTarget: "0",
  currentUnits: "0",
  monthlyUnits: "0",
};
const MTG_DEFAULTS = {
  loanAmount: "400000",
  interestRate: "6.5",
  loanTerm: "30",
  downPayment: "80000",
  downPaymentMode: "amount" as "amount" | "percent",
  propertyTax: "3600",
  propertyTaxMode: "annual" as "annual" | "monthly",
  insurance: "1200",
  insuranceMode: "annual" as "annual" | "monthly",
  pmi: "0",
  pmiMode: "monthly" as "annual" | "monthly",
  hoa: "0",
};
const INT_DEFAULTS = {
  principal: "10000",
  annualRatePct: "5",
  years: "10",
  monthlyContribution: "0",
  frequency: "monthly" as CompoundValue,
};
const FR_DEFAULTS = {
  annualIncome: "120000",
  weeksOff: "4",
  hoursPerWeek: "30",
  overheadPct: "10",
};
const TIP_DEFAULTS = {
  bill: "120.00",
  people: "3",
  discountMode: "percent" as "percent" | "amount",
  discountValue: "0",
  taxPct: "8.5",
  tipPct: "18",
  tipOn: "afterDiscount" as "afterDiscount" | "beforeDiscount",
};
const ORDER_DEFAULTS = {
  yours: "0",
  others: [""],
  shared: "0",
  sharers: "",
};
const SAV_DEFAULTS = {
  start: "10000",
  monthly: "250",
  ratePct: "6",
  years: "10",
};
const DEBT_DEFAULTS = {
  balance: "12000",
  aprPct: "19.99",
  monthlyPay: "350",
};

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

// --- Robust numeric helpers ---
const toNum = (v: string | number) =>
  Number(String(v ?? "").replace(/[^0-9.+-eE]/g, "")) || 0;

const toPct = (v: string | number) => fmtPct(toNum(v) / 100);

// --- CSV export helper ---
const downloadCSV = (rows: Record<string, string | number>[], filename: string) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const body = rows.map(r => headers.map(h => String(r[h] ?? "")).join(",")).join("\n");
  const csv = [headers.join(","), body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const solveMonthlyForGoal = (FV: number, P: number, rMonthly: number, n: number) => {
  if (n <= 0) return 0;
  if (rMonthly <= 0) return (FV - P) / n;
  const a = Math.pow(1 + rMonthly, n);
  return (rMonthly * (FV - P * a)) / (a - 1);
};

const solvePaymentForMonths = (B: number, iMonthly: number, n: number) => {
  if (n <= 0) return B;
  if (iMonthly <= 0) return B / n;
  return (iMonthly * B) / (1 - Math.pow(1 + iMonthly, -n));
};

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
        ? "border-aure-400 bg-aure-50 text-plum-800 ring-2 ring-aure-400/30"
        : "border-plum-300 hover:border-aure-400 text-plum-700 hover:text-plum-800",
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
  <ProfessionalInput
    id={id}
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    type={type === "number" ? "number" : "text"}
    inputMode={type === "number" ? "decimal" : undefined}
    placeholder={placeholder}
  />
);

const ToggleGroup: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="inline-flex overflow-hidden rounded-lg border border-plum-300">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={[
          "px-3 py-2 text-sm",
          value === o.value
            ? "bg-plum-600 text-white"
            : "bg-white hover:bg-plum-50 text-plum-700",
        ].join(" ")}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const ExplanationPanel: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="card-regal p-4">
    <h3 className="mb-2 text-sm font-semibold text-plum-900 dark:text-plum-100">{title}</h3>
    <div className="prose prose-sm max-w-none text-plum-900 dark:text-plum-100">{children}</div>
  </div>
);

const InputsPanel: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="card-regal p-4">
    <h3 className="mb-4 text-sm font-semibold text-plum-900 dark:text-plum-100">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const ResultsPanel: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="card-regal p-4">
    <h3 className="mb-4 text-sm font-semibold text-plum-900 dark:text-plum-100">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const KV: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <PremiumResultCard
    title={label}
    value={value}
    variant="default"
  />
);

const Header: React.FC<{ title: string }> = ({ title }) => (
  <div className="border-b border-plum-200 bg-plum-50/50 px-3 py-2">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-purple-title">{title}</h2>
  </div>
);

const ClearButton: React.FC<{ onClick: () => void; label?: string }> = ({
  onClick,
  label = "Clear & start over",
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-md border border-plum-300 bg-white px-3 py-2 text-sm font-medium text-plum-700 shadow-sm transition hover:bg-plum-50 focus:outline-none focus:ring-2 focus:ring-aure-400/50"
  >
    <RotateCcw className="h-4 w-4" aria-hidden="true" />
    {label}
  </button>
);

/** ----------------------------------------------------------------------------------------------
 *  Interest helpers (frequency map + table)
 * ---------------------------------------------------------------------------------------------- */
const COMPOUND_OPTIONS = [
  { value: "annually", label: "Annually", n: 1 },
  { value: "semiannually", label: "Semi-Annually", n: 2 },
  { value: "quarterly", label: "Quarterly", n: 4 },
  { value: "monthly", label: "Monthly", n: 12 },
  { value: "weekly", label: "Weekly", n: 52 },
  { value: "daily", label: "Daily", n: 365 },
] as const;

type CompoundValue = (typeof COMPOUND_OPTIONS)[number]["value"];
const nFrom = (v: CompoundValue) => COMPOUND_OPTIONS.find(o => o.value === v)!.n;

type YearRow = {
  year: number;
  start: number;
  contributions: number;
  interest: number;
  end: number;
};

const YearBreakdownTable: React.FC<{ rows: YearRow[] }> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-plum-200 bg-white/80 backdrop-blur">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-plum-50/80">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-plum-900 dark:text-plum-100">Year</th>
            <th className="px-4 py-3 font-semibold text-plum-900 dark:text-plum-100">Starting Balance</th>
            <th className="px-4 py-3 font-semibold text-plum-900 dark:text-plum-100">Contributions</th>
            <th className="px-4 py-3 font-semibold text-plum-900 dark:text-plum-100">Interest</th>
            <th className="px-4 py-3 font-semibold text-plum-900 dark:text-plum-100">Ending Balance</th>
          </tr>
        </thead>
        <tbody className="text-plum-900 dark:text-plum-100">
          {rows.map((r) => (
            <tr key={r.year} className="odd:bg-white dark:odd:bg-plum-900/20 even:bg-neutral-50 dark:even:bg-plum-900/10">
              <td className="px-4 py-3">{r.year}</td>
              <td className="px-4 py-3">{fmtUSD(r.start)}</td>
              <td className="px-4 py-3">{fmtUSD(r.contributions)}</td>
              <td className="px-4 py-3">{fmtUSD(r.interest)}</td>
              <td className="px-4 py-3">{fmtUSD(r.end)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** ----------------------------------------------------------------------------------------------
 *  Component
 * ---------------------------------------------------------------------------------------------- */
export default function FosterWealthCalculators({
  freeOnly = false,
  allowedCalcs,
}: {
  freeOnly?: boolean;
  allowedCalcs?: CalcKey[];
}) {
  const { planId } = useEntitlements(); // single source of truth for plan (Free shows ads) - now includes dev override
  const [activeCalc, setActiveCalc] = useState<CalcKey>(
    (allowedCalcs && allowedCalcs[0]) || "roi",
  );

  const allowedSet = useMemo(
    () => (allowedCalcs && allowedCalcs.length ? new Set(allowedCalcs) : null),
    [allowedCalcs],
  );

  // Clamp visible calculators to allowed list (if provided) and free tier when freeOnly is true.
  const visibleCalcs = Object.entries(calcMeta.calculators).filter(
    ([key, meta]) => {
      if (freeOnly && meta.tier !== "free") return false;
      if (allowedSet && !allowedSet.has(key as CalcKey)) return false;
      return true;
    },
  );

  const defaultCalc = visibleCalcs[0]?.[0] as CalcKey | undefined;

  // Deep-link support (?calc=), with safety for freeOnly and optional allowedCalcs
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    const alias = (s: string | null | undefined): CalcKey | null => {
      const key = (s || "").toLowerCase();
      if (!key) return null;
      if ((calcMeta.calculators as any)[key]) return key as CalcKey;
      // map URL slugs to internal keys
      const map: Record<string, CalcKey> = {
        "tip-and-tab-split": "tip-split",
        "split-by-order": "tip-split-by-order",
        "savings-growth": "savings",
      };
      return map[key] || null;
    };

    const qpChoice = alias(searchParams.get("calc"));
    let chosen: CalcKey | null = qpChoice;
    if (!chosen && pathname) {
      const parts = pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      chosen = alias(last);
    }

    if (chosen) {
      if (allowedSet && !allowedSet.has(chosen)) chosen = defaultCalc || chosen;
      const tier = (calcMeta.calculators as any)[chosen]?.tier as
        | "free"
        | "plus"
        | "pro";
      if (freeOnly && tier !== "free") setActiveCalc(defaultCalc || "roi");
      else setActiveCalc(chosen);
    } else if (defaultCalc) {
      setActiveCalc(defaultCalc);
    }
  }, [searchParams, pathname, freeOnly, allowedSet, defaultCalc]);

  // Upgrade handler for paid calculators
  const handleUpgrade = () => {
    // This will trigger the upgrade flow in your app
    // You can integrate with your existing upgrade modal or navigation
    console.log("Upgrade triggered for calculator:", activeCalc);
    // Example: window.location.href = "/upgrade";
    // Or: openUpgradeModal();
  };

  /* ---------------- ROI ---------------- */
  const [roiInputs, setRoiInputs] = useState({ ...ROI_DEFAULTS });
  const [roiTimeUnit, setRoiTimeUnit] = useState<"years" | "months">("years");
  const [targetRoiPercent, setTargetRoiPercent] = useState(25);
  const [roiAdvanced, setRoiAdvanced] = useState(false);
  const [roiMidCashFlow, setRoiMidCashFlow] = useState("0");

  const formatRoiTimeValue = (val: number) => {
    if (!Number.isFinite(val)) return "0";
    const fixed = Number(val.toFixed(4));
    const cleaned = fixed.toString().replace(/\.?0+$/, "");
    return cleaned || "0";
  };

  const handleRoiTimeUnitChange = (unit: "years" | "months") => {
    if (unit === roiTimeUnit) return;
    setRoiInputs((prev) => {
      const numeric = parseFloat(prev.timeHorizon);
      if (!Number.isFinite(numeric)) return prev;
      const converted =
        unit === "years" ? numeric / 12 : numeric * 12;
      return {
        ...prev,
        timeHorizon: formatRoiTimeValue(converted),
      };
    });
    setRoiTimeUnit(unit);
  };

  const roi = useMemo(() => {
    const P = toNum(roiInputs.initialInvestment);
    const F = toNum(roiInputs.finalValue);
    const rawTime = toNum(roiInputs.timeHorizon) || 0;
    const timeHorizonYears =
      roiTimeUnit === "years" ? rawTime : rawTime / 12;
    const midCash = roiAdvanced ? toNum(roiMidCashFlow) : 0;
    const totalInvested = P + midCash;
    const averageCapital = P + midCash / 2;
    const netProfit = F - totalInvested;
    const invalidExposure =
      roiAdvanced && (averageCapital <= 0 || totalInvested <= 0);
    const baseTotal = P === 0 ? 0 : (F - P) / P;
    const total = P === 0 ? 0 : (F - P) / P;
    const advancedTotal =
      averageCapital !== 0 ? netProfit / averageCapital : 0;
    const finalTotal =
      roiAdvanced && !invalidExposure ? advancedTotal : baseTotal;
    const annual =
      timeHorizonYears <= 0
        ? 0
        : Math.pow(1 + finalTotal, 1 / timeHorizonYears) - 1;
    const finalNetProfit =
      roiAdvanced && !invalidExposure ? netProfit : F - P;
    const finalAmount = F;
    return {
      total: finalTotal,
      annual,
      netProfit: finalNetProfit,
      finalAmount,
      invalidAverage: invalidExposure,
      totalInvested,
      averageCapital,
    };
  }, [roiInputs, roiTimeUnit, roiAdvanced, roiMidCashFlow]);

  const roiTarget = useMemo(() => {
    const initial = toNum(roiInputs.initialInvestment);
    if (initial <= 0) {
      return {
        requiredFinal: 0,
        requiredNet: 0,
        isDisabled: true,
      };
    }
    const targetDecimal = targetRoiPercent / 100;
    const requiredFinal = initial * (1 + targetDecimal);
    return {
      requiredFinal,
      requiredNet: requiredFinal - initial,
      isDisabled: false,
    };
  }, [roiInputs.initialInvestment, targetRoiPercent]);

  /* ------------- Break-Even ------------- */
  const [beInputs, setBeInputs] = useState({ ...BE_DEFAULTS });
  const beDerived = useMemo(() => {
    const FC = toNum(beInputs.fixedCosts);
    const VC = toNum(beInputs.variableCostPerUnit);
    const P = toNum(beInputs.pricePerUnit);
    const targetProfit = Math.max(0, toNum(beInputs.profitTarget));
    const currentUnits = Math.max(0, toNum(beInputs.currentUnits));
    const monthlyUnits = Math.max(0, toNum(beInputs.monthlyUnits));

    const cm = P - VC;
    const cmPct = P > 0 ? cm / P : 0;
    const breakEvenUnits = cm <= 0 ? Infinity : Math.ceil(FC / cm);
    const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * P : Infinity;

    const profitUnits = cm <= 0 ? Infinity : Math.ceil((FC + targetProfit) / cm);
    const profitRevenue = isFinite(profitUnits) ? profitUnits * P : Infinity;

    const safetyMargin = currentUnits > 0 && isFinite(breakEvenUnits)
      ? (currentUnits - breakEvenUnits) / currentUnits
      : null;

    const monthsToBE = monthlyUnits > 0 && isFinite(breakEvenUnits)
      ? breakEvenUnits / monthlyUnits
      : null;

    return {
      cm,
      cmPct,
      breakEvenUnits,
      breakEvenRevenue,
      profitUnits,
      profitRevenue,
      safetyMargin,
      monthsToBE,
    };
  }, [beInputs]);

  /* --------------- Mortgage -------------- */
  const [mtgInputs, setMtgInputs] = useState({ ...MTG_DEFAULTS });
  const mtg = useMemo(() => {
    const monthlyFromMode = (val: string, mode: "annual" | "monthly") => {
      const num = Math.max(toNum(val), 0);
      return mode === "annual" ? num / 12 : num;
    };

    const loanAmount = Math.max(parseFloat(mtgInputs.loanAmount) || 0, 0);
    const downPayRaw = Math.max(parseFloat(mtgInputs.downPayment) || 0, 0);
    const downPayment =
      mtgInputs.downPaymentMode === "percent"
        ? (loanAmount * downPayRaw) / 100
        : downPayRaw;
    const loan = Math.max(loanAmount - downPayment, 0);
    const annualRate = (parseFloat(mtgInputs.interestRate) || 0) / 100;
    const nYears = parseFloat(mtgInputs.loanTerm) || 30;
    const r = annualRate / 12;
    const n = nYears * 12;
    const monthlyPI =
      r <= 0 ? loan / Math.max(n, 1) : (loan * r) / (1 - Math.pow(1 + r, -n));

    const taxMonthly = monthlyFromMode(mtgInputs.propertyTax, mtgInputs.propertyTaxMode);
    const insuranceMonthly = monthlyFromMode(mtgInputs.insurance, mtgInputs.insuranceMode);
    const pmiMonthly = monthlyFromMode(mtgInputs.pmi, mtgInputs.pmiMode);
    const hoaMonthly = Math.max(toNum(mtgInputs.hoa), 0);
    const monthlyAddOns = taxMonthly + insuranceMonthly + pmiMonthly + hoaMonthly;

    return {
      monthlyPI,
      monthlyAddOns,
      totalMonthly: monthlyPI + monthlyAddOns,
      total: monthlyPI * n,
    };
  }, [mtgInputs]);


  /* ---------- Simple vs Compound Interest (enhanced) ---------- */
  const [interestMode, setInterestMode] =
    useState<"simple" | "compound">("compound");
  const [intInputs, setIntInputs] = useState({ ...INT_DEFAULTS });
  const interest = useMemo(() => {
    const P = Math.max(parseFloat(intInputs.principal) || 0, 0);
    const r = Math.max((parseFloat(intInputs.annualRatePct) || 0) / 100, 0);
    const years = Math.max(parseFloat(intInputs.years) || 0, 0);
    const PMT = Math.max(parseFloat(intInputs.monthlyContribution) || 0, 0);
    const months = Math.round(years * 12);

    if (months <= 0 || r < 0) {
      const contributed = P + PMT * months;
      const breakdown: YearRow[] = [];
      return { amount: contributed, interest: 0, contributed, breakdown };
    }

    let balance = P;
    let cumPrincipal = P; // total principal so far (initial + contributions)
    let totalInterest = 0;
    let rows: YearRow[] = [];

    let yearStartBal = balance;
    let yearInterest = 0;
    let yearContrib = 0;

    const n = nFrom(intInputs.frequency);
    // Convert chosen compounding frequency to an equivalent monthly rate:
    // r_month_compound = (1 + r/n)^(n/12) - 1
    const rMonthCompound = Math.pow(1 + r / n, n / 12) - 1;
    const rMonthSimple = r / 12;

    for (let m = 1; m <= months; m++) {
      if (interestMode === "compound") {
        const iM = balance * rMonthCompound; // interest on balance (compounds)
        totalInterest += iM;
        balance += iM;
        balance += PMT;          // contribution at end of month
        cumPrincipal += PMT;

        yearInterest += iM;
        yearContrib += PMT;
      } else {
        // SIMPLE: interest accrues on principal only (no compounding on interest)
        const iM = cumPrincipal * rMonthSimple;
        totalInterest += iM;

        cumPrincipal += PMT;     // contribution at end of month
        balance = cumPrincipal + totalInterest;

        yearInterest += iM;
        yearContrib += PMT;
      }

      if (m % 12 === 0 || m === months) {
        const yearIndex = Math.ceil(m / 12);
        rows.push({
          year: yearIndex,
          start: yearStartBal,
          contributions: yearContrib,
          interest: yearInterest,
          end: balance,
        });
        yearStartBal = balance;
        yearInterest = 0;
        yearContrib = 0;
      }
    }

    const contributed = P + PMT * months;
    return { amount: balance, interest: totalInterest, contributed, breakdown: rows };
  }, [intInputs, interestMode]);

  /* --------------- Freelancer Rate --------------- */
  const [frInputs, setFrInputs] = useState({ ...FR_DEFAULTS });
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
  const [tipInputs, setTipInputs] = useState({ ...TIP_DEFAULTS });

  // --- Split by Order (incl. shared appetizers) ---
  const [orderYour, setOrderYour] = useState(ORDER_DEFAULTS.yours);
  const [orderOthers, setOrderOthers] = useState<string[]>([...ORDER_DEFAULTS.others]);
  const [orderShared, setOrderShared] = useState(ORDER_DEFAULTS.shared);
  const [orderSharers, setOrderSharers] = useState<string>(ORDER_DEFAULTS.sharers);

  const parsedYour = toNum(orderYour);
  const parsedOthers = orderOthers.map((v) => toNum(v));
  const shared = toNum(orderShared);

  // if blank, default sharers to "everyone who entered something"
  const positiveOthers = parsedOthers.filter((v) => v > 0).length;
  const baseSharers = 1 + positiveOthers;
  const sharers = Math.min(baseSharers, Math.max(1, toNum(orderSharers) || baseSharers));

  // Pre-tax allocation including shared
  const yourPre = parsedYour + (shared / sharers);
  const totalPre =
    parsedYour + parsedOthers.reduce((a, b) => a + b, 0) + shared;

  const yourRatio = totalPre > 0 ? yourPre / totalPre : 0;

  const tipSplit = useMemo(() => {
    const bill = parseFloat(tipInputs.bill) || 0;
    const rawPeople = Math.max(parseInt(tipInputs.people || "1", 10) || 1, 1);
    const peopleCap = planId === "free" ? 4 : 100; // generous cap for paid
    const people = Math.min(rawPeople, peopleCap);
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

  // Final bill comes from your existing calculator (after discount/tax/tip)
  const yourOwe = yourRatio * tipSplit.total;

  /* ---------------- Savings Growth ---------------- */
  const [sav, setSav] = useState({ ...SAV_DEFAULTS });
  const [savingsTarget, setSavingsTarget] = useState<string>("");

  const savings = useMemo(() => {
    const P = toNum(sav.start);
    const PMT = toNum(sav.monthly);
    const rMonthly = toNum(sav.ratePct) / 100 / 12;
    const n = toNum(sav.years) * 12;

    // core FV
    const growth = rMonthly > 0 ? PMT * ((Math.pow(1 + rMonthly, n) - 1) / rMonthly) : PMT * n;
    const total = P * Math.pow(1 + rMonthly, n) + growth;
    const contributed = P + PMT * n;

    // goal solver (optional)
    const targetFV = toNum(savingsTarget);
    const requiredMonthly = targetFV > 0 ? solveMonthlyForGoal(targetFV, P, rMonthly, n) : 0;

    // Yearly schedule (aggregate every 12 months)
    let balance = P;
    let yearStart = P;
    let yearContrib = 0;
    let yearInterest = 0;
    const rows: { year: number; start: number; contributions: number; interest: number; end: number }[] = [];
    for (let m = 1; m <= n; m++) {
      // interest on current balance
      const iM = balance * rMonthly;
      balance += iM;
      yearInterest += iM;

      // contribution at end of month
      balance += PMT;
      yearContrib += PMT;

      if (m % 12 === 0 || m === n) {
        const y = Math.ceil(m / 12);
        rows.push({ year: y, start: yearStart, contributions: yearContrib, interest: yearInterest, end: balance });
        yearStart = balance;
        yearContrib = 0;
        yearInterest = 0;
      }
    }

    return {
      total,
      contributed,
      growth: total - contributed,
      requiredMonthly,
      targetFV,
      breakdown: rows,
    };
  }, [sav, savingsTarget]);

  /* ---------------- Debt Payoff ---------------- */
  const [debt, setDebt] = useState({ ...DEBT_DEFAULTS });

  const [debtTargetMonths, setDebtTargetMonths] = useState<string>("");
  const [debtExtra, setDebtExtra] = useState<string>("0");

  const resetRoi = () => {
    setRoiInputs({ ...ROI_DEFAULTS });
    setRoiTimeUnit("years");
    setTargetRoiPercent(25);
    setRoiAdvanced(false);
    setRoiMidCashFlow("0");
  };
  const resetBreakEven = () => setBeInputs({ ...BE_DEFAULTS });
  const resetMortgage = () => setMtgInputs({ ...MTG_DEFAULTS });
  const resetInterest = () => {
    setInterestMode("compound");
    setIntInputs({ ...INT_DEFAULTS });
  };
  const resetFreelancer = () => setFrInputs({ ...FR_DEFAULTS });
  const resetTipSplit = () => {
    setTipInputs({ ...TIP_DEFAULTS });
    setOrderYour(ORDER_DEFAULTS.yours);
    setOrderOthers([...ORDER_DEFAULTS.others]);
    setOrderShared(ORDER_DEFAULTS.shared);
    setOrderSharers(ORDER_DEFAULTS.sharers);
  };
  const resetSavings = () => {
    setSav({ ...SAV_DEFAULTS });
    setSavingsTarget("");
  };
  const resetDebt = () => {
    setDebt({ ...DEBT_DEFAULTS });
    setDebtTargetMonths("");
    setDebtExtra("0");
  };
  const payoff = useMemo(() => {
    const B = toNum(debt.balance);
    const i = toNum(debt.aprPct) / 100 / 12;
    const P = toNum(debt.monthlyPay);

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

  // Debt quick-win derived values
  const B = toNum(debt.balance);
  const iMonthly = toNum(debt.aprPct) / 100 / 12;
  const basePmt = toNum(debt.monthlyPay);

  // Target months solver
  const nTarget = Math.max(0, Math.floor(toNum(debtTargetMonths)));
  const requiredForTarget = nTarget > 0 ? solvePaymentForMonths(B, iMonthly, nTarget) : 0;

  // Payoff date from existing payoff.months
  const payoffDate = isFinite(payoff.months)
    ? new Date(new Date().setMonth(new Date().getMonth() + payoff.months))
    : null;

  // Extra payment scenario (flat monthly)
  const pmtExtra = basePmt + toNum(debtExtra);
  const payoffWithExtra = useMemo(() => {
    if (iMonthly <= 0) {
      const m = Math.ceil(B / Math.max(pmtExtra, 1));
      const total = pmtExtra * m;
      return { months: m, totalPaid: total, interest: total - B };
    }
    if (pmtExtra <= B * iMonthly) return { months: Infinity, totalPaid: Infinity, interest: Infinity };
    const m = Math.ceil(-Math.log(1 - (iMonthly * B) / pmtExtra) / Math.log(1 + iMonthly));
    const total = pmtExtra * m;
    return { months: m, totalPaid: total, interest: total - B };
  }, [B, iMonthly, pmtExtra]);

  const monthsSaved = (isFinite(payoff.months) && isFinite(payoffWithExtra.months))
    ? Math.max(payoff.months - payoffWithExtra.months, 0)
    : 0;

  const interestSaved = (isFinite(payoff.interest) && isFinite(payoffWithExtra.interest))
    ? Math.max(payoff.interest - payoffWithExtra.interest, 0)
    : 0;

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
      </div>
      {/* Main calculator body */}
      <main className="fwv-container mt-4 flex-grow space-y-6 pb-10">
        {/* ROI */}
        {activeCalc === "roi" && (
          <section className="mt-4">
            <ProfessionalCard>
              <Header title="ROI Calculator" />
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetRoi} />
              </div>
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
                  <div className="mt-2 space-y-1 text-xs text-neutral-600">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex overflow-hidden rounded-lg border border-plum-200">
                        <button
                          type="button"
                          onClick={() => handleRoiTimeUnitChange("years")}
                          className={`px-3 py-1 text-[11px] font-semibold transition ${
                            roiTimeUnit === "years"
                              ? "bg-plum-600 text-white"
                              : "bg-white text-plum-700 hover:bg-plum-50"
                          }`}
                          aria-pressed={roiTimeUnit === "years"}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoiTimeUnitChange("months")}
                          className={`px-3 py-1 text-[11px] font-semibold transition ${
                            roiTimeUnit === "months"
                              ? "bg-plum-600 text-white"
                              : "bg-white text-plum-700 hover:bg-plum-50"
                          }`}
                          aria-pressed={roiTimeUnit === "months"}
                        >
                          Months
                        </button>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        You can use decimal years (e.g., 1.5) or switch to months for short projects.
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700">
                    <label className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                      <input
                        type="checkbox"
                        checked={roiAdvanced}
                        onChange={() => setRoiAdvanced((v) => !v)}
                        className="h-4 w-4 rounded border-neutral-300 text-plum-600 focus:ring-plum-500"
                      />
                      <span className="font-medium">Show advanced cash-flow option</span>
                    </label>
                    {roiAdvanced && (
                      <div className="mt-3 space-y-2">
                        <Input
                          id="roi_mid_cash"
                          label="Mid-period cash-flow (halfway point)"
                          value={roiMidCashFlow}
                          onChange={(val) => setRoiMidCashFlow(val)}
                          placeholder="e.g., 2000 or -1500"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Positive = added more capital halfway through; negative = withdrew funds. We adjust ROI using your average invested capital.
                        </p>
                      </div>
                    )}
                  </div>
                </InputsPanel>
                <ResultsPanel title="Results">
                  <KV label="Final Amount" value={fmtUSD(roi.finalAmount)} />
                  <KV label="Net Profit" value={fmtUSD(roi.netProfit)} />
                  <KV label="Total ROI" value={fmtPct(roi.total)} />
                  <KV label="Annualized ROI" value={fmtPct(roi.annual)} />
                  {roi.invalidAverage && (
                    <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      The midpoint cash-flow makes total invested or average capital zero/negative. ROI can&rsquo;t be computed with that setup; try lowering the withdrawal or turning off the advanced option.
                    </p>
                  )}
                </ResultsPanel>
              </div>
              <details className="px-6 pb-5">
                <summary className="cursor-pointer text-sm font-semibold text-plum-800 hover:text-plum-900 dark:text-plum-100">
                  Want to hit a specific ROI?
                </summary>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="grid gap-4 md:grid-cols-[2fr_minmax(150px,1fr)]">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Target ROI (%)
                      </label>
                      <input
                        type="range"
                        min={-50}
                        max={200}
                        step={1}
                        value={targetRoiPercent}
                        onChange={(e) =>
                          setTargetRoiPercent(
                            Math.min(200, Math.max(-50, Number(e.target.value))),
                          )
                        }
                        className="w-full accent-plum-600"
                      />
                      <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
                        <span>-50%</span>
                        <span>200%</span>
                      </div>
                    </div>
                    <Input
                      id="roi_target_precision"
                      label="Exact target (%)"
                      type="number"
                      value={String(targetRoiPercent)}
                      onChange={(val) => {
                        const next = Number(val);
                        if (!Number.isFinite(next)) return;
                        setTargetRoiPercent(Math.min(200, Math.max(-50, next)));
                      }}
                    />
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {roiTarget.isDisabled ? (
                      <p className="text-neutral-600 dark:text-neutral-300">
                        Enter an initial investment above $0 to see the required final amount.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                          Required Final Amount
                        </div>
                        <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                          {fmtUSD(roiTarget.requiredFinal)}
                        </div>
                        <div className="text-xs text-neutral-500">
                          You need {fmtUSD(roiTarget.requiredNet)} in net profit to reach {targetRoiPercent.toFixed(0)}% ROI.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>
              <div className="px-6 pb-5">
                <ExplanationPanel title="How this works">
                  <ol className="ml-5 list-decimal space-y-3 text-sm">
                    <li>
                      <p className="font-semibold">Basic ROI</p>
                      <p className="text-neutral-600">
                        ROI measures how much you earned relative to the capital that was working on average.
                      </p>
                      <ul className="ml-5 list-disc text-neutral-600">
                        <li>Net profit = final value − initial investment − mid-period contribution</li>
                        <li>Average invested capital = initial investment + (mid-period contribution ÷ 2)</li>
                        <li>ROI = net profit ÷ average invested capital</li>
                      </ul>
                    </li>
                    <li>
                      <p className="font-semibold">Annualized ROI</p>
                      <p className="text-neutral-600">
                        We convert your time input into years so a 6-month project and a 3-year project line up fairly.
                      </p>
                      <ul className="ml-5 list-disc text-neutral-600">
                        <li>Annualized ROI = (1 + ROI)<sup>1 ÷ years</sup> − 1</li>
                      </ul>
                    </li>
                    <li>
                      <p className="font-semibold">Mid-period cash-flow</p>
                      <p className="text-neutral-600">
                        Use a positive number for extra capital added halfway through the period. Withdrawals aren’t supported because they can produce misleading percentages.
                      </p>
                    </li>
                    <li>
                      <p className="font-semibold">Target ROI</p>
                      <p className="text-neutral-600">
                        “Want to hit a specific ROI?” runs the same ROI formula in reverse—keeping your initial investment and midpoint contribution—to solve for the final value you’d need.
                      </p>
                    </li>
                  </ol>
                  <p className="mt-2">
                    Learn more:{" "}
                    <Link
                      className="text-brand-600 underline hover:text-brand-700 transition-colors"
                      href="/guide/roi-vs-annualized-roi"
                    >
                      ROI vs Annualized ROI—How to Read Them & Boost Your
                      Investment Strategy
                    </Link>
                  </p>
                </ExplanationPanel>
                <AdsterraBanner />
              </div>
            </ProfessionalCard>
          </section>
        )}

        {/* Break-Even */}
        {activeCalc === "break-even" && (
          <section className="mt-4">
            <ProfessionalCard>
              <Header title="Break-Even Calculator" />
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetBreakEven} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
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
                  <Input
                    id="be_profit"
                    label="Target Profit ($, optional)"
                    value={beInputs.profitTarget}
                    onChange={(v) => setBeInputs((s) => ({ ...s, profitTarget: v }))}
                    placeholder="e.g., 10000"
                  />
                  <Input
                    id="be_current_units"
                    label="Current Sales (units, optional)"
                    value={beInputs.currentUnits}
                    onChange={(v) => setBeInputs((s) => ({ ...s, currentUnits: v }))}
                    placeholder="e.g., 1200"
                  />
                  <Input
                    id="be_monthly_units"
                    label="Expected Monthly Units (optional)"
                    value={beInputs.monthlyUnits}
                    onChange={(v) => setBeInputs((s) => ({ ...s, monthlyUnits: v }))}
                    placeholder="e.g., 150"
                  />
                </InputsPanel>
                <ResultsPanel title="Results">
                  <KV
                    label="Break-Even (units)"
                    value={isFinite(beDerived.breakEvenUnits) ? `${Math.round(beDerived.breakEvenUnits).toLocaleString()} units` : "N/A"}
                  />
                  <KV
                    label="Break-Even (revenue)"
                    value={isFinite(beDerived.breakEvenRevenue) ? fmtUSD(beDerived.breakEvenRevenue) : "N/A"}
                  />
                  <KV
                    label="Contribution Margin"
                    value={`${fmtUSD(beDerived.cm)} (${fmtPct(beDerived.cmPct)})`}
                  />
                  {beDerived.profitUnits !== Infinity && (
                    <KV
                      label="Units for Target Profit"
                      value={`${Math.round(beDerived.profitUnits).toLocaleString()} (${fmtUSD(beDerived.profitRevenue)})`}
                    />
                  )}
                  {beDerived.safetyMargin !== null && isFinite(beDerived.breakEvenUnits) && (
                    <KV
                      label="Safety Margin"
                      value={`${fmtPct(beDerived.safetyMargin)} ${beDerived.safetyMargin < 0 ? "(below break-even)" : ""}`}
                    />
                  )}
                  {beDerived.monthsToBE !== null && (
                    <KV
                      label="Time to Break-Even"
                      value={isFinite(beDerived.monthsToBE) ? `${Math.ceil(beDerived.monthsToBE)} months` : "N/A"}
                    />
                  )}
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
                      className="text-brand-600 underline hover:text-brand-700 transition-colors"
                      href="/guide/break-even-made-simple"
                    >
                      Break-Even Made Simple—Use Our Calculator to Master Costs &
                      Profit Margins
                    </Link>
                  </p>
                </ExplanationPanel>
              </div>
            </ProfessionalCard>
          </section>
        )}

        {/* Mortgage */}
        {activeCalc === "mortgage" && (
          <section className="mt-4">
            <ProfessionalCard>
              <Header title="Mortgage Calculator" />
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetMortgage} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
                <InputsPanel title="Inputs">
                  <Input
                    id="mtg_loan"
                    label="Home Price / Loan Amount"
                    value={mtgInputs.loanAmount}
                    onChange={(v) =>
                      setMtgInputs((s) => ({ ...s, loanAmount: v }))
                    }
                  />
                  <div className="space-y-2">
                    <Input
                      id="mtg_down"
                      label={`Down Payment (${mtgInputs.downPaymentMode === "percent" ? "%" : "$"})`}
                      value={mtgInputs.downPayment}
                      onChange={(v) =>
                        setMtgInputs((s) => ({ ...s, downPayment: v }))
                      }
                      placeholder={mtgInputs.downPaymentMode === "percent" ? "e.g., 20" : "e.g., 80000"}
                    />
                    <div className="flex gap-3 text-xs text-neutral-700">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="down_mode"
                          checked={mtgInputs.downPaymentMode === "amount"}
                          onChange={() =>
                            setMtgInputs((s) => ({ ...s, downPaymentMode: "amount" }))
                          }
                        />
                        Amount ($)
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="down_mode"
                          checked={mtgInputs.downPaymentMode === "percent"}
                          onChange={() =>
                            setMtgInputs((s) => ({ ...s, downPaymentMode: "percent" }))
                          }
                        />
                        Percent (%)
                      </label>
                    </div>
                  </div>
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
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
                      <Input
                        id="mtg_tax"
                        label="Property Tax"
                        value={mtgInputs.propertyTax}
                        onChange={(v) =>
                          setMtgInputs((s) => ({ ...s, propertyTax: v }))
                        }
                      />
                      <div className="flex flex-col gap-1 text-sm">
                        <label className="text-xs font-semibold text-plum-900 dark:text-plum-100">
                          Frequency
                        </label>
                        <select
                          value={mtgInputs.propertyTaxMode}
                          onChange={(e) =>
                            setMtgInputs((s) => ({
                              ...s,
                              propertyTaxMode: e.target.value as "annual" | "monthly",
                            }))
                          }
                          className="h-[46px] rounded-lg border border-plum-300 bg-white px-3 text-sm text-plum-900 shadow-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-400"
                        >
                          <option value="annual">Annual</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
                      <Input
                        id="mtg_insurance"
                        label="Homeowners Insurance"
                        value={mtgInputs.insurance}
                        onChange={(v) =>
                          setMtgInputs((s) => ({ ...s, insurance: v }))
                        }
                      />
                      <div className="flex flex-col gap-1 text-sm">
                        <label className="text-xs font-semibold text-plum-900 dark:text-plum-100">
                          Frequency
                        </label>
                        <select
                          value={mtgInputs.insuranceMode}
                          onChange={(e) =>
                            setMtgInputs((s) => ({
                              ...s,
                              insuranceMode: e.target.value as "annual" | "monthly",
                            }))
                          }
                          className="h-[46px] rounded-lg border border-plum-300 bg-white px-3 text-sm text-plum-900 shadow-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-400"
                        >
                          <option value="annual">Annual</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
                      <Input
                        id="mtg_pmi"
                        label="PMI"
                        value={mtgInputs.pmi}
                        onChange={(v) =>
                          setMtgInputs((s) => ({ ...s, pmi: v }))
                        }
                      />
                      <div className="flex flex-col gap-1 text-sm">
                        <label className="text-xs font-semibold text-plum-900 dark:text-plum-100">
                          Frequency
                        </label>
                        <select
                          value={mtgInputs.pmiMode}
                          onChange={(e) =>
                            setMtgInputs((s) => ({
                              ...s,
                              pmiMode: e.target.value as "annual" | "monthly",
                            }))
                          }
                          className="h-[46px] rounded-lg border border-plum-300 bg-white px-3 text-sm text-plum-900 shadow-sm focus:border-plum-500 focus:outline-none focus:ring-2 focus:ring-plum-400"
                        >
                          <option value="annual">Annual</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    <Input
                      id="mtg_hoa"
                      label="HOA Fees (monthly)"
                      value={mtgInputs.hoa}
                      onChange={(v) => setMtgInputs((s) => ({ ...s, hoa: v }))}
                    />
                  </div>
                </InputsPanel>
                <ResultsPanel title="Results">
                  <KV label="Principal & Interest (Monthly)" value={fmtUSD(mtg.monthlyPI)} />
                  <KV label="Monthly Add-ons" value={fmtUSD(mtg.monthlyAddOns)} />
                  <KV label="Est. Total Monthly Payment" value={fmtUSD(mtg.totalMonthly)} />
                  <KV label="Total Paid (loan only, P&I)" value={fmtUSD(mtg.total)} />
                </ResultsPanel>
              </div>
              <div className="px-6 pb-6">
                <ExplanationPanel title="How this works">
                  <ul className="ml-5 list-disc">
                    <li>
                      Principal & interest: p = rL / (1 − (1+r)<sup>−n</sup>), where r = annual rate / 12 and n = total months.
                    </li>
                    <li>Property tax, insurance, and PMI can be entered as annual or monthly; annual values are divided by 12.</li>
                    <li>HOA is monthly; total monthly = P&I + tax + insurance + PMI + HOA.</li>
                    <li>Longer terms lower the payment but increase total interest; extra principal reduces total interest.</li>
                  </ul>
                  <p className="mt-2">
                    Learn more:{" "}
                    <Link
                      className="text-brand-600 underline hover:text-brand-700 transition-colors"
                      href="/guide/mortgage-payment-breakdown"
                    >
                      Mortgage Payment Breakdown—Use Our Calculator to See What
                      Impacts Your Monthly Cost
                    </Link>
                  </p>
                </ExplanationPanel>
              </div>
            </ProfessionalCard>
          </section>
        )}

        {/* Tip & Tab Split */}
        {activeCalc === "tip-split" && (
          <section className="card-regal mt-4">
            <Header title="Restaurant Tip & Tab Split Calculator" />
            <div className="flex justify-end px-4 pt-3">
              <ClearButton onClick={resetTipSplit} />
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-2">
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
                  {planId === "free" && (parseInt(tipInputs.people || "1", 10) || 1) > 4 && (
                    <p className="mt-1 text-xs text-plum-800">
                      Groups of 5+ are a <b>Plus</b> feature.{" "}
                      <Link href="/pricing" className="underline">Upgrade to unlock larger groups</Link>.
                    </p>
                  )}
                  {planId === "free" && (parseInt(tipInputs.people || "1", 10) || 1) > 4 && (
                    <p className="mt-1 text-xs text-plum-700">
                      Calculations currently use <b>4 people</b> on Free.
                    </p>
                  )}

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
                    <span className="text-sm font-medium text-plum-900 dark:text-plum-100">
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
              <Gate calc="tip-split-by-order">
                <div className="card-regal p-5">
                  <h3 className="mb-4 text-sm font-semibold text-plum-900 dark:text-plum-100">
                    Split by Order (optional) — includes shared appetizers
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Left: inputs */}
                    <div className="space-y-4">
                      <Input
                        id="order_yours"
                        label="Your order (pre-tax)"
                        value={orderYour}
                        onChange={setOrderYour}
                        placeholder="e.g., 24.50"
                      />

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-sm font-medium text-plum-900 dark:text-plum-100">
                            Others' orders (pre-tax)
                          </label>
                          <button
                            type="button"
                            className="text-sm underline"
                            onClick={() => setOrderOthers((arr) => [...arr, ""])}
                          >
                            + Add another
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {orderOthers.map((val, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="number"
                                inputMode="decimal"
                                min="0"
                                className="w-full rounded-xl border px-3 py-2"
                                placeholder={`Order ${idx + 1}`}
                                value={val}
                                onChange={(e) => {
                                  const next = [...orderOthers];
                                  next[idx] = e.target.value;
                                  setOrderOthers(next);
                                }}
                              />
                              <button
                                type="button"
                                className="px-2 py-1 text-xs rounded-lg border"
                                onClick={() =>
                                  setOrderOthers((arr) => arr.filter((_, i) => i !== idx))
                                }
                                aria-label="Remove"
                                title="Remove"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          id="order_shared"
                          label="Shared items (appetizers, etc. — pre-tax)"
                          value={orderShared}
                          onChange={setOrderShared}
                          placeholder="e.g., 18.00"
                        />
                        <Input
                          id="order_sharers"
                          label={`People sharing these items (default: ${baseSharers})`}
                          value={orderSharers}
                          onChange={setOrderSharers}
                          placeholder={`${baseSharers}`}
                        />
                      </div>
                    </div>

                    {/* Right: results */}
                    <div className="space-y-3">
                      <KV label="Sum of personal orders + shared" value={fmtUSD(totalPre)} />
                      <KV
                        label="Your allocation ratio"
                        value={yourRatio ? `${(yourRatio * 100).toFixed(2)}%` : "0%"}
                      />
                      <div className="rounded-xl border p-4 bg-black/5 dark:bg-white/5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium">You owe (of final bill)</span>
                          <span className="text-2xl font-bold tracking-tight">
                            {fmtUSD(yourOwe)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs opacity-70">
                          Uses your final bill above (after discount, tax & tip). Formula:
                          (Your order + shared share) ÷ (All orders + shared) × Final bill.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Gate>

              {/* Fallback for Free users: blurred preview with CTA overlay */}
              {planId === "free" && (
                <div className="relative mt-4">
                  <div className="pointer-events-none blur-[2px]">
                    <div className="card-regal p-5">
                      <h3 className="mb-4 text-sm font-semibold text-plum-900 dark:text-plum-100">
                        Split by Order (Preview) — includes shared appetizers
                      </h3>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Left: preview inputs */}
                        <div className="space-y-4">
                          <div className="rounded-xl border bg-gray-50 p-3">
                            <div className="text-xs text-gray-500 mb-2">Your order (pre-tax)</div>
                            <div className="text-sm font-medium">$24.50</div>
                          </div>

                          <div className="rounded-xl border bg-gray-50 p-3">
                            <div className="text-xs text-gray-500 mb-2">Others' orders (pre-tax)</div>
                            <div className="text-sm font-medium">$18.75 + $22.00</div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border bg-gray-50 p-3">
                              <div className="text-xs text-gray-500 mb-1">Shared items</div>
                              <div className="text-sm font-medium">$18.00</div>
                            </div>
                            <div className="rounded-xl border bg-gray-50 p-3">
                              <div className="text-xs text-gray-500 mb-1">People sharing</div>
                              <div className="text-sm font-medium">3 people</div>
                            </div>
                          </div>
                        </div>

                        {/* Right: preview results */}
                        <div className="space-y-3">
                          <div className="rounded-xl border bg-gray-50 p-3">
                            <div className="text-xs text-gray-500 mb-1">Sum of orders + shared</div>
                            <div className="text-sm font-medium">$83.25</div>
                          </div>
                          <div className="rounded-xl border bg-gray-50 p-3">
                            <div className="text-xs text-gray-500 mb-1">Your allocation ratio</div>
                            <div className="text-sm font-medium">42.3%</div>
                          </div>
                          <div className="rounded-xl border p-4 bg-black/5 dark:bg-white/5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-sm font-medium">You owe (of final bill)</span>
                              <span className="text-lg font-bold tracking-tight">
                                $41.25
                              </span>
                            </div>
                            <p className="mt-2 text-xs opacity-70">
                              Exact split including tax & tip
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link href="/pricing" className="rounded-lg bg-plum-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-plum-800 transition-colors">
                      Unlock with Plus
                    </Link>
                  </div>
                </div>
              )}
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

        {/* Shopping Budget */}
        {activeCalc === "shopping-budget" && (
          <section className="card-regal mt-4">
            <Header title="Shopping Budget Calculator" />
            <div className="p-0 md:p-0">
              <ShoppingBudget />
            </div>
          </section>
        )}

        {/* Interest (Simple/Compound) - ENHANCED VERSION */}
        {activeCalc === "interest" && (
          <section className="card-regal mt-4">
            <Header title="Interest Calculator (Simple / Compound)" />
            <div className="flex justify-end px-6 pt-3">
              <ClearButton onClick={resetInterest} />
            </div>
            <div className="p-6">
              {/* Mode toggle */}
              <div className="mb-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setInterestMode("compound")}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${interestMode === "compound"
                    ? "bg-plum-600 text-white shadow-md"
                    : "border border-plum-300 bg-white hover:bg-plum-50 text-plum-700"
                    }`}
                >
                  Compound Interest
                </button>
                <button
                  type="button"
                  onClick={() => setInterestMode("simple")}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${interestMode === "simple"
                    ? "bg-plum-600 text-white shadow-md"
                    : "border border-plum-300 bg-white hover:bg-plum-50 text-plum-700"
                    }`}
                >
                  Simple Interest
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InputsPanel title="Inputs">
                  <Input
                    id="int_principal"
                    label="Initial Principal ($)"
                    value={intInputs.principal}
                    onChange={(v) => setIntInputs((s) => ({ ...s, principal: v }))}
                    type="number"
                  />
                  <Input
                    id="int_rate"
                    label="Annual Interest Rate (%)"
                    value={intInputs.annualRatePct}
                    onChange={(v) => setIntInputs((s) => ({ ...s, annualRatePct: v }))}
                    type="number"
                  />
                  <Input
                    id="int_years"
                    label="Time Period (Years)"
                    value={intInputs.years}
                    onChange={(v) => setIntInputs((s) => ({ ...s, years: v }))}
                    type="number"
                  />
                  <Input
                    id="int_monthly"
                    label="Monthly Contribution ($)"
                    value={intInputs.monthlyContribution}
                    onChange={(v) =>
                      setIntInputs((s) => ({ ...s, monthlyContribution: v }))
                    }
                    type="number"
                    placeholder="Optional"
                  />

                  {interestMode === "compound" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-plum-900 dark:text-plum-100">
                        Compounding Frequency
                      </label>
                      <select
                        value={intInputs.frequency}
                        onChange={(e) =>
                          setIntInputs((s) => ({ ...s, frequency: e.target.value as CompoundValue }))
                        }
                        className="h-11 w-full rounded-lg border border-plum-300 bg-white/80 px-3 text-plum-900 shadow-sm
                                   focus:border-aure-400 focus:outline-none focus:ring-2 focus:ring-aure-400/40"
                      >
                        {COMPOUND_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </InputsPanel>

                <ResultsPanel title="Results">
                  <div className="space-y-4">
                    <div className="rounded-xl bg-gradient-to-br from-aure-100/50 to-plum-100/30 p-4 ring-1 ring-aure-300/30">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-plum-900 dark:text-plum-100">
                        Final Amount
                      </p>
                      <p className="text-3xl font-bold text-plum-900 dark:text-plum-100">
                        {fmtUSD(interest.amount)}
                      </p>
                    </div>

                    <KV label="Total Interest Earned" value={fmtUSD(interest.interest)} />
                    <KV label="Total Contributed" value={fmtUSD(interest.contributed)} />

                    <div className="rounded-lg bg-plum-50/50 p-3 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-plum-900 dark:text-plum-100">Principal:</span>
                        <span className="font-medium">{fmtUSD(parseFloat(intInputs.principal) || 0)}</span>
                      </div>
                      {parseFloat(intInputs.monthlyContribution) > 0 && (
                        <div className="flex justify-between mb-1">
                          <span className="text-plum-900 dark:text-plum-100">Monthly Deposits:</span>
                          <span className="font-medium">
                            {fmtUSD(parseFloat(intInputs.monthlyContribution) * parseFloat(intInputs.years) * 12)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-plum-900 dark:text-plum-100">Interest:</span>
                        <span className="font-semibold text-aure-600 dark:text-aure-400">{fmtUSD(interest.interest)}</span>
                      </div>
                    </div>
                  </div>
                </ResultsPanel>
              </div>
            </div>

            {/* Year-by-year breakdown */}
            <div className="px-6 pb-6">
              <ExplanationPanel title="Year-by-Year Breakdown">
                <p className="mb-3 text-sm">
                  {interestMode === "compound" ? (
                    <>
                      In <b>Compound Interest</b> mode, interest is calculated on both the principal and
                      accumulated interest at the selected frequency. Monthly contributions are added at the
                      end of each month and begin earning interest immediately.
                    </>
                  ) : (
                    <>
                      In <b>Simple Interest</b> mode, interest is calculated only on the principal amount
                      (initial deposit plus contributions). Interest does not compound—it stays separate
                      and doesn't earn additional interest.
                    </>
                  )}
                </p>
                <YearBreakdownTable rows={interest.breakdown} />
              </ExplanationPanel>

              <div className="mt-4">
                <ExplanationPanel title="How this works">
                  <ul className="ml-5 list-disc space-y-2">
                    {interestMode === "compound" ? (
                      <>
                        <li>
                          <b>Compound Interest Formula:</b> The selected frequency is converted to a
                          monthly rate: r<sub>monthly</sub> = (1 + r/n)<sup>n/12</sup> − 1, where n is
                          the compounding frequency per year.
                        </li>
                        <li>
                          Each month: balance = balance × (1 + r<sub>monthly</sub>) + monthly contribution
                        </li>
                        <li>
                          This means your interest earns interest, leading to exponential growth over time.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <b>Simple Interest Formula:</b> Interest = Principal × Rate × Time
                        </li>
                        <li>
                          Monthly interest = (principal to date) × (annual rate / 12)
                        </li>
                        <li>
                          Interest accumulates separately and doesn't compound, resulting in linear growth.
                        </li>
                      </>
                    )}
                    <li>
                      "Total Contributed" includes your initial principal plus all monthly deposits over
                      the time period.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Learn more:{" "}
                    <Link className="link-regal" href="/guide/simple-vs-compound-interest">
                      Simple vs Compound Interest—Which One Grows Your Money Faster?
                    </Link>
                  </p>
                </ExplanationPanel>
              </div>
            </div>
          </section>
        )}

        {/* Freelancer Rate */}
        {activeCalc === "freelancer-rate" && (
          <section className="mt-4">
            <ProfessionalCard>
              <Header title="Freelancer Rate Calculator" />
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetFreelancer} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
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
                      className="text-brand-600 underline hover:text-brand-700 transition-colors"
                      href="/guide/set-your-freelancer-rate-right"
                    >
                      Set Your Freelancer Rate Right—Use Our Calculator to Avoid
                      Undervaluing Your Time
                    </Link>
                  </p>
                </ExplanationPanel>
              </div>
            </ProfessionalCard>
          </section>
        )}

        {/* ===== Paid calculators (Plus & Pro/Premium) via unified <Gate /> ===== */}

        {/* Savings (Plus) */}
        {!freeOnly && activeCalc === "savings" && (
          <section className="card-regal relative mt-4">
            <Header title="Savings Growth Calculator" />
            {/* Gate will allow for plus/pro/premium; show upgrade card otherwise */}
            <Gate calc="savings">
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetSavings} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
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
                  <Input
                    id="sav_target"
                    label="Target Amount ($)"
                    value={savingsTarget}
                    onChange={setSavingsTarget}
                    placeholder="Optional"
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
                  {toNum(savingsTarget) > 0 && (
                    <KV label="Required Monthly (to reach target)" value={fmtUSD(Math.max(savings.requiredMonthly, 0))} />
                  )}
                </ResultsPanel>
              </div>

              <div className="px-6 pb-6">
                <ExplanationPanel title="Year-by-Year Breakdown (Savings)">
                  <YearBreakdownTable rows={savings.breakdown as any} />
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-plum-300 px-3 py-2 text-sm hover:bg-plum-50"
                      onClick={() => {
                        const rows = (savings.breakdown || []).map((r: any) => ({
                          Year: r.year,
                          Starting_Balance: r.start.toFixed(2),
                          Contributions: r.contributions.toFixed(2),
                          Interest: r.interest.toFixed(2),
                          Ending_Balance: r.end.toFixed(2),
                        }));
                        downloadCSV(rows, "savings_schedule.csv");
                      }}
                    >
                      Download CSV
                    </button>
                  </div>
                </ExplanationPanel>
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
          <section className="card-regal relative mt-4">
            <Header title="Debt Payoff Calculator" />
            <Gate calc="debt-payoff">
              <div className="flex justify-end px-4 pt-3">
                <ClearButton onClick={resetDebt} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="debt_targetMonths"
                      label="Target Months (optional)"
                      value={debtTargetMonths}
                      onChange={setDebtTargetMonths}
                      placeholder="e.g., 36"
                    />
                    <Input
                      id="debt_extra"
                      label="Extra Monthly ($)"
                      value={debtExtra}
                      onChange={setDebtExtra}
                      placeholder="0"
                    />
                  </div>
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
                  {nTarget > 0 && (
                    <KV label="Required Monthly (for target)" value={fmtUSD(requiredForTarget)} />
                  )}
                  {payoffDate && (
                    <KV label="Estimated Payoff Date" value={payoffDate.toLocaleDateString()} />
                  )}
                  {isFinite(payoffWithExtra.months) && (
                    <>
                      <KV label="With Extra: Months to Payoff" value={payoffWithExtra.months} />
                      <KV label="With Extra: Total Paid" value={fmtUSD(payoffWithExtra.totalPaid)} />
                      <KV label="With Extra: Total Interest" value={fmtUSD(payoffWithExtra.interest)} />
                      <KV label="Months Saved" value={monthsSaved} />
                      <KV label="Interest Saved" value={fmtUSD(interestSaved)} />
                    </>
                  )}
                </ResultsPanel>
              </div>

              <div className="px-6 pb-6">
                <ExplanationPanel title="Export Summary (Debt)">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-lg border border-plum-300 px-3 py-2 text-sm hover:bg-plum-50"
                    onClick={() => {
                      const rows = [{
                        Mode: "Baseline",
                        Months: isFinite(payoff.months) ? payoff.months : "∞",
                        Total_Paid: isFinite(payoff.totalPaid) ? payoff.totalPaid.toFixed(2) : "∞",
                        Total_Interest: isFinite(payoff.interest) ? payoff.interest.toFixed(2) : "∞",
                      }, {
                        Mode: "With Extra",
                        Months: isFinite(payoffWithExtra.months) ? payoffWithExtra.months : "∞",
                        Total_Paid: isFinite(payoffWithExtra.totalPaid) ? payoffWithExtra.totalPaid.toFixed(2) : "∞",
                        Total_Interest: isFinite(payoffWithExtra.interest) ? payoffWithExtra.interest.toFixed(2) : "∞",
                      }, {
                        Mode: "Savings",
                        Months_Saved: monthsSaved,
                        Interest_Saved: interestSaved.toFixed(2),
                      }];
                      downloadCSV(rows as any, "debt_summary.csv");
                    }}
                  >
                    Download CSV
                  </button>
                </ExplanationPanel>
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
          <section className="card-regal relative mt-4">
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
          <section className="card-regal relative mt-4">
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
