"use client";

import { useEffect, useRef, useState } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient } from "./adEnv";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Responsive AdSense slot that self-gates to Free plan only.
 */
export default function AdSlot({
  slot = "test-slot",
  style,
  className = "",
}: {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const pushedRef = useRef(false);
  const client = getAdsClient();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPush = () => {
      const width = el.getBoundingClientRect().width;
      if (width && width > 0) {
        setReady(true);
        if (
          !pushedRef.current &&
          typeof window !== "undefined" &&
          Array.isArray(window.adsbygoogle)
        ) {
          try {
            window.adsbygoogle.push({});
            pushedRef.current = true;
          } catch {
            /* noop */
          }
        }
      }
    };

    tryPush();
    const ro = new ResizeObserver(tryPush);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <AdGateFreeOnly>
      <div
        ref={ref}
        className={className}
        style={{
          minHeight: 120,
          width: "100%",
          display: "block",
          ...style,
        }}
      >
        {ready ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 120 }}
            data-ad-client={client || "ca-pub-0000000000000000"}
            data-ad-slot={slot}
            data-full-width-responsive="true"
          />
        ) : null}
      </div>
    </AdGateFreeOnly>
  );
}
