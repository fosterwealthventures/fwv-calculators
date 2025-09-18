"use client";

import React, { useMemo, useState } from "react";
import { TrendingUp, DollarSign, Users, PiggyBank, Home, BarChart3, Lock } from "lucide-react";
import AdSlot from "./AdSlot";

type Tier = "free" | "pro";

const calcMeta = {
  calculators: {
    roi: { name: "ROI Calculator", icon: TrendingUp, tier: "free" as Tier },
    "break-even": { name: "Break-Even", icon: BarChart3, tier: "free" as Tier },
    mortgage: { name: "Mortgage", icon: Home, tier: "free" as Tier },
    "employee-cost": { name: "Employee Cost", icon: Users, tier: "pro" as Tier },
    savings: { name: "Savings Growth", icon: PiggyBank, tier: "pro" as Tier },
    "debt-payoff": { name: "Debt Payoff", icon: DollarSign, tier: "pro" as Tier },
  },
};

export default function FosterWealthCalculators() {
  const [isPro] = useState(false); // fake auth toggle
  const [activeCalc, setActiveCalc] = useState<keyof typeof calcMeta.calculators>("roi");

  // ROI state + calc
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

  // Break-even state + calc
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

  // Mortgage state + calc
  const [mtgInputs, setMtgInputs] = useState({
    loanAmount: "400000",
    interestRate: "6.5",
    loanTerm: "30",
    downPayment: "80000",
  });
  const mtg = useMemo(() => {
    const loan = Math.max(
      (parseFloat(mtgInputs.loanAmount) || 0) - (parseFloat(mtgInputs.downPayment) || 0),
      0
    );
    const annualRate = (parseFloat(mtgInputs.interestRate) || 0) / 100;
    const nYears = parseFloat(mtgInputs.loanTerm) || 30;
    const r = annualRate / 12;
    const n = nYears * 12;
    if (r <= 0) return { monthly: loan / n, total: loan };
    const monthly = (loan * r) / (1 - Math.pow(1 + r, -n));
    return { monthly, total: monthly * n };
  }, [mtgInputs]);

  // Employee Cost state + calc
  const [empInputs, setEmpInputs] = useState({
    baseSalary: "65000",
    healthInsurance: "12000",
    retirement401k: "3250",
  });
  const employeeCostYear = useMemo(() => {
    const salary = parseFloat(empInputs.baseSalary) || 0;
    const ins = parseFloat(empInputs.healthInsurance) || 0;
    const k = parseFloat(empInputs.retirement401k) || 0;
    return salary + ins + k;
  }, [empInputs]);

  // Savings Growth state + calc
  const [savInputs, setSavInputs] = useState({
    currentSavings: "10000",
    monthlyContribution: "500",
    annualReturn: "7",
    timeHorizon: "20",
  });
  const savingsFV = useMemo(() => {
    const P = parseFloat(savInputs.currentSavings) || 0;
    const c = parseFloat(savInputs.monthlyContribution) || 0;
    const r = (parseFloat(savInputs.annualReturn) || 0) / 100 / 12;
    const n = (parseFloat(savInputs.timeHorizon) || 0) * 12;
    const future =
      r === 0 ? P + c * n : P * Math.pow(1 + r, n) + c * ((Math.pow(1 + r, n) - 1) / r);
    return isFinite(future) ? future : 0;
  }, [savInputs]);

  // Debt Payoff state + calc
  const [debtInputs, setDebtInputs] = useState({
    totalDebt: "25000",
    interestRate: "18.5",
    monthlyPayment: "500",
    extraPayment: "100",
  });
  const debtMonths = useMemo(() => {
    const D = parseFloat(debtInputs.totalDebt) || 0;
    const r = (parseFloat(debtInputs.interestRate) || 0) / 100 / 12;
    const p =
      (parseFloat(debtInputs.monthlyPayment) || 0) + (parseFloat(debtInputs.extraPayment) || 0);
    if (r <= 0) return Math.ceil(D / Math.max(p, 1));
    if (p <= D * r) return Infinity;
    return Math.ceil(Math.log(p / (p - D * r)) / Math.log(1 + r));
  }, [debtInputs]);

  // ----------------- UI helpers -----------------
  const fmtPct = (x: number) => `${(x * 100).toFixed(2)}%`;
  const fmtUSD = (x: number) =>
    x === Infinity
      ? "∞"
      : x.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        });

  const Gate: React.FC<{ tier: Tier; children: React.ReactNode }> = ({ tier, children }) => {
    if (tier === "free" || isPro) return <>{children}</>;
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-gray-800">
          <Lock size={18} /> <strong>Pro Feature</strong>
        </div>
        <p className="m-0 text-gray-600">Unlock this calculator with a Pro plan.</p>
      </div>
    );
  };

  const ChipButton: React.FC<{
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      aria-pressed={!!active}
      className={[
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
        active
          ? "border-brand-gold bg-brand-gold/15 text-brand-green hover:bg-brand-gold/25"
          : "border-gray-300 bg-white text-gray-700 hover:border-brand-gold/50",
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
  }> = ({ id, label, value, onChange, type = "number", placeholder }) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 shadow-sm
                   focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Calculator selector */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex flex-wrap gap-3">
          {Object.entries(calcMeta.calculators).map(([key, meta]) => {
            const Icon = meta.icon || BarChart3;
            const active = key === activeCalc;
            return (
              <ChipButton key={key} active={active} onClick={() => setActiveCalc(key as any)}>
                <Icon size={16} />
                {meta.name}
                {meta.tier === "pro" && (
                  <span className="ml-1 rounded-md border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-[11px]">
                    Pro
                  </span>
                )}
              </ChipButton>
            );
          })}
        </div>

        {/* Top banner Ad */}
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-gray-500">
          <AdSlot
            slot="TOP_BANNER_SLOT_ID"
            style={{ minHeight: 90 }}
            placeholder={<div>Ad Placeholder (Top Banner)</div>}
          />
        </div>
      </div>

      {/* Main calculator body */}
      <main className="mx-auto mt-8 max-w-6xl px-4 pb-16 space-y-12 flex-grow">
        {/* ROI Calculator */}
        {activeCalc === "roi" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">ROI Calculator</h2>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                <div className="space-y-4">
                  <Input
                    id="roi_initial"
                    label="Initial Investment"
                    value={roiInputs.initialInvestment}
                    onChange={(v) => setRoiInputs((s) => ({ ...s, initialInvestment: v }))}
                  />
                  <Input
                    id="roi_final"
                    label="Final Value"
                    value={roiInputs.finalValue}
                    onChange={(v) => setRoiInputs((s) => ({ ...s, finalValue: v }))}
                  />
                  <Input
                    id="roi_time"
                    label="Time Horizon (years)"
                    value={roiInputs.timeHorizon}
                    onChange={(v) => setRoiInputs((s) => ({ ...s, timeHorizon: v }))}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                    <span>Total ROI</span>
                    <span className="font-semibold">{fmtPct(roi.total)}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                    <span>Annualized ROI</span>
                    <span className="font-semibold">{fmtPct(roi.annual)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Break-Even Calculator */}
        {activeCalc === "break-even" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">Break-Even Calculator</h2>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                <div className="space-y-4">
                  <Input
                    id="be_fixed"
                    label="Fixed Costs"
                    value={beInputs.fixedCosts}
                    onChange={(v) => setBeInputs((s) => ({ ...s, fixedCosts: v }))}
                  />
                  <Input
                    id="be_var"
                    label="Variable Cost per Unit"
                    value={beInputs.variableCostPerUnit}
                    onChange={(v) => setBeInputs((s) => ({ ...s, variableCostPerUnit: v }))}
                  />
                  <Input
                    id="be_price"
                    label="Price per Unit"
                    value={beInputs.pricePerUnit}
                    onChange={(v) => setBeInputs((s) => ({ ...s, pricePerUnit: v }))}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                  <span>Break-Even Units</span>
                  <span className="font-semibold">
                    {breakEvenUnits === Infinity ? "No break-even" : breakEvenUnits}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mortgage Calculator */}
        {activeCalc === "mortgage" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">Mortgage Calculator</h2>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                <div className="space-y-4">
                  <Input
                    id="mtg_loan"
                    label="Home Price / Loan Amount"
                    value={mtgInputs.loanAmount}
                    onChange={(v) => setMtgInputs((s) => ({ ...s, loanAmount: v }))}
                  />
                  <Input
                    id="mtg_down"
                    label="Down Payment"
                    value={mtgInputs.downPayment}
                    onChange={(v) => setMtgInputs((s) => ({ ...s, downPayment: v }))}
                  />
                  <Input
                    id="mtg_rate"
                    label="Interest Rate (%)"
                    value={mtgInputs.interestRate}
                    onChange={(v) => setMtgInputs((s) => ({ ...s, interestRate: v }))}
                  />
                  <Input
                    id="mtg_term"
                    label="Loan Term (years)"
                    value={mtgInputs.loanTerm}
                    onChange={(v) => setMtgInputs((s) => ({ ...s, loanTerm: v }))}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                    <span>Monthly Payment</span>
                    <span className="font-semibold">{fmtUSD(mtg.monthly)}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                    <span>Total Paid</span>
                    <span className="font-semibold">{fmtUSD(mtg.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Employee Cost (Pro) */}
        {activeCalc === "employee-cost" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">Employee Cost Calculator</h2>
            </div>
            <div className="p-6">
              <Gate tier="pro">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                    <div className="space-y-4">
                      <Input
                        id="emp_base"
                        label="Base Salary"
                        value={empInputs.baseSalary}
                        onChange={(v) => setEmpInputs((s) => ({ ...s, baseSalary: v }))}
                      />
                      <Input
                        id="emp_health"
                        label="Health Insurance"
                        value={empInputs.healthInsurance}
                        onChange={(v) => setEmpInputs((s) => ({ ...s, healthInsurance: v }))}
                      />
                      <Input
                        id="emp_retire"
                        label="401k Match"
                        value={empInputs.retirement401k}
                        onChange={(v) => setEmpInputs((s) => ({ ...s, retirement401k: v }))}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                    <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                      <span>Annual Employee Cost</span>
                      <span className="font-semibold">{fmtUSD(employeeCostYear)}</span>
                    </div>
                  </div>
                </div>
              </Gate>
            </div>
          </section>
        )}

        {/* Savings Growth (Pro) */}
        {activeCalc === "savings" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">Savings Growth Calculator</h2>
            </div>
            <div className="p-6">
              <Gate tier="pro">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                    <div className="space-y-4">
                      <Input
                        id="sav_current"
                        label="Current Savings"
                        value={savInputs.currentSavings}
                        onChange={(v) => setSavInputs((s) => ({ ...s, currentSavings: v }))}
                      />
                      <Input
                        id="sav_monthly"
                        label="Monthly Contribution"
                        value={savInputs.monthlyContribution}
                        onChange={(v) => setSavInputs((s) => ({ ...s, monthlyContribution: v }))}
                      />
                      <Input
                        id="sav_return"
                        label="Annual Return (%)"
                        value={savInputs.annualReturn}
                        onChange={(v) => setSavInputs((s) => ({ ...s, annualReturn: v }))}
                      />
                      <Input
                        id="sav_years"
                        label="Time Horizon (years)"
                        value={savInputs.timeHorizon}
                        onChange={(v) => setSavInputs((s) => ({ ...s, timeHorizon: v }))}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                    <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                      <span>Future Value</span>
                      <span className="font-semibold">{fmtUSD(savingsFV)}</span>
                    </div>
                  </div>
                </div>
              </Gate>
            </div>
          </section>
        )}

        {/* Debt Payoff (Pro) */}
        {activeCalc === "debt-payoff" && (
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-soft">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-brand-green">Debt Payoff Calculator</h2>
            </div>
            <div className="p-6">
              <Gate tier="pro">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Inputs</h3>
                    <div className="space-y-4">
                      <Input
                        id="debt_total"
                        label="Total Debt"
                        value={debtInputs.totalDebt}
                        onChange={(v) => setDebtInputs((s) => ({ ...s, totalDebt: v }))}
                      />
                      <Input
                        id="debt_rate"
                        label="Interest Rate (%)"
                        value={debtInputs.interestRate}
                        onChange={(v) => setDebtInputs((s) => ({ ...s, interestRate: v }))}
                      />
                      <Input
                        id="debt_payment"
                        label="Monthly Payment"
                        value={debtInputs.monthlyPayment}
                        onChange={(v) => setDebtInputs((s) => ({ ...s, monthlyPayment: v }))}
                      />
                      <Input
                        id="debt_extra"
                        label="Extra Payment"
                        value={debtInputs.extraPayment}
                        onChange={(v) => setDebtInputs((s) => ({ ...s, extraPayment: v }))}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-5">
                    <h3 className="mb-4 text-sm font-semibold text-brand-green">Results</h3>
                    <div className="flex justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
                      <span>Months to Payoff</span>
                      <span className="font-semibold">
                        {debtMonths === Infinity ? "Increase Payment" : `${debtMonths} months`}
                      </span>
                    </div>
                  </div>
                </div>
              </Gate>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
