// components/ads/ClientAdsLoader.tsx
'use client';

import { ADS_CLIENT } from '@/lib/ads-config';

/**
 * Global push guard:
 *  - Only allows adsbygoogle.push({}) when there is a pending <ins.adsbygoogle>
 *  - Lets Auto Ads config objects through
 *  - Re-installs itself if the Google lib overwrites push()
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
            if (!pending) return 0;      // no pending <ins> -> avoid TagError
            return orig(arg);
          }catch(e){ return 0; }
        };
        q.push.__adsGuarded = true;
      }catch(_){}
    }

    install();
    // If the library overwrites push, put our guard back
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

type Props = { enabled?: boolean };

/**
 * Single global AdSense loader.
 * Uses raw <script> tags (no Next <Script>) to avoid the "data-nscript" warning.
 * Place once near the top of <body> in app/layout.tsx: <ClientAdsLoader enabled />
 */
export default function ClientAdsLoader({ enabled = true }: Props) {
  if (!enabled || !ADS_CLIENT) return null;

  return (
    <>
      {/* Raw shim first so any early pushes are guarded */}
      <script id="fwv-ads-shim" dangerouslySetInnerHTML={{ __html: PUSH_SHIM }} />

      {/* Official AdSense loader as a raw script (async, crossorigin) */}
      <script
        id="adsense-loader"
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          ADS_CLIENT
        )}`}
      />
    </>
  );
}
