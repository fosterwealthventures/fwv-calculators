"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Calculator,
  Users,
  Plus,
  Download,
  X,
  Calendar,
  RotateCcw,
} from "lucide-react";
// Permissions hook (Pro/Premium gate for this calculator)
import { useDownloadPermission } from "@/hooks/useDownloadPermission";

const EMPLOYEE_DEFAULT = {
  payType: "salary" as "salary" | "hourly",
  salary: 65000,
  hourlyRate: 25,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  benefitsPercent: 25,
  payrollTaxRate: 7.65,
  unemploymentTax: 0.6,
  workersComp: 0.75,
  otherBenefits: 0,
};

const EXPENSES_DEFAULT: Expense[] = [
  { id: 1, name: "Office Supplies", amount: 500, frequency: "annual" },
  { id: 2, name: "Equipment/Computer", amount: 1200, frequency: "annual" },
];

const NEW_EXPENSE_DEFAULT = {
  name: "",
  amount: "",
  frequency: "annual" as Expense["frequency"],
};

type Expense = {
  id: number;
  name: string;
  amount: number;
  frequency: "annual" | "monthly" | "weekly" | "daily";
};

type Props = {
  /**
   * Optional: called when user clicks download without sufficient permission.
   * Use this to open your upgrade modal/flow.
   */
  onUpgrade?: () => void;
};

const EmployeeCostPro: React.FC<Props> = ({ onUpgrade }) => {
  // === PERMISSIONS: use app-wide gate for the Employee Cost calculator ===
  const { canDownload = false } = useDownloadPermission("employee-cost");

  const [employeeData, setEmployeeData] = useState({ ...EMPLOYEE_DEFAULT });

  const [expenses, setExpenses] = useState<Expense[]>([...EXPENSES_DEFAULT]);

  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    frequency: Expense["frequency"];
  }>({ ...NEW_EXPENSE_DEFAULT });

  const [timeBreakdown, setTimeBreakdown] = useState<
    "annual" | "quarterly" | "monthly" | "biweekly" | "weekly" | "daily"
  >("annual");

  const resetAll = () => {
    setEmployeeData({ ...EMPLOYEE_DEFAULT });
    setExpenses([...EXPENSES_DEFAULT]);
    setNewExpense({ ...NEW_EXPENSE_DEFAULT });
    setTimeBreakdown("annual");
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.amount !== "") {
      setExpenses((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newExpense.name,
          amount: Number(newExpense.amount),
          frequency: newExpense.frequency,
        },
      ]);
      setNewExpense({ name: "", amount: "", frequency: "annual" });
    }
  };

  const removeExpense = (id: number) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const getAnnualExpenseAmount = (
    amount: number,
    frequency: Expense["frequency"],
  ) => {
    switch (frequency) {
      case "daily":
        return amount * 365;
      case "weekly":
        return amount * 52;
      case "monthly":
        return amount * 12;
      default:
        return amount;
    }
  };

  const calculateEmployeeCost = () => {
    const basePay =
      employeeData.payType === "salary"
        ? employeeData.salary
        : employeeData.hourlyRate *
          employeeData.hoursPerWeek *
          employeeData.weeksPerYear;

    const benefits = basePay * (employeeData.benefitsPercent / 100);
    const payrollTax = basePay * (employeeData.payrollTaxRate / 100);
    const unemploymentTax = basePay * (employeeData.unemploymentTax / 100);
    const workersComp = basePay * (employeeData.workersComp / 100);
    const otherBenefits = employeeData.otherBenefits;

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + getAnnualExpenseAmount(e.amount, e.frequency),
      0,
    );
    const totalCost =
      basePay +
      benefits +
      payrollTax +
      unemploymentTax +
      workersComp +
      otherBenefits +
      totalExpenses;

    const totalHours = Math.max(
      1,
      employeeData.hoursPerWeek * employeeData.weeksPerYear,
    ); // guard

    return {
      basePay,
      benefits,
      payrollTax,
      unemploymentTax,
      workersComp,
      otherBenefits,
      totalExpenses,
      totalCost,
      weeklyCost: totalCost / 52,
      biWeeklyCost: totalCost / 26,
      monthlyCost: totalCost / 12,
      quarterlyCost: totalCost / 4,
      dailyCost: totalCost / 365,
      hourlyCost: totalCost / totalHours,
    };
  };

  const employeeResults = calculateEmployeeCost();

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(n);

  const formatCurrencyDetailed = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  const getTimeBreakdown = () => {
    switch (timeBreakdown) {
      case "daily":
        return {
          period: "Daily",
          basePay: employeeResults.basePay / 365,
          benefits: employeeResults.benefits / 365,
          payrollTax: employeeResults.payrollTax / 365,
          unemploymentTax: employeeResults.unemploymentTax / 365,
          workersComp: employeeResults.workersComp / 365,
          otherBenefits: employeeResults.otherBenefits / 365,
          totalExpenses: employeeResults.totalExpenses / 365,
          totalCost: employeeResults.dailyCost,
        };
      case "weekly":
        return {
          period: "Weekly",
          basePay: employeeResults.basePay / 52,
          benefits: employeeResults.benefits / 52,
          payrollTax: employeeResults.payrollTax / 52,
          unemploymentTax: employeeResults.unemploymentTax / 52,
          workersComp: employeeResults.workersComp / 52,
          otherBenefits: employeeResults.otherBenefits / 52,
          totalExpenses: employeeResults.totalExpenses / 52,
          totalCost: employeeResults.weeklyCost,
        };
      case "biweekly":
        return {
          period: "Bi-Weekly",
          basePay: employeeResults.basePay / 26,
          benefits: employeeResults.benefits / 26,
          payrollTax: employeeResults.payrollTax / 26,
          unemploymentTax: employeeResults.unemploymentTax / 26,
          workersComp: employeeResults.workersComp / 26,
          otherBenefits: employeeResults.otherBenefits / 26,
          totalExpenses: employeeResults.totalExpenses / 26,
          totalCost: employeeResults.biWeeklyCost,
        };
      case "monthly":
        return {
          period: "Monthly",
          basePay: employeeResults.basePay / 12,
          benefits: employeeResults.benefits / 12,
          payrollTax: employeeResults.payrollTax / 12,
          unemploymentTax: employeeResults.unemploymentTax / 12,
          workersComp: employeeResults.workersComp / 12,
          otherBenefits: employeeResults.otherBenefits / 12,
          totalExpenses: employeeResults.totalExpenses / 12,
          totalCost: employeeResults.monthlyCost,
        };
      case "quarterly":
        return {
          period: "Quarterly",
          basePay: employeeResults.basePay / 4,
          benefits: employeeResults.benefits / 4,
          payrollTax: employeeResults.payrollTax / 4,
          unemploymentTax: employeeResults.unemploymentTax / 4,
          workersComp: employeeResults.workersComp / 4,
          otherBenefits: employeeResults.otherBenefits / 4,
          totalExpenses: employeeResults.totalExpenses / 4,
          totalCost: employeeResults.quarterlyCost,
        };
      default:
        return {
          period: "Annual",
          basePay: employeeResults.basePay,
          benefits: employeeResults.benefits,
          payrollTax: employeeResults.payrollTax,
          unemploymentTax: employeeResults.unemploymentTax,
          workersComp: employeeResults.workersComp,
          otherBenefits: employeeResults.otherBenefits,
          totalExpenses: employeeResults.totalExpenses,
          totalCost: employeeResults.totalCost,
        };
    }
  };

  const breakdown = getTimeBreakdown();

  // === DOWNLOAD (gated by Permissions hook) ===
  const downloadReport = () => {
    if (!canDownload) {
      // Trigger the upgrade flow if provided; else show an alert fallback
      if (onUpgrade) return onUpgrade();
      alert(
        "Download capability requires Pro or Premium plan for this calculator",
      );
      return;
    }

    const reportDate = new Date().toLocaleDateString();
    const report = `
EMPLOYEE COST ANALYSIS REPORT
Generated: ${reportDate}

COST BREAKDOWN (${breakdown.period.toUpperCase()})
Base Pay: ${formatCurrency(breakdown.basePay)}
Benefits (${employeeData.benefitsPercent}%): ${formatCurrency(breakdown.benefits)}
Payroll Tax (${employeeData.payrollTaxRate}%): ${formatCurrency(breakdown.payrollTax)}
Unemployment Tax (${employeeData.unemploymentTax}%): ${formatCurrency(breakdown.unemploymentTax)}
Workers' Comp (${employeeData.workersComp}%): ${formatCurrency(breakdown.workersComp)}
Other Benefits: ${formatCurrency(breakdown.otherBenefits)}
Additional Expenses: ${formatCurrency(breakdown.totalExpenses)}
TOTAL ${breakdown.period.toUpperCase()} COST: ${formatCurrency(breakdown.totalCost)}

PAY PERIOD SUMMARY
Daily: ${formatCurrency(employeeResults.dailyCost)}
Weekly: ${formatCurrency(employeeResults.weeklyCost)}
Bi-Weekly: ${formatCurrency(employeeResults.biWeeklyCost)}
Monthly: ${formatCurrency(employeeResults.monthlyCost)}
Quarterly: ${formatCurrency(employeeResults.quarterlyCost)}
Annual: ${formatCurrency(employeeResults.totalCost)}
Hourly Cost: ${formatCurrencyDetailed(employeeResults.hourlyCost)}
    `.trim();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    a.download = `employee-cost-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <DollarSign className="h-7 w-7 md:h-8 md:w-8" />
              Employee Cost Calculator
            </h1>
            <p className="text-blue-100 mt-2">
              Calculate the true cost of hiring—salary, benefits, taxes, and
              additional expenses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white/15 text-white hover:bg-white/25 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
            <button
              onClick={downloadReport}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                canDownload
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-200"
              }`}
              disabled={!canDownload}
              title={
                canDownload ? "Download Report" : "Upgrade to download reports"
              }
            >
              <Download className="h-4 w-4" />
              {canDownload ? "Download Report" : "Upgrade to Download"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="xl:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                Employee Information
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Structure
              </label>
              <select
                value={employeeData.payType}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    payType: e.target.value as "salary" | "hourly",
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="salary">Annual Salary</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            {employeeData.payType === "salary" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Salary ($)
                </label>
                <input
                  type="number"
                  value={employeeData.salary}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      salary: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="65,000"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={employeeData.hourlyRate}
                    onChange={(e) =>
                      setEmployeeData({
                        ...employeeData,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25.00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours/Week
                    </label>
                    <input
                      type="number"
                      value={employeeData.hoursPerWeek}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          hoursPerWeek: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weeks/Year
                    </label>
                    <input
                      type="number"
                      value={employeeData.weeksPerYear}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          weeksPerYear: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="52"
                    />
                  </div>
                </div>
              </>
            )}

            <hr className="my-6" />

            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Benefits & Taxes
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={employeeData.benefitsPercent}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      benefitsPercent: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Health, dental, vision, etc.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payroll Tax (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={employeeData.payrollTaxRate}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      payrollTaxRate: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7.65"
                />
                <p className="text-xs text-gray-500 mt-1">
                  FICA (Social Security + Medicare)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unemployment Tax (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={employeeData.unemploymentTax}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      unemploymentTax: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.6"
                />
                <p className="text-xs text-gray-500 mt-1">FUTA + SUTA</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workers' Comp (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={employeeData.workersComp}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      workersComp: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.75"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Workers' compensation insurance
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Benefits ($)
              </label>
              <input
                type="number"
                value={employeeData.otherBenefits}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    otherBenefits: Number(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Training, equipment, bonuses, etc.
              </p>
            </div>

            <hr className="my-6" />

            {/* Additional Expenses */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Additional Expenses
              </h4>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Expense name"
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={newExpense.frequency}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        frequency: e.target.value as Expense["frequency"],
                      })
                    }
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                  <button
                    onClick={addExpense}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-3 bg-white border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{expense.name}</span>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(expense.amount)} ({expense.frequency})
                        {expense.frequency !== "annual" && (
                          <span>
                            {" "}
                            →{" "}
                            {formatCurrency(
                              getAnnualExpenseAmount(
                                expense.amount,
                                expense.frequency,
                              ),
                            )}{" "}
                            annual
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Cost Analysis
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <select
                  value={timeBreakdown}
                  onChange={(e) =>
                    setTimeBreakdown(e.target.value as typeof timeBreakdown)
                  }
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="annual">Annual View</option>
                  <option value="quarterly">Quarterly View</option>
                  <option value="monthly">Monthly View</option>
                  <option value="biweekly">Bi-Weekly View</option>
                  <option value="weekly">Weekly View</option>
                  <option value="daily">Daily View</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-700 mb-2">
                Total {breakdown.period} Cost
              </h4>
              <p className="text-4xl font-bold text-blue-800">
                {formatCurrency(breakdown.totalCost)}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                {(
                  (employeeResults.totalCost / employeeResults.basePay - 1) *
                  100
                ).toFixed(1)}
                % more than base pay
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700">Daily Cost</h5>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(employeeResults.dailyCost)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-700">Weekly Cost</h5>
                <p className="text-lg font-bold text-purple-800">
                  {formatCurrency(employeeResults.weeklyCost)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-700">Bi-Weekly Cost</h5>
                <p className="text-lg font-bold text-blue-800">
                  {formatCurrency(employeeResults.biWeeklyCost)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-700">Monthly Cost</h5>
                <p className="text-lg font-bold text-orange-800">
                  {formatCurrency(employeeResults.monthlyCost)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-700">Quarterly Cost</h5>
                <p className="text-lg font-bold text-red-800">
                  {formatCurrency(employeeResults.quarterlyCost)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-4">
                {breakdown.period} Breakdown
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Base Pay:</span>
                  <span className="font-semibold">
                    {formatCurrency(breakdown.basePay)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">
                    Benefits ({employeeData.benefitsPercent}%):
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(breakdown.benefits)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">
                    Payroll Tax ({employeeData.payrollTaxRate}%):
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(breakdown.payrollTax)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">
                    Unemployment Tax ({employeeData.unemploymentTax}%):
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(breakdown.unemploymentTax)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">
                    Workers' Comp ({employeeData.workersComp}%):
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(breakdown.workersComp)}
                  </span>
                </div>
                {employeeData.otherBenefits > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">Other Benefits:</span>
                    <span className="font-semibold">
                      {formatCurrency(breakdown.otherBenefits)}
                    </span>
                  </div>
                )}
                {breakdown.totalExpenses > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">Additional Expenses:</span>
                    <span className="font-semibold">
                      {formatCurrency(breakdown.totalExpenses)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 pt-4 border-top-2 border-gray-300 text-lg font-bold">
                  <span className="text-gray-800">
                    Total {breakdown.period} Cost:
                  </span>
                  <span className="text-blue-600">
                    {formatCurrency(breakdown.totalCost)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">
                  💡 Cost Insights
                </h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>
                    • True hourly cost:{" "}
                    <strong>
                      {formatCurrencyDetailed(employeeResults.hourlyCost)}
                    </strong>
                  </li>
                  <li>
                    • Benefits & taxes add:{" "}
                    <strong>
                      {formatCurrency(
                        employeeResults.totalCost -
                          employeeResults.basePay -
                          employeeResults.totalExpenses,
                      )}
                    </strong>
                  </li>
                  <li>
                    • Additional expenses add:{" "}
                    <strong>
                      {formatCurrency(employeeResults.totalExpenses)}
                    </strong>
                  </li>
                  <li>
                    • Cost multiplier:{" "}
                    <strong>
                      {(
                        employeeResults.totalCost / employeeResults.basePay
                      ).toFixed(2)}
                      x
                    </strong>{" "}
                    base pay
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-2">
                  📊 Pay Period Summary
                </h5>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>
                    • Bi-Weekly:{" "}
                    <strong>
                      {formatCurrency(employeeResults.biWeeklyCost)}
                    </strong>{" "}
                    (26 periods/year)
                  </li>
                  <li>
                    • Monthly:{" "}
                    <strong>
                      {formatCurrency(employeeResults.monthlyCost)}
                    </strong>{" "}
                    (12 periods/year)
                  </li>
                  <li>
                    • Quarterly:{" "}
                    <strong>
                      {formatCurrency(employeeResults.quarterlyCost)}
                    </strong>{" "}
                    (4 periods/year)
                  </li>
                  <li>• Perfect for payroll planning & budgeting</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Results */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCostPro;
