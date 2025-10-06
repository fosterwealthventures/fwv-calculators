"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdSlot({ slot, className = "", style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const pushedRef = useRef(false);

  const isProd = process.env.NODE_ENV === "production";
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const canShow = isProd && enabled && !!client;

  // Determine if this is a fixed-size ad or responsive
  const isFixedSize = style?.width && style?.height;
  const isSidebarAd = slot === process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 || 
                     slot === process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!canShow || !mounted || !containerRef.current || pushedRef.current) return;

    const el = containerRef.current;
    
    // Check if this specific slot has already been processed
    const insElement = el.querySelector('.adsbygoogle') as HTMLElement;
    if (insElement?.getAttribute('data-adsbygoogle-status') === 'done') {
      pushedRef.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || pushedRef.current) return;
        try {
          const w = window as any;
          // Only push if not already marked
          if (!insElement?.getAttribute('data-adsbygoogle-status')) {
            w.adsbygoogle = w.adsbygoogle || [];
            (function(){
  const list = Array.from(document.querySelectorAll('ins.adsbygoogle')) as HTMLElement[];
  const hasPending = list.some(n => n.getAttribute('data-adsbygoogle-status') !== 'done');
  if (hasPending) {
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.push({});
  }
})();
            pushedRef.current = true;
          }
          io.disconnect();
        } catch {
          /* swallow errors */
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [canShow, mounted, slot]);

  if (!canShow) {
    if (!isProd) {
      return (
        <div
          className={`rounded-md border border-dashed p-4 text-center text-xs text-gray-500 ${className}`}
          style={{ 
            minHeight: isFixedSize ? undefined : 120, 
            ...(style || {}) 
          }}
        >
          (Ad placeholder) Slot: {slot}
          {isFixedSize && (
            <div className="text-gray-400 mt-1">
              Fixed: {style?.width} × {style?.height}
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        display: "block", 
        ...(isFixedSize ? { 
          width: style.width, 
          height: style.height,
          margin: '0 auto' // Center fixed-size ads
        } : { 
          width: "100%" 
        }),
        ...(style || {})
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: isFixedSize ? "inline-block" : "block", 
          width: isFixedSize ? style.width : "100%",
          height: isFixedSize ? style.height : "auto",
          minHeight: isFixedSize ? undefined : 120
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={isFixedSize ? undefined : "auto"}
        data-full-width-responsive={isFixedSize ? "false" : "true"}
      />
    </div>
  );
}