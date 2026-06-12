// app/pricing/price-client.tsx — CLIENT (sends { plan } to /api/checkout)
"use client";

import { SignInButton } from "@/components/auth/SignInButton";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Billing = "mo" | "yr";
type PlanKey = "plus" | "pro_employee" | "pro_split" | "premium";

const MONTHLY = { free: 0, plus: 6.99, pro: 29.99, premium: 59.99 } as const;

function fmtUSD(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

async function startCheckout(plan: PlanKey, cycle: Billing) {
  try {
    (window as any).__fwvSubmitting = true;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, cycle }),
    });
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : { error: await res.text() };
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || `Checkout failed (${res.status})`);
    }
    window.location.href = data.url as string;
  } catch (e: any) {
    alert(e?.message || "Could not start checkout. Please try again.");
  } finally {
    (window as any).__fwvSubmitting = false;
  }
}

const btnBase =
  "w-full rounded-xl px-4 py-3 font-semibold shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60";
// Use palettes defined in tailwind.config.ts (plum/aure), not brand-* aliases
const btnGold =
  `${btnBase} bg-aure-500 text-plum-900 hover:bg-aure-600 focus-visible:ring-aure-400/70`;
const btnPlum =
  `${btnBase} bg-plum-600 text-white hover:bg-plum-700 focus-visible:ring-plum-500/70 border border-plum-600`;
const btnNeutral =
  `${btnBase} bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-300`;

export default function PriceClient() {
  const [cycle, setCycle] = useState<Billing>("mo");
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/";
  const { data: session, status } = useSession();

  const prices = useMemo(
    () =>
      cycle === "mo"
        ? MONTHLY
        : {
          free: 0,
          plus: +(MONTHLY.plus * 12).toFixed(2),
          pro: +(MONTHLY.pro * 12).toFixed(2),
          premium: +(MONTHLY.premium * 12).toFixed(2),
        },
    [cycle]
  );

  const suffix = cycle === "mo" ? "/mo" : "/yr";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">
        Plans &amp; Pricing
      </h1>
      <p className="mt-2 text-gray-600">
        Pick the plan that fits today. You can always upgrade later.
      </p>

      {/* Billing toggle (visual) */}
      <div className="mt-5 flex items-center gap-2">
        <span className={`text-sm ${cycle === "mo" ? "font-semibold" : "text-gray-500"}`}>
          Monthly
        </span>
        <button
          type="button"
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
        <span className={`text-sm ${cycle === "yr" ? "font-semibold" : "text-gray-500"}`}>
          Yearly
        </span>
        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
          Yearly shows 12× monthly price
        </span>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Free */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
          <h3 className="text-lg font-semibold">Free</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.free)} <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>Access to free calculators</li>
            <li>Ads supported</li>
          </ul>
          <div className="mt-6">
            <button
              className={btnPlum}
              onClick={() => window.location.href = '/'}
            >
              Try Free Tools
            </button>
            <p className="mt-2 text-xs text-muted-foreground">Access the 7 free calculators</p>
          </div>
        </div>

        {/* Plus */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-brand-green/20 transition hover:shadow-lg hover:-translate-y-0.5">
          <h3 className="text-lg font-semibold">Plus</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.plus)} <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>Remove all ads</li>
            <li>
              Unlock <strong>Savings Growth</strong>
            </li>
            <li>
              Unlock <strong>Debt Payoff</strong>
            </li>
            <li>
              Unlock <strong>Split by Order (+ Shared Appetizers)</strong>
            </li>
            <li>
              Keep access to all <strong>7</strong> free calculators
            </li>
          </ul>
          <div className="mt-6">
            {session ? (
              <button
                className={btnPlum}
                data-plan="plus"
                onClick={() => startCheckout("plus", cycle)}
                aria-label="Upgrade to Plus"
              >
                Upgrade to Plus
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Sign in to upgrade your plan</p>
                <SignInButton />
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Remove ads & unlock Savings + Debt + Split by Order
            </p>
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
          <h3 className="text-lg font-semibold">Pro</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.pro)} <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>
              <strong>All Plus benefits</strong> (no ads + unlocked Plus calculators)
            </li>
            <li>
              Includes all <strong>7</strong> free calculators
            </li>
            <li className="mt-1">
              <strong>Choose 1 advanced calculator</strong>:
            </li>
            <li className="ml-4">• Employee Cost</li>
            <li className="ml-4">• Expense Split Deluxe</li>
          </ul>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <button
                  className={btnPlum}
                  data-plan="pro_employee"
                  onClick={() => startCheckout("pro_employee", cycle)}
                  aria-label="Choose Pro – Employee Cost"
                >
                  Choose Employee Cost
                </button>
                <button
                  className={btnPlum}
                  data-plan="pro_split"
                  onClick={() => startCheckout("pro_split", cycle)}
                  aria-label="Choose Pro – Expense Split Deluxe"
                >
                  Choose Expense Split Deluxe
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Sign in to upgrade your plan</p>
                <SignInButton />
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            All Free + Plus calculators included
          </p>
        </div>

        {/* Premium */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
          <h3 className="text-lg font-semibold">Premium</h3>
          <div className="mt-1 text-2xl font-bold">
            {fmtUSD(prices.premium)} <span className="text-base font-normal">{suffix}</span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            <li>
              <strong>All Pro &amp; Plus benefits</strong>
            </li>
            <li>
              Access to <strong>ALL</strong> calculators (Employee Cost + Expense Split Deluxe)
            </li>
            <li>
              Includes all <strong>7</strong> free calculators
            </li>
            <li>Priority support</li>
          </ul>
          <div className="mt-6">
            {session ? (
              <button
                className={btnPlum}
                data-plan="premium"
                onClick={() => startCheckout("premium", cycle)}
                aria-label="Join Premium"
              >
                Join Premium
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Sign in to upgrade your plan</p>
                <SignInButton />
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Full suite + priority support</p>
          </div>
        </div>
      </div>
    </main>
  );
}
