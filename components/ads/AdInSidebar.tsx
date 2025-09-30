"use client";

import { useEffect, useRef } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient } from "./adEnv";

type Props = {
  width?: number;
  height?: number;
  slot?: string;
  className?: string;
};

export default function AdInSidebar({
  width = 300,
  height = 600,
  slot,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const client = getAdsClient();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!client || !slot) return;

    const el = ref.current?.querySelector(
      "ins.adsbygoogle",
    ) as HTMLElement | null;
    if (!el) return;

    try {
      const status = el.getAttribute("data-ad-status");
      if (!status) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch {
      /* noop */
    }
  }, [client, slot, width, height]);

  const Placeholder = (
    <div
      className={`rounded-xl border bg-white p-4 text-sm text-gray-500 ${className}`}
      style={{ width, height }}
    >
      Ad (sidebar {width}×{height})
    </div>
  );

  return (
    <AdGateFreeOnly>
      {process.env.NODE_ENV !== "production" || !client || !slot ? (
        <div ref={ref}>{Placeholder}</div>
      ) : (
        <div ref={ref} className={className}>
          <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width, height }}
            data-ad-client={client}
            data-ad-slot={slot}
          />
        </div>
      )}
    </AdGateFreeOnly>
  );
}
