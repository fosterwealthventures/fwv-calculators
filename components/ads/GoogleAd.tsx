// components/ads/GoogleAd.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  slot: string;
  width?: number;
  height?: number;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidth?: boolean;
  className?: string;
  placeholder?: React.ReactNode;
};

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/**
 * IMPORTANT: This component does NOT inject the AdSense bootstrap script.
 * Load it once globally (e.g., in ClientAdsLoader or app/layout.tsx).
 * This component only initializes its own <ins> once when visible.
 */
export default function GoogleAd({
  slot,
  width,
  height = 250,
  format = "auto",
  fullWidth = true,
  className = "",
  placeholder,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "rendered" | "error">("idle");

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADS_ENABLED || !CLIENT || !slot) return;
    if (!wrapperRef.current) return;

    const node = insRef.current as unknown as (HTMLElement & { __fwvPushed?: boolean }) | null;
    if (!node) return;

    const observe = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (!isVisible) return;
        // Try to init once visible
        initOnce(node);
      },
      { rootMargin: "200px 0px" }
    );
    observe.observe(node);

    return () => observe.disconnect();
  }, [slot]);

  function initOnce(node: HTMLElement & { __fwvPushed?: boolean }, attempt = 0) {
    if (pushedRef.current || node.__fwvPushed) return;
    const already = node.getAttribute("data-adsbygoogle-status") === "done";
    if (already) {
      pushedRef.current = true;
      node.__fwvPushed = true;
      setStatus("rendered");
      return;
    }

    // Wait until the bootstrap created window.adsbygoogle
    const w = window as any;
    if (!w.adsbygoogle) {
      if (attempt < 20) {
        setStatus("loading");
        setTimeout(() => initOnce(node, attempt + 1), 250);
      } else {
        setStatus("error");
      }
      return;
    }

    try {
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushedRef.current = true;
      node.__fwvPushed = true;
      setStatus("rendered");
    } catch {
      if (attempt < 10) {
        setStatus("loading");
        setTimeout(() => initOnce(node, attempt + 1), 300);
      } else {
        setStatus("error");
      }
    }
  }

  const style: React.CSSProperties = fullWidth
    ? { display: "block", minHeight: `${height}px` }
    : { display: "inline-block", width, height };

  // Reserve space to avoid layout shift
  return (
    <div ref={wrapperRef} className={className} aria-label="Ad placeholder">
      {(!ADS_ENABLED || !CLIENT || process.env.NODE_ENV !== "production") && (
        <div
          className="grid place-items-center rounded-lg border border-dashed border-gray-300 bg-white text-[11px] text-gray-600"
          style={{ minHeight: `${height}px` }}
        >
          {placeholder ?? "Ad placeholder"}
        </div>
      )}
      {ADS_ENABLED && CLIENT && process.env.NODE_ENV === "production" && (
        <ins
          ref={insRef as any}
          className="adsbygoogle"
          style={style as any}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidth ? "true" : "false"}
        />
      )}
    </div>
  );
}
