// components/ads/AdSlot.tsx
'use client';

import React, { useEffect, useRef } from 'react';

type AdSlotProps = {
  // Support both new and legacy prop names
  slotId?: string;
  slot?: string;

  className?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle' | string;
  layout?: string;
  layoutKey?: string;
  adTest?: boolean;

  // new + legacy aliases
  fullWidthResponsive?: boolean;
  responsive?: boolean;

  // legacy control
  enabled?: boolean;

  // render above-the-fold without IO wait
  eager?: boolean;
};

export default function AdSlot({
  slotId: slotIdProp,
  slot: slotLegacy,
  className,
  style,
  format = 'auto',
  layout,
  layoutKey,
  adTest,
  fullWidthResponsive,
  responsive,
  enabled = true,
  eager = false,
}: AdSlotProps) {
  const slotId = slotIdProp ?? slotLegacy;
  const fwr = fullWidthResponsive ?? responsive ?? true;

  const insRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adTestEnv = process.env.NEXT_PUBLIC_ADSENSE_ADTEST === 'on';
  const adTestEffective = adTest ?? adTestEnv;

  useEffect(() => {
    if (!enabled) return;
    const ins = insRef.current;
    if (!ins || !client || !slotId) return;

    const already =
      ins.getAttribute('data-adsbygoogle-status') === 'done' ||
      ins.getAttribute('data-adsbygoogle-status') === 'bound' ||
      pushedRef.current;

    if (already) return;

    const tryPush = () => {
      const w = window as any;
      if (!w.adsbygoogle) return;

      const nowInit =
        ins.getAttribute('data-adsbygoogle-status') === 'done' ||
        ins.getAttribute('data-adsbygoogle-status') === 'bound';
      if (nowInit || pushedRef.current) return;

      // Only push if at least one pending <ins> exists; avoids TagError.
      const pending = document.querySelector('ins.adsbygoogle:not([data-adsbygoogle-status])');
      if (!pending) return;

      try {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
        ins.setAttribute('data-adsbygoogle-status', 'bound');
        pushedRef.current = true;
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (!msg.includes("All 'ins' elements in the DOM with class=adsbygoogle already have ads in them")) {
          console.warn('[AdSlot] push error', err);
        }
      }
    };

    if (eager) {
      if (!(window as any).adsbygoogle) {
        const id = window.setInterval(() => {
          if ((window as any).adsbygoogle) {
            window.clearInterval(id);
            tryPush();
          }
        }, 300);
        return () => clearInterval(id);
      }
      tryPush();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) tryPush();
      },
      { rootMargin: '200px' }
    );
    io.observe(ins);

    let id: number | undefined;
    if (!(window as any).adsbygoogle) {
      id = window.setInterval(() => {
        if ((window as any).adsbygoogle) {
          window.clearInterval(id);
          tryPush();
        }
      }, 300);
    }

    return () => {
      io.disconnect();
      if (id) window.clearInterval(id);
    };
  }, [client, slotId, enabled, eager]);

  if (!enabled) return null;

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className ?? ''}`}
      style={style ?? { display: 'block' }}
      data-ad-client={client ?? ''}
      data-ad-slot={slotId ?? ''}
      data-ad-format={format}
      data-full-width-responsive={fwr ? 'true' : 'false'}
      {...(layout ? { 'data-ad-layout': layout } : null)}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : null)}
      {...(adTestEffective ? { 'data-adtest': 'on' } : null)}
    />
  );
}
