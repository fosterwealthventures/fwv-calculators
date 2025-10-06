"use client";

import Script from "next/script";

// Define config directly in component
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

const PUSH_SHIM = `
(function(){
  try{
    var w = window;
    w.adsbygoogle = w.adsbygoogle || [];
    if (!w.__fwvPushShim) {
      var _push = w.adsbygoogle.push.bind(w.adsbygoogle);
      w.adsbygoogle.push = function(arg){
        try{
          // Allow Auto Ads config objects
          if (arg && typeof arg === 'object' && 
              ('google_ad_client' in arg || 'enable_page_level_ads' in arg)) {
            return _push(arg);
          }
          
          // For empty objects {}, only push if there are pending ads
          if (!arg || (typeof arg === 'object' && Object.keys(arg).length === 0)) {
            var pendingIns = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"]):not([data-adsbygoogle-status="bound"])');
            if (pendingIns.length === 0) {
              return 0; // Silently skip if no pending ads
            }
          }
          
          return _push(arg);
        } catch(e) { 
          console.warn('[AdSense] Push error caught:', e);
          return 0; 
        }
      };
      w.__fwvPushShim = true;
    }
  } catch(e){
    console.warn('[AdSense] Shim init error:', e);
  }
})();
`;

type Props = { enabled?: boolean };

export default function ClientAdsLoader({ enabled = true }: Props) {
  if (!enabled || !ADS_ENABLED || !ADS_CLIENT) return null;

  return (
    <>
      <Script id="fwv-ads-shim" strategy="beforeInteractive">
        {PUSH_SHIM}
      </Script>
      <Script
        id="adsense-loader"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS_CLIENT)}`}
      />
    </>
  );
}