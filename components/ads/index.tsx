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

  // Debug logging
  React.useEffect(() => {
    console.log('AdInContent Debug:', {
      hydrated,
      planId,
      isPaidContext,
      ADS_ENABLED,
      AD_CLIENT,
      hasAdsConsent: hasAdsConsentCookie(),
      cookies: document.cookie
    });
  }, [hydrated, planId, isPaidContext]);

  // Hide ads for any paid subscriber or paid context
  if (!hydrated) {
    console.log('AdInContent: Not hydrated yet');
    return null; // avoid flicker until we know plan
  }
  if (planId !== "free") {
    console.log('AdInContent: Not free plan, planId =', planId);
    return null;
  }
  if (isPaidContext) {
    console.log('AdInContent: In paid context');
    return null;
  }
  if (!ADS_ENABLED) {
    console.log('AdInContent: Ads not enabled');
    return null;
  }
  if (!AD_CLIENT) {
    console.log('AdInContent: No ad client configured');
    return null;
  }
  if (!hasAdsConsentCookie()) {
    console.log('AdInContent: No ads consent cookie');
    return null;
  }

  // Load Adsterra script and render container
  React.useEffect(() => {
    console.log('AdInContent: Loading ad script');
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = '//pl27994832.effectivegatecpm.com/1ae6deb893d2fba7115c6c32ef705246/invoke.js'

    const container = document.getElementById('container-1ae6deb893d2fba7115c6c32ef705246')
    if (container && !container.querySelector('script')) {
      console.log('AdInContent: Appending script to container');
      container.appendChild(script)
    } else {
      console.log('AdInContent: Container not found or script already exists');
    }
  }, [])

  return (
    <div className="adsterra-native-banner" style={{ textAlign: "center", margin: "16px 0", border: "1px dashed #ccc", padding: "10px" }}>
      <div id="container-1ae6deb893d2fba7115c6c32ef705246">Ad container - ads should appear here</div>
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
