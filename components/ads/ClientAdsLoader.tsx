// components/ads/ClientAdsLoader.tsx
'use client';
import { useEffect } from 'react';

/** Ensures the AdSense script exists exactly once on the page. */
export default function ClientAdsLoader({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    if (!client) return;

    // Guard: don't add the script twice (Strict Mode / route transitions)
    const id = 'adsbygoogle-js';
    if (document.getElementById(id)) return;

    const s = document.createElement('script');
    s.id = id;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      client
    )}`;
    document.head.appendChild(s);
  }, [enabled]);

  return null;
}
