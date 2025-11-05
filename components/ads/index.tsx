"use client";
// components/ads/index.tsx
// Ad components for Adsterra native banners

import { useIsPaidContext } from "@/adHooks";
import { useEntitlements } from "@/lib/entitlements-client";
import * as React from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT;
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

function hasAdsConsentCookie() {
  if (typeof document === "undefined") return false;
  try {
    return /(?:^|; )fwv_cmp_ads=1(?:;|$)/.test(document.cookie);
  } catch {
    return false;
  }
}

export function AdInContent() {
  const isPaidContext = useIsPaidContext();
  const { planId, hydrated } = useEntitlements();

  // Hide ads for any paid subscriber or paid context
  if (!hydrated) return null; // avoid flicker until we know plan
  if (planId !== "free" || isPaidContext) return null;
  if (!ADS_ENABLED || !AD_CLIENT) return null;

  // Load Adsterra script and render container
  React.useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = '//pl27994832.effectivegatecpm.com/1ae6deb893d2fba7115c6c32ef705246/invoke.js'

    const container = document.getElementById('container-1ae6deb893d2fba7115c6c32ef705246')
    if (container && !container.querySelector('script')) {
      container.appendChild(script)
    }
  }, [])

  return (
    <div className="adsterra-native-banner" style={{ textAlign: "center", margin: "16px 0" }}>
      <div id="container-1ae6deb893d2fba7115c6c32ef705246"></div>
    </div>
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
