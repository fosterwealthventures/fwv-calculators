"use client";

import { useEffect, useRef } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient } from "./adEnv";

export default function AdBannerTop() {
  const insRef = useRef<HTMLModElement | null>(null);
  const client = getAdsClient();

  useEffect(() => {
    if (!client || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* ignore */ }
  }, [client]);

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
          data-ad-slot="0000000000"   // <- replace with your real slot id
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle=window.adsbygoogle||[]).push({});` }} />
      </div>
    </AdGateFreeOnly>
  );
}
