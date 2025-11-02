"use client";
// components/ads/index.tsx
// Lightweight AdSense components. Requires a valid AdSense client and slot.

import * as React from "react";
import { useIsPaidContext } from "@/adHooks";
import { useEntitlements } from "@/lib/entitlements-client";

function useAdsensePush() {
  React.useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const INCONTENT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT;
const INCONTENT_FORMAT = process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_FORMAT || "auto"; // "auto" or "fluid"
const INCONTENT_LAYOUT = process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_LAYOUT; // e.g., "in-article" when format = fluid

export function AdInContent() {
  const isPaidContext = useIsPaidContext();
  const { planId, hydrated } = useEntitlements();
  // Hide ads for any paid subscriber or paid context
  if (!hydrated) return null; // avoid flicker until we know plan
  if (planId !== "free" || isPaidContext) return null;
  useAdsensePush();
  if (!AD_CLIENT || !INCONTENT_SLOT) {
    // Render nothing if not configured; avoids validation errors during build.
    return null;
  }
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "16px 0" }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={INCONTENT_SLOT}
      data-ad-format={INCONTENT_FORMAT}
      data-ad-layout={INCONTENT_LAYOUT}
      data-full-width-responsive="true"
    />
  );
}

export function AdBannerTop() { return null; }
export function AdFooter() { return null; }

export function AdGateFreeOnly({ children }: { children?: React.ReactNode }) {
  const isPaidContext = useIsPaidContext();
  const { planId, hydrated } = useEntitlements();
  if (!hydrated) return null;
  if (planId !== "free" || isPaidContext) return null;
  return <>{children}</>;
}

export default {};
