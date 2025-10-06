// components/ads/GoogleAd.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Single ad unit:
 *  - Reserves visible space (so layout doesn't jump)
 *  - Pushes exactly once per <ins> node (even in React Strict Mode)
 *  - Retries a few times while the AdSense bootstrap finishes
 *  - Shows a friendly placeholder while loading/no-fill/dev
 */
type Props = {
  slot: string; // AdSense slot id
  width?: number; // px if not fullWidth
  height?: number; // min height in px (space reservation)
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidth?: boolean; // 100% width container
  className?: string; // extra classes for container
};

export default function GoogleAd({
  slot,
  width = 300,
  height = 250,
  format = "auto",
  fullWidth = true,
  className = "",
}: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  // Show test ads in dev automatically, or when explicitly toggled on
  const isTest = useMemo(
    () =>
      process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_ADSENSE_TEST === "on",
    [],
  );

  const insRef = useRef<HTMLModElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "rendered" | "error"
  >("idle");

  useEffect(() => {
    if (!client || !slot) return;
    if (!insRef.current) return;

    /** React 18 Strict Mode runs effects twice in dev.
     *  Mark the node as pushed so we never push twice to the same <ins>.
     */
    const node = insRef.current as any;
    if (node.__fwvPushed) {
      setStatus("rendered");
      return;
    }

    // Ensure script exists (in case the loader hasn't injected it yet)
    const ensureScript = () => {
      const id = "adsbygoogle-js";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.async = true;
        s.crossOrigin = "anonymous";
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          client,
        )}`;
        document.head.appendChild(s);
      }
    };

    const tryPush = (attempt = 0) => {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        node.__fwvPushed = true; // mark this <ins> as initialized
        setStatus("rendered");
      } catch {
        if (attempt < 10) {
          setStatus("loading");
          setTimeout(() => tryPush(attempt + 1), 400);
        } else {
          setStatus("error");
        }
      }
    };

    ensureScript();
    tryPush(0);
  }, [client, slot]);

  // If no client id, render nothing (avoids console noise in local dev)
  if (!client) return null;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: fullWidth ? "100%" : width,
        minHeight: height, // reserve space so the box is visible even pre-fill
      }}
    >
      {/* Real AdSense tag */}
      <ins
        ref={insRef as any}
        className="adsbygoogle block"
        style={{ display: "block", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
        {...(isTest ? { "data-adtest": "on" } : {})}
      />

      {/* Dev/No-fill placeholder overlay */}
      {status !== "rendered" && (
        <div
          className="absolute inset-0 grid place-items-center rounded-lg"
          style={{
            border: "1px dashed #d1d5db",
            background:
              status === "error"
                ? "repeating-linear-gradient(45deg, #fff, #fff 10px, #f9fafb 10px, #f9fafb 20px)"
                : "#fff",
          }}
        >
          <div className="text-[11px] px-2 py-1 text-gray-600 text-center leading-snug">
            {status === "error"
              ? "Ad could not load (adblock/no-fill)."
              : "Loading ad…"}
            <br />
            <span className="text-gray-400">
              slot={slot} {isTest ? "• test on" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
