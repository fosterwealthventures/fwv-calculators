"use client";

import Script from "next/script";
import { useEffect } from "react";

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/** Safe push shim — prevents TagError by allowing {} pushes only if a slot needs init */
const PUSH_SHIM = `
(function(){
  try{
    var w = window;
    w.adsbygoogle = w.adsbygoogle || [];
    if (!w.__fwvPushShim) {
      var _push = w.adsbygoogle.push.bind(w.adsbygoogle);
      w.adsbygoogle.push = function(arg){
        try{
          // Always allow Auto Ads config objects
          if (arg && typeof arg === 'object' &&
              ('google_ad_client' in arg || 'enable_page_level_ads' in arg)) {
            return _push(arg);
          }
          // Only forward {} when at least one <ins.adsbygoogle> is not "done"
          var list = Array.prototype.slice.call(document.querySelectorAll('ins.adsbygoogle'));
          var hasPending = list.some(function(n){ return n.getAttribute('data-adsbygoogle-status') !== 'done'; });
          if (!hasPending) return 0;
          return _push(arg);
        } catch(e) { return 0; }
      };
      w.__fwvPushShim = true;
    }
  } catch(e){}
})();
`;

type Props = { enabled?: boolean };

export default function ClientAdsLoader({ enabled = true }: Props) {
  if (!enabled) return null;

  // Install shim BEFORE any other scripts/effects run (pre-hydration)
  // Note: this inline script is small and permitted by your CSP ('unsafe-inline' allowed).
  const Shim = (
    <Script id="fwv-ads-shim" strategy="beforeInteractive">
      {PUSH_SHIM}
    </Script>
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADS_ENABLED || !CLIENT) return;

    // Manually inject the AdSense loader exactly once (no extra attributes)
    const already = document.querySelector(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (already) return;

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      CLIENT
    )}`;
    document.head.appendChild(s);
  }, []);

  return <>{Shim}</>;
}
