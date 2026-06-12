"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

// Lazy-load the two calculators so we don't SSR them and risk hydration issues
const EmployeeCost = dynamic(
  () => import("@/components/EmployeeCostPro"),
  { ssr: false },
);

const ExpenseSplitDeluxe = dynamic(
  () => import("@/components/ExpenseSplitDeluxe"),
  { ssr: false },
);

type ProChoice = "employee" | "expense" | null;

export default function ProSuite() {
  const router = useRouter();
  const search = useSearchParams();
  const [choice, setChoice] = React.useState<ProChoice>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // 1) On mount, read ?pro= query OR last saved localStorage value
  React.useEffect(() => {
    setHydrated(true);
    const queryChoice = (search.get("pro") as ProChoice) || null;

    if (queryChoice === "employee" || queryChoice === "expense") {
      setChoice(queryChoice);
      // persist selection so returning users land where they left off
      try {
        localStorage.setItem("fwv-pro-choice", queryChoice);
      } catch {
        // no-op (intentionally ignoring errors in upgrade flow)
      }
      return;
    }

    // fall back to last selection in localStorage (but DO NOT auto-select a default)
    try {
      const saved = localStorage.getItem("fwv-pro-choice") as ProChoice | null;
      if (saved === "employee" || saved === "expense") {
        setChoice(saved);
      }
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
  }, [search]);

  // 2) Helper to set URL and state together (no full reload)
  const choose = (val: Exclude<ProChoice, null>) => {
    setChoice(val);
    try {
      localStorage.setItem("fwv-pro-choice", val);
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
    const usp = new URLSearchParams(Array.from(search.entries()));
    usp.set("pro", val);
    router.replace(`?${usp.toString()}`);
  };

  // 3) UI – if no selection yet, show the chooser. Otherwise, render the chosen calc
  if (!hydrated) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-sm opacity-70">Loading…</div>
      </div>
    );
  }

  if (choice === null) {
    return (
      <section className="w-full max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Choose your Pro calculator
          </h2>
          <p className="mt-2 text-sm opacity-80">
            Your Pro plan includes <span className="font-medium">one</span> of
            the following calculators. Pick the one you want to use now — you
            can switch anytime.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Cost card */}
          <button
            type="button"
            onClick={() => choose("employee")}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-left shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Employee Cost Calculator
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                Pro
              </span>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Calculate the all‑in cost of a new hire (wages, taxes, benefits)
              and model scenarios.
            </p>
            <ul className="mt-3 text-sm list-disc pl-5 space-y-1 opacity-90">
              <li>Wages, employer taxes, benefits</li>
              <li>Scenario comparisons</li>
              <li>Downloadable summary</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 group-hover:gap-3 transition-all">
              <span className="text-sm font-medium">Use this</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 7.414V16a1 1 0 11-2 0V7.414L6.707 9.707A1 1 0 015.293 8.293l5-5z" />
              </svg>
            </div>
          </button>

          {/* Expense Split Deluxe card */}
          <button
            type="button"
            onClick={() => choose("expense")}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-left shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Expense Split Deluxe</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                Pro
              </span>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Split shared expenses fairly (roommates, couples, travel). Add
              custom categories and rules.
            </p>
            <ul className="mt-3 text-sm list-disc pl-5 space-y-1 opacity-90">
              <li>Equal / percentage / income‑weighted</li>
              <li>Child & travel add‑ons</li>
              <li>Export report</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 group-hover:gap-3 transition-all">
              <span className="text-sm font-medium">Use this</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 7.414V16a1 1 0 11-2 0V7.414L6.707 9.707A1 1 0 015.293 8.293l5-5z" />
              </svg>
            </div>
          </button>
        </div>
      </section>
    );
  }

  // 4) Render the selected calculator
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => choose("employee")}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              choice === "employee"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-transparent border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            Employee Cost
          </button>
          <button
            onClick={() => choose("expense")}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              choice === "expense"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-transparent border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            Expense Split Deluxe
          </button>
        </div>
        <button
          onClick={() => choose(choice === "employee" ? "expense" : "employee")}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Switch
        </button>
      </div>

      {choice === "employee" ? <EmployeeCost /> : <ExpenseSplitDeluxe />}
    </section>
  );
}
