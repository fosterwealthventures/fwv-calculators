"use client";
// components/ads/index.tsx
// Native banner loader with client-side reload on route changes

import { useIsPaidContext } from "@/adHooks";
import { useEntitlements } from "@/lib/entitlements-client";
import { usePathname } from "next/navigation";
import * as React from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT;
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
const AD_BASE = "//pl27994832.effectivegatecpm.com";

function queryParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

function hasAdsConsentCookie() {
  if (typeof document === "undefined") return false;
  try {
    return /(?:^|; )fwv_cmp_ads=1(?:;|$)/.test(document.cookie);
  } catch {
    return false;
  }
}

function appendAdScript(containerId: string) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;
    // If the network exposes reload() on the container, prefer that
    const maybeReload = (container as any).reload;
    if (typeof maybeReload === "function") {
      try {
        maybeReload();
        return; // reloaded successfully
      } catch {}
    }

    // Fallback: re-append the invoke script
    Array.from(container.querySelectorAll("script")).forEach((s) => s.remove());
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `${AD_BASE}/${AD_CLIENT}/invoke.js`;
    container.appendChild(script);
  } catch (e) {
    console.error("AdInContent appendAdScript error", e);
  }
}

export function AdInContent() {
  const isPaidContext = useIsPaidContext();
  const { planId, hydrated } = useEntitlements();
  const pathname = usePathname();

  const containerId = React.useMemo(() => `container-${AD_CLIENT}`, []);

  // Eligibility checks
  if (!hydrated) return null; // avoid flicker until we know plan
  if (planId !== "free") return null; // no ads for paid plans
  if (isPaidContext) return null; // suppress ads on paid-context pages
  if (!ADS_ENABLED) return null;
  // Query kill switch: ?ads=0 or ?noads=1
  const qpAds = queryParam("ads");
  const qpNoAds = queryParam("noads");
  if (qpAds === "0" || qpNoAds === "1") return null;
  if (!AD_CLIENT) return null;
  if (!hasAdsConsentCookie()) return null;

  // Initial mount: ensure a script is present
  React.useEffect(() => {
    const container = document.getElementById(containerId);
    if (container && !container.querySelector("script")) {
      appendAdScript(containerId);
    }
  }, [containerId]);

  // Client-side navigation: ask the container to reload or re-append the script
  React.useEffect(() => {
    if (!pathname) return;
    appendAdScript(containerId);
  }, [pathname, containerId]);

  return (
    <div
      className="adsterra-native-banner"
      style={{ textAlign: "center", margin: "16px 0", border: "1px dashed #ccc", padding: "10px" }}
    >
      <div id={containerId}>Ad container - ads should appear here</div>
    </div>
  );
}

export function AdBannerTop() {
  return null;
}
export function AdFooter() {
  return null;
}

export function AdGateFreeOnly({ children }: { children?: React.ReactNode }) {
  const isPaidContext = useIsPaidContext();
  const { planId, hydrated } = useEntitlements();
  if (!hydrated) return null;
  if (planId !== "free" || isPaidContext) return null;
  return <>{children}</>;
}

// Simple error boundary to prevent a bad ad load from crashing the app UI
class AdErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.error("Ad component crashed", err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children as any;
  }
}

// Guarded export for use in layout/pages
export function AdInContentSafe() {
  return (
    <AdErrorBoundary>
      <AdInContent />
    </AdErrorBoundary>
  );
}

export default {};
