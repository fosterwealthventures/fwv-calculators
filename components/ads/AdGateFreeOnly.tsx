// components/ads/AdGateFreeOnly.tsx
"use client";

import React from "react";
import { usePlan } from "@/providers/PlanProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { ADS_ENABLED } from "./adEnv";

const PAID_GUIDE_SLUGS = new Set([
  "savings-growth",
  "debt-payoff",
  "employee-cost",
  "expense-split-deluxe",
]);
const PAID_CALC_SLUGS = new Set([
  "savings",
  "debt",
  "employee",
  "expense-split-deluxe",
]); // update if your internal calc keys differ

function useIsPaidContext() {
  const pathname = usePathname();
  const qp = useSearchParams();
  const calc = qp?.get("calc");
  if (calc && PAID_CALC_SLUGS.has(calc)) return true;
  if (pathname?.startsWith("/guide/")) {
    const slug = pathname.split("/")[2] || "";
    if (PAID_GUIDE_SLUGS.has(slug)) return true;
  }
  return false;
}

export type AdGateFreeOnlyProps = {
  children: React.ReactNode;
  /** Preferred prop */
  calcId?: string;
  /** @deprecated use `calcId` instead; kept for backward compatibility */
  calcd?: string;
};

export default function AdGateFreeOnly({
  children,
  calcId: _calcId,
  calcd: _calcd,
}: AdGateFreeOnlyProps) {
  const isPaid = useIsPaidContext();
  const { showAds } = usePlan();

  if (!ADS_ENABLED || isPaid) return null;
  if (!showAds) return null; // hide ads for Plus/Pro/Premium

  return <>{children}</>;
}
