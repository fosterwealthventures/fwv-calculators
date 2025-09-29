// components/UpgradeCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Plan } from "@/lib/plan";

type Card = {
  title: string;
  bullets: string[];
  cta: string;
  plan: Exclude<Plan, "free">;
  sub?: string;
};

const CARDS: Card[] = [
  {
    plan: "plus",
    title: "Plus — $6.99/mo",
    sub: "Ad-free + Savings & Debt.",
    bullets: [
      "Remove all ads",
      "Unlock Savings Growth calculator",
      "Unlock Debt Payoff calculator",
      "Keep access to all 6 free calculators",
    ],
    cta: "Choose PLUS",
  },
  {
    plan: "pro",
    title: "Pro — $29.99/mo",
    sub: "Includes one advanced calculator of your choice.",
    bullets: [
      "All Plus benefits",
      "Choose 1 advanced calculator:",
      "• Employee Cost or Expense Split Deluxe",
    ],
    cta: "Choose PRO",
  },
  {
    plan: "premium",
    title: "Premium — $59.99/mo",
    sub: "Everything unlocked.",
    bullets: [
      "All Pro benefits",
      "Access to ALL calculators:",
      "• Employee Cost + Expense Split Deluxe",
      "Priority support",
    ],
    cta: "Choose PREMIUM",
  },
];

// helpers
function setCookie(name: string, value: string, days = 365) {
  const maxAge = 60 * 60 * 24 * days;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}

/** Set plan + (if Pro) set pro-choice based on ?calc= slug */
function activatePlan(plan: Exclude<Plan, "free">, calcSlug: string | null) {
  // set plan
  setCookie("fwv_plan", plan);
  try {
    localStorage.setItem("fwv-plan", plan);
  } catch {}

  // handle pro choice - UPDATED to match plan.ts types
  if (plan === "pro") {
    let choice: "employee" | "expense_split" | null = null;
    const calc = (calcSlug || "").toLowerCase();
    if (calc === "employee-cost") choice = "employee";
    if (calc === "expense-split-deluxe") choice = "expense_split";

    if (choice) {
      setCookie("fwv_pro_choice", choice);
      try {
        localStorage.setItem("fwv-pro-choice", choice);
      } catch {}
    } else {
      // no slug context -> force chooser later
      clearCookie("fwv_pro_choice");
      try {
        localStorage.removeItem("fwv-pro-choice");
      } catch {}
    }
  } else {
    // non-pro plans don't need pro_choice
    clearCookie("fwv_pro_choice");
    try {
      localStorage.removeItem("fwv-pro-choice");
    } catch {}
  }
}

export default function UpgradeCard() {
  const [mounted, setMounted] = useState(false);
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const calc = (typeof window !== "undefined" && params.get("calc")) || null;
  const redirectTo =
    (typeof window !== "undefined" && params.get("redirect")) || "/dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.plan} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {CARDS.map((c) => (
        <div key={c.plan} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900">{c.title}</h3>
          {c.sub && <p className="mt-2 text-sm text-gray-600">{c.sub}</p>}
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {c.bullets.map((b, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <button
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            onClick={() => {
              activatePlan(c.plan, calc);
              window.location.href = redirectTo;
            }}
          >
            {c.cta}
          </button>

          <p className="mt-3 text-xs text-gray-500 text-center">
            Click to activate immediately in local preview
          </p>
        </div>
      ))}
    </div>
  );
}