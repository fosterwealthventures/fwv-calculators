// components/ads/ClientAdsLoader.tsx
'use client';

import Script from 'next/script';
import { ADS_CLIENT } from '@/lib/ads-config';

/**
 * Global push guard: only push when a pending <ins.adsbygoogle> exists.
 * Also re-installs itself if the Google lib overwrites push().
 */
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
            // Allow Auto Ads config payloads; otherwise require a pending <ins>
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
  // Require a client id; we set a fallback in ads-config for safety.
  if (!enabled || !ADS_CLIENT) return null;

  return (
    <>
      {/* Use raw <script> for the shim to avoid the "data-nscript" console warning */}
      <script id="fwv-ads-shim" dangerouslySetInnerHTML={{ __html: PUSH_SHIM }} />
      {/* Keep the official loader as Next <Script> for correct ordering & de-dup */}
      <Script
        id="adsense-loader"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          ADS_CLIENT
        )}`}
      />
    </>
  );
}
