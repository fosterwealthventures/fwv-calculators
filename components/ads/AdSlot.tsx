"use client";

import { useEffect, useRef, useState } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient } from "./adEnv";

/**
 * Responsive AdSense slot that self-gates to Free plan only.
 */
export default function AdSlot({
  slot = "test-slot",
  calcId = "free:slot",
  style,
  className = "",
}: {
  slot?: string;
  calcId?: string;
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
          Array.isArray((window as any).adsbygoogle)
        ) {
          try {
            (window as any).adsbygoogle.push({});
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
    <AdGateFreeOnly calcId={calcId}>
      <div
        ref={ref}
        data-testid="ad-slot"
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
