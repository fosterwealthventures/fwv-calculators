// app/upgrade/upgrade-client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  calc: string | null; // e.g. "employee-cost" or "expense-split-deluxe" or null
  redirect: string; // where to go after selecting
};

function setPlan(plan: "free" | "plus" | "pro" | "premium") {
  try {
    localStorage.setItem("fwv.planId", plan);
    localStorage.setItem("fwv-plan", plan);
    document.cookie = `fwv_plan=${plan}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // no-op (intentionally ignoring errors in upgrade flow)
  }
}

function lockProChoiceIfProvided(calc: string | null) {
  if (!calc) return;
  const map: Record<string, "employee_cost" | "expense_split" | undefined> = {
    "employee-cost": "employee_cost",
    "expense-split-deluxe": "expense_split",
  };
  const choice = map[calc];
  if (choice) {
    try {
      localStorage.setItem("fwv.selectChoice", JSON.stringify(choice));
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
  }
}

export default function UpgradeClient({ calc, redirect }: Props) {
  const router = useRouter();

  const go = (
    plan: "free" | "plus" | "pro" | "premium",
    lockChoice?: string | null,
  ) => {
    setPlan(plan);
    if (plan === "pro") lockProChoiceIfProvided(lockChoice ?? calc);
    router.replace(redirect || "/dashboard");
  };

  // If user arrived with a plan already in the query, you *could* auto-apply here.
  useEffect(() => {
    // no-op (explicit buttons below)
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="heading-hero">Upgrade</h1>
      <p className="text-gray-600">
        Pick a plan to unlock more calculators. Your selection takes effect
        immediately on this device.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          className="rounded-2xl border bg-white p-5 text-left hover:shadow-sm"
          onClick={() => go("plus")}
        >
          <h3 className="text-lg font-semibold">Plus</h3>
          <p className="mt-1 text-sm text-gray-600">
            Remove ads. Unlock Savings &amp; Debt calculators.
          </p>
        </button>

        <button
          className="rounded-2xl border bg-white p-5 text-left hover:shadow-sm"
          onClick={() => go("premium")}
        >
          <h3 className="text-lg font-semibold">Premium</h3>
          <p className="mt-1 text-sm text-gray-600">
            Everything in Pro + both advanced calculators.
          </p>
        </button>

        <button
          className="rounded-2xl border bg-white p-5 text-left hover:shadow-sm"
          onClick={() => go("pro", calc)}
        >
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="mt-1 text-sm text-gray-600">
            Choose 1 advanced calculator ({calc ?? "you'll pick on first open"}
            ).
          </p>
        </button>

        <button
          className="rounded-2xl border bg-white p-5 text-left hover:shadow-sm"
          onClick={() => go("free")}
        >
          <h3 className="text-lg font-semibold">Stay Free</h3>
          <p className="mt-1 text-sm text-gray-600">
            Keep using the free calculators.
          </p>
        </button>
      </div>
    </main>
  );
}
