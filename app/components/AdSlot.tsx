// app/components/AdSlot.tsx
"use client";

import React, { useEffect } from "react";

type Props = {
  slot: string;
  format?: string; // e.g., 'auto'
  layout?: string; // e.g., 'in-article', 'fluid' etc (if you use it)
  layoutKey?: string; // e.g., '-fw-1+5-3d-1e'
  style?: React.CSSProperties;
  placeholder?: React.ReactNode;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  style,
  placeholder,
}: Props) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;
  const canShowAds =
    typeof window !== "undefined" && !!client && process.env.NODE_ENV === "production";

  // Only try to push ads when we can (client + production)
  useEffect(() => {
    if (!canShowAds) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // swallow errors; keep page stable
    }
  }, [canShowAds, slot]);

  // Dev or missing client → show placeholder so pages don’t break
  if (!canShowAds) {
    return (
      <div
        data-ad-slot={slot}
        style={style}
        className="flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-500"
      >
        {placeholder ?? `Ad Placeholder (${slot})`}
      </div>
    );
  }

  // Production + client present → render the <ins> tag
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", ...style }}
      data-ad-client={`ca-${client}`}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
