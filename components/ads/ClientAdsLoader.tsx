"use client";

import Script from "next/script";

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/** Safe push shim: prevents TagError when all slots are already “done”. */
const PUSH_SHIM = `
(function(){
  try{
    var w = window;
    w.adsbygoogle = w.adsbygoogle || [];
    if (!w.__fwvPushShim) {
      var _push = w.adsbygoogle.push.bind(w.adsbygoogle);
      w.adsbygoogle.push = function(arg){
        try{
          // Allow Auto Ads CONFIG
          if (arg && typeof arg === 'object' && ('google_ad_client' in arg || 'enable_page_level_ads' in arg)) {
            return _push(arg);
          }
          // Only push {} when at least one slot needs init
          var list = Array.prototype.slice.call(document.querySelectorAll('ins.adsbygoogle'));
          var hasPending = list.some(function(n){ return n.getAttribute('data-adsbygoogle-status') !== 'done'; });
          if (!hasPending) return 0;
          return _push(arg);
        }catch(e){ return 0; }
      };
      w.__fwvPushShim = true;
    }
  }catch(e){}
})();
`;

type Props = { enabled?: boolean };

export default function ClientAdsLoader({ enabled = true }: Props) {
  // Don’t load script if ads are disabled for this request (e.g., paid plan)
  if (!enabled) return null;

  // Only load in production with valid env
  if (process.env.NODE_ENV !== "production" || !ADS_ENABLED || !CLIENT) return null;

  return (
    <>
      <Script
        id="adsense-loader"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          CLIENT
        )}`}
        crossOrigin="anonymous"
      />
      <Script id="adsense-push-shim" strategy="afterInteractive">
        {PUSH_SHIM}
      </Script>
    </>
  );
}
