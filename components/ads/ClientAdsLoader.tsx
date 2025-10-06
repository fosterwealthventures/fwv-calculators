// components/ads/ClientAdsLoader.tsx
'use client';

import Script from 'next/script';
import { ADS_CLIENT } from '@/lib/ads-config';

// Global push guard: only push when a pending <ins.adsbygoogle> exists
const PUSH_SHIM = `
(function(){
  try{
    var w = window;
    w.adsbygoogle = w.adsbygoogle || [];
    if (w.__fwvPushShim) return;

    function install(){
      try{
        var q = w.adsbygoogle;
        var orig = q.push.bind(q);
        q.push = function(arg){
          try{
            // allow Auto Ads config objects; otherwise require a pending <ins>
            if (arg && typeof arg === 'object' &&
               ('google_ad_client' in arg || 'enable_page_level_ads' in arg)) {
              return orig(arg);
            }
            var pending = document.querySelector('ins.adsbygoogle:not([data-adsbygoogle-status])');
            if (!pending) return 0;
            return orig(arg);
          }catch(e){ return 0; }
        };
        q.push.__adsGuarded = true;
      }catch(_){}
    }
    install();
    var iv = setInterval(function(){
      try{
        var q = w.adsbygoogle;
        if (q && q.push && !q.push.__adsGuarded) install();
      }catch(_){}
    }, 250);

    w.__fwvPushShim = true;
  }catch(_){}
})();
`;

export default function ClientAdsLoader({ enabled = true }: { enabled?: boolean }) {
  // In Preview we want the loader present even if gating flags are off.
  // Only condition: we must have a client ID (we set a fallback in ads-config).
  if (!ADS_CLIENT) return null;

  // Optional: emit a tiny marker so we can confirm the component rendered
  return (
    <>
      <span id="fwv-ads-marker" data-client={ADS_CLIENT} style={{ display: 'none' }} />
      <Script id="fwv-ads-shim" strategy="beforeInteractive">{PUSH_SHIM}</Script>
      <Script
        id="adsense-loader"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS_CLIENT)}`}
      />
    </>
  );
}
