// components/ads/ClientAdsLoader.tsx
'use client';

import Script from 'next/script';
import { ADS_CLIENT, ADS_ENABLED } from '@/lib/ads-config';

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
            // Allow Auto Ads config objects (if ever used)
            if (arg && typeof arg === 'object' &&
               ('google_ad_client' in arg || 'enable_page_level_ads' in arg)) {
              return orig(arg);
            }
            // For standard {} pushes, only push if a pending <ins> exists
            var pending = document.querySelector('ins.adsbygoogle:not([data-adsbygoogle-status])');
            if (!pending) return 0;
            return orig(arg);
          }catch(e){ return 0; }
        };
        q.push.__adsGuarded = true;
      }catch(_){}
    }

    // initial install + guard against the library overwriting push
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
  const shouldLoad = enabled && ADS_ENABLED && !!ADS_CLIENT;
  if (!shouldLoad) return null;

  return (
    <>
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
