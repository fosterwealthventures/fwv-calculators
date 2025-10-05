"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Numeric slot id from AdSense UI */
  slot: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Safe AdSense slot:
 * - no global type redeclare (avoids conflict with ad.d.ts)
 * - waits for hydration and viewport before push
 * - pushes exactly once
 * - no-op in dev or when ads are disabled
 */
export default function AdSlot({ slot, className = "", style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const pushedRef = useRef(false);

  const isProd = process.env.NODE_ENV === "production";
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const canShow = isProd && enabled && !!client;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!canShow || !mounted || !containerRef.current || !insRef.current || pushedRef.current) return;

    const el = containerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || pushedRef.current) return;
        try {
          const w = window as any;                 // ⬅ use any, no global redeclare
          w.adsbygoogle = w.adsbygoogle || [];
          w.adsbygoogle.push({});
          pushedRef.current = true;
          io.disconnect();
        } catch {
          /* swallow errors (e.g., ad blockers) */
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [canShow, mounted]);

  if (!canShow) {
    // Dev placeholder to visualize layout
    if (!isProd) {
      return (
        <div
          className={`rounded-md border border-dashed p-4 text-center text-xs text-gray-500 ${className}`}
          style={{ minHeight: 120, ...(style || {}) }}
        >
          (Ad placeholder) Set NEXT_PUBLIC_ADSENSE_CLIENT and NEXT_PUBLIC_ADSENSE_ENABLED=true
        </div>
      );
    }
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "block", width: "100%", ...(style || {}) }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 120 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </div>
  );
}
