"use client";

import React, { useState } from "react";
import { AlertCircle, DollarSign, Lightbulb, TrendingUp } from "lucide-react";

import PremiumResultCard from "./ui/PremiumResultCard";
import ProfessionalCard from "./ui/ProfessionalCard";
import ProfessionalInput from "./ui/ProfessionalInput";

const defaults = {
  desiredIncome: 120000,
  weeksOff: 4,
  hoursPerWeek: 30,
  overhead: 20,
  taxRate: 30,
  billablePercent: 65,
};

const fmtCurrency = (num: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(isFinite(num) ? num : 0);

const FreelancerRateCalculator: React.FC = () => {
  const [desiredIncome, setDesiredIncome] = useState(defaults.desiredIncome);
  const [weeksOff, setWeeksOff] = useState(defaults.weeksOff);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek);
  const [overhead, setOverhead] = useState(defaults.overhead);
  const [taxRate, setTaxRate] = useState(defaults.taxRate);
  const [billablePercent, setBillablePercent] = useState(defaults.billablePercent);

  const weeksWorked = Math.max(0, 52 - weeksOff);
  const totalWeeklyHours = Math.max(0, hoursPerWeek);
  const billableHours = (totalWeeklyHours * billablePercent) / 100;
  const annualBillableHours = Math.max(billableHours * weeksWorked, 1);

  const targetGross =
    desiredIncome > 0 && taxRate < 100 ? desiredIncome / (1 - taxRate / 100) : 0;
  const targetGrossWithOverhead = targetGross * (1 + overhead / 100);

  const hourlyRate = targetGrossWithOverhead / annualBillableHours;
  const dayRate = hourlyRate * 8;
  const weeklyRate = hourlyRate * billableHours;
  const monthlyRate = (hourlyRate * annualBillableHours) / 12;
  const afterTaxTakeHome = desiredIncome;
  const equivalentW2 = desiredIncome * 1.3;

  const reset = () => {
    setDesiredIncome(defaults.desiredIncome);
    setWeeksOff(defaults.weeksOff);
    setHoursPerWeek(defaults.hoursPerWeek);
    setOverhead(defaults.overhead);
    setTaxRate(defaults.taxRate);
    setBillablePercent(defaults.billablePercent);
  };

  const warnings: string[] = [];
  const tips: string[] = [];

  if (hourlyRate > 0 && hourlyRate < 50) {
    warnings.push("You may be undercharging compared to similar freelancers in many fields.");
  }

  if (overhead < 15) {
    tips.push(
      "Your overhead looks unusually low - be sure you've included software, insurance, equipment, and marketing costs.",
    );
  }

  if (billableHours > 35) {
    warnings.push("Consistently working more than 35 billable hours per week can be hard to sustain long-term.");
  }

  if (taxRate < 25) {
    tips.push(
      "Most freelancers pay 25-40% in combined taxes. Make sure you've included federal, state, and self-employment tax.",
    );
  }

  return (
    <div className="fwv-container page space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">Pricing suite</p>
          <h1 className="text-3xl font-semibold tracking-tight text-purple-title md:text-4xl">
            Freelancer Rate Calculator
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            Match your rate to the lifestyle you want by accounting for taxes, overhead, and realistic billable hours.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-plum-300 bg-white px-3 py-2 text-sm font-medium text-plum-700 shadow-sm transition hover:bg-plum-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          Clear &amp; start over
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <ProfessionalCard className="space-y-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-plum-700" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-600">Inputs</p>
              <h2 className="text-lg font-semibold text-purple-title">Plan your workload and costs</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfessionalInput
              label="Desired annual take-home ($)"
              type="number"
              min={0}
              step={1000}
              value={desiredIncome}
              onChange={(e) => setDesiredIncome(Number(e.target.value) || 0)}
              helperText="What you want to keep after taxes and expenses."
            />
            <ProfessionalInput
              label="Weeks off per year"
              type="number"
              min={0}
              max={52}
              value={weeksOff}
              onChange={(e) => setWeeksOff(Number(e.target.value) || 0)}
              helperText="Vacation, holidays, sick days, downtime."
            />
            <ProfessionalInput
              label="Working hours per week"
              type="number"
              min={0}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)}
              helperText="Total hours worked, not just billable."
            />
            <ProfessionalInput
              label="Tax rate (%)"
              type="number"
              min={0}
              max={60}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
              helperText="Include federal, state, and self-employment tax."
            />
            <ProfessionalInput
              label="Overhead (%)"
              type="number"
              min={0}
              value={overhead}
              onChange={(e) => setOverhead(Number(e.target.value) || 0)}
              helperText="Software, insurance, equipment, marketing, office."
            />
          </div>

          <div className="rounded-xl border border-plum-200/80 bg-white/70 px-4 py-3">
            <div className="flex items-center justify-between text-sm text-plum-800">
              <span className="font-semibold">Billable time</span>
              <span className="font-semibold">{billablePercent}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={90}
              value={billablePercent}
              onChange={(e) => setBillablePercent(Number(e.target.value) || 0)}
              className="mt-3 w-full accent-plum-600"
            />
            <p className="mt-2 text-xs text-plum-600">
              Admin, marketing, and email usually consume 30-40% of the week.
            </p>
            <p className="mt-1 text-xs font-semibold text-plum-800">
              Billable: {billableHours.toFixed(1)} hrs/week | Non-billable:{" "}
              {(totalWeeklyHours - billableHours).toFixed(1)} hrs/week
            </p>
          </div>
        </ProfessionalCard>

        <div className="space-y-5">
          <ProfessionalCard className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-plum-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-600">Results</p>
                <h3 className="text-lg font-semibold text-purple-title">Your rate card</h3>
              </div>
            </div>
            <PremiumResultCard title="Required hourly rate" value={fmtCurrency(hourlyRate)} variant="highlight" />
            <div className="grid gap-3 sm:grid-cols-2">
              <PremiumResultCard title="Day rate (8 hrs)" value={fmtCurrency(dayRate)} />
              <PremiumResultCard title="Weekly revenue (billable)" value={fmtCurrency(weeklyRate)} />
              <PremiumResultCard title="Monthly retainer target" value={fmtCurrency(monthlyRate)} />
              <PremiumResultCard title="Annual revenue needed" value={fmtCurrency(targetGrossWithOverhead)} />
            </div>
          </ProfessionalCard>

          <ProfessionalCard className="space-y-3">
            <div className="flex items-center gap-2 text-plum-900">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold">Financial breakdown</h4>
            </div>
            <div className="space-y-2 text-sm text-plum-800">
              <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-white/80 px-3 py-2">
                <span>Annual revenue needed</span>
                <span className="font-semibold">{fmtCurrency(targetGrossWithOverhead)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-white/80 px-3 py-2">
                <span>After-tax take-home</span>
                <span className="font-semibold text-emerald-700">{fmtCurrency(afterTaxTakeHome)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-white/80 px-3 py-2">
                <span>Taxes (approx.)</span>
                <span className="font-semibold text-rose-700">-{fmtCurrency(targetGross - afterTaxTakeHome)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-white/80 px-3 py-2">
                <span>Business overhead</span>
                <span className="font-semibold text-amber-700">-{fmtCurrency(targetGrossWithOverhead - targetGross)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-white/80 px-3 py-2">
                <span className="text-xs font-semibold text-plum-800">Equivalent W-2 salary (with benefits)</span>
                <span className="text-sm font-semibold text-plum-900">{fmtCurrency(equivalentW2)}</span>
              </div>
              <p className="text-[11px] text-plum-600">
                Rough comparison assuming roughly 30% value in health insurance, paid leave, and employer taxes.
              </p>
            </div>
          </ProfessionalCard>

          {(warnings.length > 0 || tips.length > 0) && (
            <ProfessionalCard className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-purple-title">Quality checks</h4>
              </div>
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div
                    key={`w-${i}`}
                    className="flex gap-2 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    <span>{w}</span>
                  </div>
                ))}

                {tips.map((t, i) => (
                  <div
                    key={`t-${i}`}
                    className="flex gap-2 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-3 py-2 text-xs text-sky-900"
                  >
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-600" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </ProfessionalCard>
          )}
        </div>
      </div>

      <ProfessionalCard className="space-y-2">
        <h3 className="text-base font-semibold text-purple-title">How this calculator works</h3>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-plum-700">
          <li>We gross up your target take-home by your tax rate to find the revenue you need before taxes.</li>
          <li>Overhead adds the buffer for software, insurance, equipment, and marketing.</li>
          <li>The billable-time slider backs out admin and marketing time so hours reflect reality.</li>
          <li>Rates are calculated as revenue needed divided by annual billable hours.</li>
          <li>Packages (day, week, month) stay aligned with your true hourly rate.</li>
        </ul>
      </ProfessionalCard>
    </div>
  );
};

export default FreelancerRateCalculator;
