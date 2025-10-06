"use client";

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

type Props = {
  slot: string;
  enabled?: boolean;
  style?: CSSProperties;
  className?: string;
  format?: string;          // e.g. "auto"
  responsive?: boolean;     // data-full-width-responsive="true"
};

const CLIENT  = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const IS_PROD = process.env.NODE_ENV === "production";

export default function AdSlot({
  slot,
  enabled = true,
  style,
  className,
  format,
  responsive,
}: Props) {
  // <ins> is typed as HTMLModElement in lib.dom
  const ref = useRef<HTMLModElement | null>(null);
  const pathname = usePathname();

  // Force a fresh <ins> on route change
  const key = useMemo(() => `${slot}-${pathname}`, [slot, pathname]);

  // local guard so Strict/re-renders don't double-push
  const alreadyQueuedRef = useRef(false);

  useEffect(() => {
    if (!IS_PROD || !ENABLED || !CLIENT || !enabled || !slot) return;
    const el = ref.current as unknown as HTMLElement | null;
    if (!el) return;

    // If Google already touched this node, it will be 'reserved' then 'done'
    const status = el.getAttribute("data-adsbygoogle-status");
    if (status) return;

    // If we already queued once for this instance, stop
    if (alreadyQueuedRef.current || el.getAttribute("data-ad-init") === "1") return;

    // GLOBAL SAFETY: if there are no pending <ins> anywhere, skip push
    // (prevents "All 'ins' elements ... already have ads" TagError)
    const pending = document.querySelector(
      'ins.adsbygoogle:not([data-adsbygoogle-status]):not([data-ad-init="1"])'
    );
    if (!pending) return;

    try {
      // mark BEFORE pushing so a second pass won't re-queue
      alreadyQueuedRef.current = true;
      el.setAttribute("data-ad-init", "1");

      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch {
      /* ignore occasional hiccups */
    }
  }, [key, enabled, slot]);

  if (!IS_PROD || !ENABLED || !CLIENT || !enabled || !slot) return null;

  return (
    <ins
      key={key}
      ref={ref as any}
      className={`adsbygoogle ${className ?? ""}`}
      style={style ?? { display: "block" }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      {...(format ? { "data-ad-format": format } : {})}
      {...(responsive ? { "data-full-width-responsive": "true" } : {})}
    />
  );
}
