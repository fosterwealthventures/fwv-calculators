// components/ads/AdSlot.tsx
'use client';

import React, { useEffect, useRef } from 'react';

type AdSlotProps = {
  slotId?: string;
  slot?: string;
  className?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle' | string;
  layout?: string;
  layoutKey?: string;
  adTest?: boolean;
  fullWidthResponsive?: boolean;
  responsive?: boolean;
  enabled?: boolean;
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Define config directly in component
  const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  const ADS_ADTEST = process.env.NEXT_PUBLIC_ADSENSE_ADTEST === 'on';
  const adTestEffective = adTest ?? ADS_ADTEST;

  useEffect(() => {
    if (!enabled) return;
    const ins = insRef.current;
    if (!ins || !ADS_CLIENT || !slotId) return;

    // Check if already processed
    const status = ins.getAttribute('data-adsbygoogle-status');
    if (status === 'done' || status === 'bound' || pushedRef.current) {
      return;
    }

    const tryPush = () => {
      if (pushedRef.current) return;
      
      const w = window as any;
      if (!w.adsbygoogle) return;

      // Final check before pushing
      const currentStatus = ins.getAttribute('data-adsbygoogle-status');
      if (currentStatus === 'done' || currentStatus === 'bound') {
        pushedRef.current = true;
        return;
      }

      try {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
        ins.setAttribute('data-adsbygoogle-status', 'bound');
        pushedRef.current = true;
        
        // Clean up observer if exists
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      } catch (err: any) {
        console.warn('[AdSlot] Push error:', err);
      }
    };

    if (eager) {
      // For eager loading, wait for adsbygoogle to be available
      if (!(window as any).adsbygoogle) {
        const id = window.setInterval(() => {
          if ((window as any).adsbygoogle) {
            window.clearInterval(id);
            tryPush();
          }
        }, 100);
        return () => clearInterval(id);
      }
      tryPush();
      return;
    }

    // Lazy loading with IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          tryPush();
        }
      },
      { rootMargin: '200px' }
    );
    
    observerRef.current.observe(ins);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ADS_CLIENT, slotId, enabled, eager]);

  if (!enabled || !ADS_CLIENT || !slotId) return null;

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className ?? ''}`}
      style={style ?? { display: 'block' }}
      data-ad-client={ADS_CLIENT}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={fwr ? 'true' : 'false'}
      {...(layout ? { 'data-ad-layout': layout } : null)}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : null)}
      {...(adTestEffective ? { 'data-adtest': 'on' } : null)}
    />
  );
}