// components/ads/AdGateFreeOnly.tsx
"use client";

import React from "react";
import { usePlan } from "@/providers/PlanProvider";

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
  // PlanProvider exposes a boolean `showAds` (true only on Free)
  const { showAds } = usePlan();

  if (!showAds) return null; // hide ads for Plus/Pro/Premium

  return <>{children}</>;
}
