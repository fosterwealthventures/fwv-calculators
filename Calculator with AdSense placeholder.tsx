import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  PiggyBank,
  Home,
  CreditCard,
  BarChart3,
  Lock,
} from "lucide-react";

const FosterWealthCalculators = () => {
  // =========================
  // MEMBERSHIP & ADS TOGGLES
  // =========================
  // TODO: replace with your real auth/subscription state
  const isPro = false; // set true after wiring auth/subscription
  const showAds = !isPro; // Pro users: no ads

  // =========================
  // SUITES & DEFAULTS (GATES)
  // =========================
  const FREE_CALCS = new Set(["roi", "break-even", "mortgage"]);
  const PRO_CALCS = new Set(["employee-cost", "savings", "debt-payoff"]);

  const [activeSuite, setActiveSuite] = useState<"business" | "financial">("business");
  const [activeCalculator, setActiveCalculator] = useState("roi"); // default to a free calc

  // =========================
  // INPUT STATE
  // =========================
  // Employee Cost (added annualOvertime)
  const [employeeInputs, setEmployeeInputs] = useState({
    payType: "salary",
    baseSalary: "65000",
    hourlyRate: "25",
    hoursPerWeek: "40",
    annualOvertime: "0", // NEW
    healthInsurance: "12000",
    retirement401k: "3250",
  });

  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: "10000",
    finalValue: "15000",
    timeHorizon: "2",
  });

  const [breakEvenInputs, setBreakEvenInputs] = useState({
    fixedCosts: "5000",
    variableCostPerUnit: "15",
    pricePerUnit: "25",
  });

  const [mortgageInputs, setMortgageInputs] = useState({
    loanAmount: "400000",
    interestRate: "6.5",
    loanTerm: "30",
    downPayment: "80000",
  });

  const [savingsInputs, setSavingsInputs] = useState({
    currentSavings: "10000",
    monthlyContribution: "500",
    annualReturn: "7",
    timeHorizon: "20",
  });

  const [debtInputs, setDebtInputs] = useState({
    totalDebt: "25000",
    interestRate: "18.5",
    monthlyPayment: "500",
    extraPayment: "100",
  });

  // =========================
  // HELPERS
  // =========================
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercent = (value: number) => (value || 0).toFixed(2) + "%";

  // Reusable labeled field with optional prefix/suffix and label color
  const Field = ({
    id,
    label,
    value,
    onChange,
    type = "number",
    step,
    hint,
    prefix,
    suffix,
    labelColor = "text-blue-700",
    className = "",
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    step?: string;
    hint?: string;
    prefix?: string;
    suffix?: string;
    labelColor?: string; // e.g. "text-blue-700" or "text-green-700"
    className?: string;
  }) => {
    const hasPrefix = Boolean(prefix);
    const hasSuffix = Boolean(suffix);
    return (
      <div className={`space-y-1 ${className}`}>
        <label htmlFor={id} className={`block text-sm font-semibold ${labelColor}`}>
          {label}
        </label>
        <div className="relative">
          {hasPrefix && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type={type}
            inputMode={type === "number" ? "decimal" : undefined}
            step={step}
            value={value}
            onChange={onChange}
            className={`w-full p-3 border rounded-lg ${hasPrefix ? "pl-9" : ""} ${hasSuffix ? "pr-9" : ""}`}
          />
          {hasSuffix && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              {suffix}
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  };

  // =========================
  // CORE CALCULATIONS
  // =========================
  const calculateEmployeeCost = () => {
    let annualWages = 0;
    if (employeeInputs.payType === "salary") {
      annualWages = parseFloat(employeeInputs.baseSalary) || 0;
    } else {
      const hourlyRate = parseFloat(employeeInputs.hourlyRate) || 0;
      const hoursPerWeek = parseFloat(employeeInputs.hoursPerWeek) || 40;
      annualWages = hourlyRate * hoursPerWeek * 52;
    }

    // include overtime
    const overtime = parseFloat(employeeInputs.annualOvertime) || 0;
    annualWages += overtime;

    const healthInsurance = parseFloat(employeeInputs.healthInsurance) || 0;
    const retirement401k = parseFloat(employeeInputs.retirement401k) || 0;
    const socialSecurity = annualWages * 0.062;
    const medicare = annualWages * 0.0145;
    const unemployment = annualWages * 0.006;
    const workersComp = annualWages * 0.01;

    const benefitsCost = healthInsurance + retirement401k;
    const taxesCost = socialSecurity + medicare + unemployment + workersComp;
    const totalCost = annualWages + benefitsCost + taxesCost;
    const hourlyRate = totalCost / 2080;

    return { totalCost, hourlyRate, benefitsCost, taxesCost, annualWages };
  };

  const calculateROI = () => {
    const initial = parseFloat(roiInputs.initialInvestment) || 0;
    const final = parseFloat(roiInputs.finalValue) || 0;
    const time = parseFloat(roiInputs.timeHorizon) || 1;

    const profit = final - initial;
    const roiPercent = initial > 0 ? (profit / initial) * 100 : 0;
    const annualizedROI = time > 0 ? Math.pow(final / initial, 1 / time) - 1 : 0;

    return { profit, roiPercent, annualizedROI: annualizedROI * 100 };
  };

  const calculateBreakEven = () => {
    const fixed = parseFloat(breakEvenInputs.fixedCosts) || 0;
    const variableCost = parseFloat(breakEvenInputs.variableCostPerUnit) || 0;
    const price = parseFloat(breakEvenInputs.pricePerUnit) || 0;

    const contributionMargin = price - variableCost;
    const breakEvenUnits = contributionMargin > 0 ? fixed / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * price;
    const contributionMarginPercent = price > 0 ? (contributionMargin / price) * 100 : 0;

    return { breakEvenUnits, breakEvenRevenue, contributionMarginPercent };
  };

  const calculateMortgage = () => {
    const loan = parseFloat(mortgageInputs.loanAmount) || 0;
    const rate = (parseFloat(mortgageInputs.interestRate) || 0) / 100 / 12;
    const term = (parseFloat(mortgageInputs.loanTerm) || 0) * 12;
    const downPayment = parseFloat(mortgageInputs.downPayment) || 0;

    const loanAmount = loan - downPayment;
    const monthlyPayment =
      rate > 0
        ? (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
        : loanAmount / (term || 1);
    const totalPayment = monthlyPayment * (term || 1);
    const totalInterest = totalPayment - loanAmount;

    return { monthlyPayment, totalPayment, totalInterest, loanAmount };
  };

  const calculateSavings = () => {
    const current = parseFloat(savingsInputs.currentSavings) || 0;
    const monthly = parseFloat(savingsInputs.monthlyContribution) || 0;
    const rate = (parseFloat(savingsInputs.annualReturn) || 0) / 100 / 12;
    const time = (parseFloat(savingsInputs.timeHorizon) || 0) * 12;

    const futureValue =
      rate !== 0
        ? current * Math.pow(1 + rate, time) + monthly * ((Math.pow(1 + rate, time) - 1) / rate)
        : current + monthly * time;
    const totalContributions = current + monthly * time;
    const totalGrowth = futureValue - totalContributions;

    return { futureValue, totalContributions, totalGrowth };
  };

  const calculateDebtPayoff = () => {
    const debt = parseFloat(debtInputs.totalDebt) || 0;
    const rate = (parseFloat(debtInputs.interestRate) || 0) / 100 / 12;
    const payment = parseFloat(debtInputs.monthlyPayment) || 0;
    const extra = parseFloat(debtInputs.extraPayment) || 0;

    const totalPayment = payment + extra;
    let months = 0;
    let balance = debt;
    let totalInterestPaid = 0;

    if (rate >= 0 && totalPayment > 0) {
      while (balance > 0.01 && months < 600) {
        const interestPayment = balance * rate;
        const principalPayment = Math.min(totalPayment - interestPayment, balance);
        if (principalPayment <= 0) break;
        totalInterestPaid += interestPayment;
        balance -= principalPayment;
        months++;
      }
    }
    const years = months / 12;
    return { payoffMonths: months, payoffYears: years, totalInterestPaid };
  };

  const results = {
    employeeCost: calculateEmployeeCost(),
    roi: calculateROI(),
    breakEven: calculateBreakEven(),
    mortgage: calculateMortgage(),
    savings: calculateSavings(),
    debtPayoff: calculateDebtPayoff(),
  };

  // =========================
  // SUITES & CATALOG
  // =========================
  const calculatorSuites: Record<string, any> = {
    business: {
      title: "Business Calculator Suite",
      icon: Building,
      calculators: {
        roi: { name: "ROI Calculator", icon: TrendingUp, tier: "free" }, // FREE
        "break-even": { name: "Break-Even", icon: BarChart3, tier: "free" }, // FREE
        "employee-cost": { name: "Employee Cost", icon: Users, tier: "pro" }, // PRO (gated)
      },
    },
    financial: {
      title: "Financial Calculator Suite",
      icon: DollarSign,
      calculators: {
        mortgage: { name: "Mortgage", icon: Home, tier: "free" }, // FREE
        savings: { name: "Savings", icon: PiggyBank, tier: "pro" }, // PRO (gated)
        "debt-payoff": { name: "Debt Payoff", icon: CreditCard, tier: "pro" }, // PRO (gated)
      },
    },
  };

  // =========================
  // NAV: HANDLE GATED CLICKS
  // =========================
  const handleSelectCalculator = (key: string, tier: "free" | "pro") => {
    if (tier === "pro" && !isPro) {
      const ok =
        typeof window !== "undefined"
          ? window.confirm("This calculator is available on the Professional plan. Upgrade now?")
          : false;
      if (ok) window.location.href = "/upgrade"; // TODO: replace with your checkout URL
      return;
    }
    setActiveCalculator(key);
  };

  // =========================
  // ADSENSE PLACEHOLDERS
  // =========================
  const AdBannerTop = () =>
    !showAds ? null : (
      <div className="my-4 w-full flex justify-center">
        {/* AdSense Top Banner (728x90 / responsive) */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR-CLIENT-ID" crossOrigin="anonymous"></script>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="YOUR-CLIENT-ID"
           data-ad-slot="TOP_BANNER_SLOT"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = (window as any).adsbygoogle || []).push({});</script> */}
        <div className="w-full max-w-5xl h-20 bg-gray-100 border border-dashed flex items-center justify-center text-sm text-gray-500">
          Ad Placeholder (Top Banner)
        </div>
      </div>
    );

  const AdSidebar = () =>
    !showAds ? null : (
      <div className="hidden md:block">
        {/* AdSense Rectangle 300x250 / responsive */}
        <div className="w-[300px] h-[250px] bg-gray-100 border border-dashed flex items-center justify-center text-sm text-gray-500">
          Ad Placeholder (Sidebar)
        </div>
      </div>
    );

  const AdInContent = () =>
    !showAds ? null : (
      <div className="my-4">
        {/* AdSense In-Content / In-Article */}
        <div className="w-full h-28 bg-gray-100 border border-dashed flex items-center justify-center text-sm text-gray-500">
          Ad Placeholder (In-Content)
        </div>
      </div>
    );

  const AdFooter = () =>
    !showAds ? null : (
      <div className="mt-8">
        {/* AdSense Footer Banner */}
        <div className="w-full h-20 bg-gray-100 border border-dashed flex items-center justify-center text-sm text-gray-500">
          Ad Placeholder (Footer)
        </div>
      </div>
    );

  // =========================
  // BUSINESS CALCULATORS
  // =========================
  const renderBusinessCalculator = () => {
    switch (activeCalculator) {
      case "employee-cost":
        if (!isPro) {
          return (
            <div className="p-6 border rounded-lg bg-blue-50 text-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-semibold">Professional Feature</span>
              </div>
              <p className="mb-4">
                The Employee Cost calculator is available on the Professional plan.
              </p>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                onClick={() => (window.location.href = "/upgrade")}
              >
                Upgrade to Unlock
              </button>
            </div>
          );
        }
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Compensation (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Compensation</h4>

                <p className="text-sm font-semibold text-blue-700 mb-2">Pay Structure</p>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center text-gray-800">
                    <input
                      type="radio"
                      value="salary"
                      checked={employeeInputs.payType === "salary"}
                      onChange={(e) =>
                        setEmployeeInputs({ ...employeeInputs, payType: e.target.value })
                      }
                      className="mr-2"
                    />
                    Salary
                  </label>
                  <label className="flex items-center text-gray-800">
                    <input
                      type="radio"
                      value="hourly"
                      checked={employeeInputs.payType === "hourly"}
                      onChange={(e) =>
                        setEmployeeInputs({ ...employeeInputs, payType: e.target.value })
                      }
                      className="mr-2"
                    />
                    Hourly
                  </label>
                </div>

                {employeeInputs.payType === "salary" ? (
                  <Field
                    id="baseSalary"
                    label="Base Annual Salary"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={employeeInputs.baseSalary}
                    onChange={(e) =>
                      setEmployeeInputs({ ...employeeInputs, baseSalary: e.target.value })
                    }
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="hourlyRate"
                      label="Hourly Rate"
                      prefix="$"
                      labelColor="text-blue-700"
                      value={employeeInputs.hourlyRate}
                      onChange={(e) =>
                        setEmployeeInputs({ ...employeeInputs, hourlyRate: e.target.value })
                      }
                    />
                    <Field
                      id="hoursPerWeek"
                      label="Hours per Week"
                      suffix="hrs"
                      labelColor="text-blue-700"
                      value={employeeInputs.hoursPerWeek}
                      onChange={(e) =>
                        setEmployeeInputs({ ...employeeInputs, hoursPerWeek: e.target.value })
                      }
                    />
                  </div>
                )}

                <Field
                  id="annualOvertime"
                  label="Annual Overtime"
                  prefix="$"
                  labelColor="text-blue-700"
                  value={employeeInputs.annualOvertime}
                  onChange={(e) =>
                    setEmployeeInputs({ ...employeeInputs, annualOvertime: e.target.value })
                  }
                  hint="Total expected overtime pay this year"
                  className="mt-3"
                />
              </div>

              {/* Benefits (Green) */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Benefits</h4>
                <div className="space-y-3">
                  <Field
                    id="healthInsurance"
                    label="Health Insurance (Annual)"
                    prefix="$"
                    labelColor="text-green-700"
                    value={employeeInputs.healthInsurance}
                    onChange={(e) =>
                      setEmployeeInputs({ ...employeeInputs, healthInsurance: e.target.value })
                    }
                  />
                  <Field
                    id="retirement401k"
                    label="401k Match (Annual)"
                    prefix="$"
                    labelColor="text-green-700"
                    value={employeeInputs.retirement401k}
                    onChange={(e) =>
                      setEmployeeInputs({ ...employeeInputs, retirement401k: e.target.value })
                    }
                  />
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">Total Cost Analysis</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {formatCurrency(results.employeeCost.totalCost)}
                  </div>
                  <div className="text-gray-300">Total Annual Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(results.employeeCost.hourlyRate)}
                  </div>
                  <div className="text-gray-300">Effective Hourly Rate</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Wages (+ Overtime):</span>
                    <span>{formatCurrency(results.employeeCost.annualWages)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Benefits:</span>
                    <span>{formatCurrency(results.employeeCost.benefitsCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span>{formatCurrency(results.employeeCost.taxesCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "roi":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Investment Details (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Investment Details</h4>
                <div className="space-y-3">
                  <Field
                    id="roiInitial"
                    label="Initial Investment"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={roiInputs.initialInvestment}
                    onChange={(e) =>
                      setRoiInputs({ ...roiInputs, initialInvestment: e.target.value })
                    }
                  />
                  <Field
                    id="roiFinal"
                    label="Final Value"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={roiInputs.finalValue}
                    onChange={(e) => setRoiInputs({ ...roiInputs, finalValue: e.target.value })}
                  />
                  <Field
                    id="roiYears"
                    label="Time Horizon (Years)"
                    suffix="yrs"
                    labelColor="text-blue-700"
                    value={roiInputs.timeHorizon}
                    onChange={(e) => setRoiInputs({ ...roiInputs, timeHorizon: e.target.value })}
                  />
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">ROI Analysis</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {formatPercent(results.roi.roiPercent)}
                  </div>
                  <div className="text-gray-300">Total ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">
                    {formatPercent(results.roi.annualizedROI)}
                  </div>
                  <div className="text-gray-300">Annualized ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(results.roi.profit)}
                  </div>
                  <div className="text-gray-300">Total Profit</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "break-even":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Business Costs (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Business Costs</h4>
                <div className="space-y-3">
                  <Field
                    id="fixedCosts"
                    label="Fixed Costs (Monthly)"
                    prefix="$"
                    suffix="/mo"
                    labelColor="text-blue-700"
                    value={breakEvenInputs.fixedCosts}
                    onChange={(e) =>
                      setBreakEvenInputs({ ...breakEvenInputs, fixedCosts: e.target.value })
                    }
                  />
                  <Field
                    id="variableCPU"
                    label="Variable Cost per Unit"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={breakEvenInputs.variableCostPerUnit}
                    onChange={(e) =>
                      setBreakEvenInputs({
                        ...breakEvenInputs,
                        variableCostPerUnit: e.target.value,
                      })
                    }
                  />
                  <Field
                    id="priceUnit"
                    label="Price per Unit"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={breakEvenInputs.pricePerUnit}
                    onChange={(e) =>
                      setBreakEvenInputs({ ...breakEvenInputs, pricePerUnit: e.target.value })
                    }
                  />
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">Break-Even Analysis</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {Math.round(results.breakEven.breakEvenUnits)}
                  </div>
                  <div className="text-gray-300">Break-Even Units</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(results.breakEven.breakEvenRevenue)}
                  </div>
                  <div className="text-gray-300">Break-Even Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatPercent(results.breakEven.contributionMarginPercent)}
                  </div>
                  <div className="text-gray-300">Contribution Margin</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // =========================
  // FINANCIAL CALCULATORS
  // =========================
  const renderFinancialCalculator = () => {
    switch (activeCalculator) {
      case "mortgage":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Loan Details (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Loan Details</h4>
                <div className="space-y-3">
                  <Field
                    id="homePrice"
                    label="Home Price"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={mortgageInputs.loanAmount}
                    onChange={(e) =>
                      setMortgageInputs({ ...mortgageInputs, loanAmount: e.target.value })
                    }
                  />
                  <Field
                    id="downPayment"
                    label="Down Payment"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={mortgageInputs.downPayment}
                    onChange={(e) =>
                      setMortgageInputs({ ...mortgageInputs, downPayment: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="mortRate"
                      label="Interest Rate"
                      step="0.01"
                      suffix="%"
                      labelColor="text-blue-700"
                      value={mortgageInputs.interestRate}
                      onChange={(e) =>
                        setMortgageInputs({ ...mortgageInputs, interestRate: e.target.value })
                      }
                    />
                    <Field
                      id="loanTerm"
                      label="Loan Term"
                      suffix="yrs"
                      labelColor="text-blue-700"
                      value={mortgageInputs.loanTerm}
                      onChange={(e) =>
                        setMortgageInputs({ ...mortgageInputs, loanTerm: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">Mortgage Payment</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {formatCurrency(results.mortgage.monthlyPayment)}
                  </div>
                  <div className="text-gray-300">Monthly Payment</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(results.mortgage.totalInterest)}
                  </div>
                  <div className="text-gray-300">Total Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(results.mortgage.loanAmount)}
                  </div>
                  <div className="text-gray-300">Loan Amount</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "savings":
        if (!isPro) {
          return (
            <div className="p-6 border rounded-lg bg-blue-50 text-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-semibold">Professional Feature</span>
              </div>
              <p className="mb-4">This calculator is available on the Professional plan.</p>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                onClick={() => (window.location.href = "/upgrade")}
              >
                Upgrade to Unlock
              </button>
            </div>
          );
        }
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Savings Plan (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Savings Plan</h4>
                <div className="space-y-3">
                  <Field
                    id="currentSavings"
                    label="Current Savings"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={savingsInputs.currentSavings}
                    onChange={(e) =>
                      setSavingsInputs({ ...savingsInputs, currentSavings: e.target.value })
                    }
                  />
                  <Field
                    id="monthlyContribution"
                    label="Monthly Contribution"
                    prefix="$"
                    suffix="/mo"
                    labelColor="text-blue-700"
                    value={savingsInputs.monthlyContribution}
                    onChange={(e) =>
                      setSavingsInputs({ ...savingsInputs, monthlyContribution: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="annualReturn"
                      label="Annual Return"
                      step="0.01"
                      suffix="%"
                      labelColor="text-blue-700"
                      value={savingsInputs.annualReturn}
                      onChange={(e) =>
                        setSavingsInputs({ ...savingsInputs, annualReturn: e.target.value })
                      }
                    />
                    <Field
                      id="savingsYears"
                      label="Time"
                      suffix="yrs"
                      labelColor="text-blue-700"
                      value={savingsInputs.timeHorizon}
                      onChange={(e) =>
                        setSavingsInputs({ ...savingsInputs, timeHorizon: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">Future Value</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {formatCurrency(results.savings.futureValue)}
                  </div>
                  <div className="text-gray-300">Future Value</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(results.savings.totalGrowth)}
                  </div>
                  <div className="text-gray-300">Total Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(results.savings.totalContributions)}
                  </div>
                  <div className="text-gray-300">Total Contributions</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "debt-payoff":
        if (!isPro) {
          return (
            <div className="p-6 border rounded-lg bg-blue-50 text-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-semibold">Professional Feature</span>
              </div>
              <p className="mb-4">This calculator is available on the Professional plan.</p>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                onClick={() => (window.location.href = "/upgrade")}
              >
                Upgrade to Unlock
              </button>
            </div>
          );
        }
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Debt Info (Blue) */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Debt Information</h4>
                <div className="space-y-3">
                  <Field
                    id="debtTotal"
                    label="Total Debt Balance"
                    prefix="$"
                    labelColor="text-blue-700"
                    value={debtInputs.totalDebt}
                    onChange={(e) => setDebtInputs({ ...debtInputs, totalDebt: e.target.value })}
                  />
                  <Field
                    id="debtRate"
                    label="Interest Rate"
                    step="0.01"
                    suffix="%"
                    labelColor="text-blue-700"
                    value={debtInputs.interestRate}
                    onChange={(e) => setDebtInputs({ ...debtInputs, interestRate: e.target.value })}
                  />
                  <Field
                    id="monthlyPayment"
                    label="Monthly Payment"
                    prefix="$"
                    suffix="/mo"
                    labelColor="text-blue-700"
                    value={debtInputs.monthlyPayment}
                    onChange={(e) =>
                      setDebtInputs({ ...debtInputs, monthlyPayment: e.target.value })
                    }
                  />
                  <Field
                    id="extraPayment"
                    label="Extra Payment"
                    prefix="$"
                    suffix="/mo"
                    labelColor="text-blue-700"
                    value={debtInputs.extraPayment}
                    onChange={(e) => setDebtInputs({ ...debtInputs, extraPayment: e.target.value })}
                  />
                </div>
              </div>

              <AdInContent />
            </div>

            {/* Results */}
            <div className="bg-gray-900 text-white p-6 rounded-lg" aria-live="polite">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold mb-4">Payoff Timeline</h4>
                <AdSidebar />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.debtPayoff.payoffYears.toFixed(1)} years
                  </div>
                  <div className="text-gray-300">Payoff Time</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {Math.round(results.debtPayoff.payoffMonths)} months
                  </div>
                  <div className="text-gray-300">Total Months</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(results.debtPayoff.totalInterestPaid)}
                  </div>
                  <div className="text-gray-300">Total Interest</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // =========================
  // RENDER
  // =========================
  const currentSuite = calculatorSuites[activeSuite];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Foster Wealth Ventures</h1>
        </div>
        <p className="text-gray-600">Professional Business & Financial Calculator Suites</p>
      </div>

      {/* AdSense Top Banner (free users) */}
      <AdBannerTop />

      {/* Suite Selection */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          {Object.entries(calculatorSuites).map(([key, suite]) => {
            const IconComponent = suite.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveSuite(key as "business" | "financial");
                  const firstKey = Object.keys(suite.calculators)[0];
                  const firstTier = suite.calculators[firstKey].tier as "free" | "pro";
                  if (firstTier === "pro" && !isPro) {
                    const freeKey =
                      Object.entries(suite.calculators).find(
                        ([, c]: any) => c.tier === "free"
                      )?.[0] || firstKey;
                    setActiveCalculator(freeKey);
                  } else {
                    setActiveCalculator(firstKey);
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeSuite === key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {suite.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Tabs (with lock for pro) */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Object.entries(currentSuite.calculators).map(([key, calc]: any) => {
          const IconComponent = calc.icon;
          const isLocked = calc.tier === "pro" && !isPro;
          const isActive = activeCalculator === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectCalculator(key, calc.tier)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all relative ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:text-gray-900 border"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {calc.name}
              {isLocked && <Lock className="w-3.5 h-3.5 opacity-80" />}
              {isLocked && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-blue-700">
                  Pro
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calculator Display */}
      <div className="bg-white rounded-lg border p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {currentSuite.calculators[activeCalculator].name}
          </h2>
          <p className="text-gray-600">
            {activeSuite === "business"
              ? "Calculate business costs and returns to make informed decisions"
              : "Plan your financial future with accurate calculations"}
          </p>
        </div>

        {activeSuite === "business" ? renderBusinessCalculator() : renderFinancialCalculator()}
      </div>

      {/* Plans + Footer Ad */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">
            Get access to our complete calculator suite with advanced features, custom reports, and
            priority support.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">$49/month</div>
              <div className="text-sm text-gray-600">Starter Plan</div>
              <div className="text-xs text-gray-500">3 calculators</div>
            </div>
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold">$149/month</div>
              <div className="text-sm opacity-90">Professional Plan</div>
              <div className="text-xs opacity-75">All calculators + API</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-800">$399/month</div>
              <div className="text-sm text-gray-600">Enterprise Plan</div>
              <div className="text-xs text-gray-500">White-label + support</div>
            </div>
          </div>

          <button
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => (window.location.href = "/upgrade")}
          >
            Start Free Trial
          </button>

          <AdFooter />
        </div>
      </div>
    </div>
  );
};

export default FosterWealthCalculators;
