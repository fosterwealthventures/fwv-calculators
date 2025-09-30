"use client";

import { useEffect, useRef } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient, getInContentSlot } from "./adEnv";

type Props = { slot?: string; className?: string };

export default function AdInContent({ slot, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const client = getAdsClient();
  const adSlot = slot ?? getInContentSlot();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!client || !adSlot) return;

    const el = ref.current?.querySelector(
      "ins.adsbygoogle",
    ) as HTMLElement | null;
    if (!el) return;

    // Only push once per mount if not already initialized
    try {
      const status = el.getAttribute("data-ad-status");
      if (!status) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch {
      /* noop */
    }
  }, [client, adSlot]);

  const Placeholder = (
    <div
      className={`rounded-xl border bg-white p-4 text-sm text-gray-500 ${className}`}
    >
      Ad (in-content)
    </div>
  );

  return (
    <AdGateFreeOnly>
      {process.env.NODE_ENV !== "production" || !client || !adSlot ? (
        <div ref={ref}>{Placeholder}</div>
      ) : (
        <div ref={ref} className={className}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={client}
            data-ad-slot={adSlot}
            data-full-width-responsive="true"
          />
        </div>
      )}
    </AdGateFreeOnly>
  );
}
