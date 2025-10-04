// app/pricing/price-client.tsx — CLIENT component
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PlanKey = "free" | "plus" | "pro" | "premium";

const MONTHLY = {
  free: 0,
  plus: 6.99,
  pro: 29.99,
  premium: 59.99,
} as const;

function fmtUSD(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function PriceClient() {
  const [cycle, setCycle] = useState<"mo" | "yr">("mo");
  const params = useSearchParams();
  const router = useRouter();

  const redirectTo = params.get("redirect") || "/dashboard";

  const prices = useMemo(() => {
    if (cycle === "mo") return MONTHLY;
    return {
      free: 0,
      plus: +(MONTHLY.plus * 12).toFixed(2),
      pro: +(MONTHLY.pro * 12).toFixed(2),
      premium: +(MONTHLY.premium * 12).toFixed(2),
    };
  }, [cycle]);

  const suffix = cycle === "mo" ? "/mo" : "/yr";

  const choose = (plan: PlanKey) => {
    try {
      // Keep both keys in sync for compatibility
      localStorage.setItem("fwv.planId", plan);
      localStorage.setItem("fwv-plan", plan);
      document.cookie = `fwv_plan=${plan}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
    const next = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}plan=${plan}`;
    router.replace(next);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="heading-hero">Plans &amp; Pricing</h1>
      <p className="mt-2 text-gray-600">
        Pick the plan that fits today. You can always upgrade later.
      </p>

      {/* Billing cycle toggle */}
      <div className="mt-5 flex items-center gap-2">
        <span
          className={`text-sm ${cycle === "mo" ? "font-semibold" : "text-gray-500"}`}
        >
          Monthly
        </span>
        <button
          aria-label="Toggle billing cycle"
          onClick={() => setCycle(cycle === "mo" ? "yr" : "mo")}
          className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors data-[on=true]:bg-brand-green"
          data-on={cycle === "yr"}
        >
          <span
            className="absolute left-0.5 top-0.5 inline-block h-5 w-5 rounded-full bg-white transition-transform data-[on=true]:translate-x-5"
            data-on={cycle === "yr"}
          />
        </button>
        <span
          className={`text-sm ${cycle === "yr" ? "font-semibold" : "text-gray-500"}`}
        >
          Yearly
        </span>
        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
          Yearly shows 12× monthly price
        </span>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Free */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Free</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.free)}{" "}
            <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>Access to free calculators</li>
            <li>Ads supported</li>
          </ul>
          <button
            onClick={() => choose("free")}
            className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Try the Free tools
          </button>
        </div>

        {/* Plus */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-brand-green/20">
          <h3 className="text-lg font-semibold">Plus</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.plus)}{" "}
            <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>Remove all ads</li>
            <li>Unlock Savings Growth calculator</li>
            <li>Unlock Debt Payoff calculator</li>
            <li>Keep access to all 6 free calculators</li>
          </ul>
          <button
            onClick={() => choose("plus")}
            className="mt-4 w-full rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Choose PLUS
          </button>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Pro</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.pro)}{" "}
            <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>All Free benefits, no ads</li>
            <li>
              <strong>Choose 1 advanced calculator</strong>:
            </li>
            <li className="ml-4">• Employee Cost or Expense Split Deluxe</li>
          </ul>
          <button
            onClick={() => choose("pro")}
            className="mt-4 w-full rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Go Pro
          </button>
        </div>

        {/* Premium */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Premium</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.premium)}{" "}
            <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>All Pro benefits</li>
            <li>
              <strong>Access to ALL calculators</strong>:
            </li>
            <li className="ml-4">• Employee Cost + Expense Split Deluxe</li>
            <li>Priority support</li>
          </ul>
          <button
            onClick={() => choose("premium")}
            className="mt-4 w-full rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Choose Premium
          </button>
        </div>
      </div>
    </main>
  );
}
