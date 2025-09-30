"use client";

import { useEffect, useRef } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient, getFooterSlot } from "./adEnv";

type Props = { slot?: string; className?: string };

export default function AdFooter({ slot, className = "" }: Props) {
  const pushedRef = useRef(false);
  const client = getAdsClient();
  const adSlot = slot ?? getFooterSlot();

  useEffect(() => {
    if (!client || !adSlot) return;
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [client, adSlot]);

  const wrapper = `mt-8 flex justify-center ${className}`;

  return (
    <AdGateFreeOnly>
      {!client || !adSlot ? (
        <div className={wrapper} aria-label="Ad placeholder">
          <div
            className="w-full max-w-6xl rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 text-center shadow-sm"
            style={{ minHeight: 120 }}
          >
            <div className="text-sm text-gray-500">
              Footer ad space — set your AdSense env vars.
            </div>
          </div>
        </div>
      ) : (
        <div className={wrapper}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center", minHeight: 120 }}
            data-ad-client={client}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}
    </AdGateFreeOnly>
  );
}
