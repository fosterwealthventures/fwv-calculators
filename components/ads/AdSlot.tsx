"use client";

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

type Props = {
  slot: string;
  enabled?: boolean;                 // gate from parent (plan, etc.)
  style?: CSSProperties;
  className?: string;
  format?: string;                   // e.g. "auto"
  responsive?: boolean;              // sets data-full-width-responsive="true"
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
  // <ins> is typed as HTMLModElement in the DOM lib
  const ref = useRef<HTMLModElement | null>(null);
  const pathname = usePathname();

  // fresh <ins> per route so we never push into an already-"done" node
  const key = useMemo(() => `${slot}-${pathname}`, [slot, pathname]);

  useEffect(() => {
    if (!IS_PROD || !ENABLED || !CLIENT || !enabled || !slot || !ref.current) return;

    const el = ref.current as unknown as HTMLElement;
    // If this node already has an ad, don't push again
    if (el.getAttribute("data-adsbygoogle-status") === "done") return;

    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch {
      // swallow occasional dev/strict hiccups
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
