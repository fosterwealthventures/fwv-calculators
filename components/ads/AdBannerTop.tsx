// components/ads/AdBannerTop.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient, ADS_ENABLED } from "./adEnv";

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

export default function AdBannerTop() {
  const isPaid = useIsPaidContext();
  const insRef = useRef<HTMLModElement | null>(null);
  const client = getAdsClient();

  useEffect(() => {
    if (!client || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore adblock/no-fill */
    }
  }, [client]);

  if (!ADS_ENABLED || isPaid) return null;

  return (
    <AdGateFreeOnly>
      <div className="my-2 flex w-full justify-center">
        {!client && (
          <div className="flex h-24 w-full max-w-5xl items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 text-sm text-gray-500">
            Ad banner (shows after AdSense approval)
          </div>
        )}
        <ins
          ref={insRef as any}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={client || ""}
          data-ad-slot="0000000000" // ← replace with real slot id
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(adsbygoogle=window.adsbygoogle||[]).push({});`,
          }}
        />
      </div>
    </AdGateFreeOnly>
  );
}
