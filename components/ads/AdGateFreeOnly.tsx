// components/ads/AdGateFreeOnly.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";

/**
 * Client-side gate:
 * - Reads a cookie "plan" (free|plus|pro|premium)
 * - Only renders children for "free"
 * - If no cookie is present, default to "free" (ads show to unknown visitors)
 *
 * If you have an auth/provider, replace this with your real session/plan lookup.
 */
function getPlanFromCookie(): "free" | "plus" | "pro" | "premium" {
  if (typeof document === "undefined") return "free";
  const m = document.cookie.match(/(?:^|;\s*)plan=(free|plus|pro|premium)\b/i);
  return m ? (m[1].toLowerCase() as any) : "free";
}

export default function AdGateFreeOnly({ children }: { children: ReactNode }) {
  const [plan, setPlan] =
    useState<"free" | "plus" | "pro" | "premium">(getPlanFromCookie());

  useEffect(() => {
    // re-check in case cookie changes after hydration (e.g., user logs in/upgrades)
    const current = getPlanFromCookie();
    if (current !== plan) setPlan(current);
  }, [plan]);

  if (plan !== "free") return null;
  return <>{children}</>;
}
