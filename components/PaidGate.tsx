// components/PaidGate.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plan, hasAccess, prettyPlan } from "@/lib/plan";

function getPlanClient(): Plan {
  try {
    if (typeof window === "undefined") return "free";

    // URL query (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlan = urlParams.get("plan") as Plan;
    if (urlPlan && ["free", "plus", "pro", "premium"].includes(urlPlan))
      return urlPlan;

    // localStorage
    const lsPlan = localStorage.getItem("fwv-plan") as Plan;
    if (lsPlan && ["free", "plus", "pro", "premium"].includes(lsPlan))
      return lsPlan;

    // cookie
    const cookieMatch = document.cookie.match(/(?:^|; )fwv_plan=([^;]*)/);
    const cookiePlan = cookieMatch
      ? (decodeURIComponent(cookieMatch[1]) as Plan)
      : null;
    if (cookiePlan && ["free", "plus", "pro", "premium"].includes(cookiePlan))
      return cookiePlan;
  } catch {}
  return "free";
}

export default function PaidGate({
  required,
  calc,
  children,
}: {
  required: "plus" | "pro" | "premium";
  calc?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    setMounted(true);
    setPlan(getPlanClient());
  }, []);

  const allowed = hasAccess(plan, required);

  if (!mounted) return <div className="p-4 text-center">Loading...</div>;
  if (allowed) return <>{children}</>;

  const dest =
    `/pricing?required=${required}` +
    (calc ? `&calc=${encodeURIComponent(calc)}` : "");

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30">{children}</div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg max-w-md mx-4">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {prettyPlan(required)} Feature
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This calculator requires a {prettyPlan(required)} plan.
          </p>
          <Link
            href={dest}
            className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Upgrade to {prettyPlan(required)}
          </Link>
          {required === "plus" && (
            <p className="mt-3 text-xs text-gray-500">
              Plus removes ads and unlocks Savings & Debt calculators
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
