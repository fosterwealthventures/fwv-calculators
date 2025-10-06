"use client";

import { useEffect } from "react";

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/** Safe push shim: lets Auto Ads config through; ignores {} pushes if no slots need init */
function installPushShim() {
  try {
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    if (w.__fwvPushShim) return;

    const _push = w.adsbygoogle.push.bind(w.adsbygoogle);
    w.adsbygoogle.push = function (arg: any) {
      try {
        // Always allow Auto Ads config object
        if (arg && typeof arg === "object" &&
            ("google_ad_client" in arg || "enable_page_level_ads" in arg)) {
          return _push(arg);
        }
        // Only push {} if at least one <ins.adsbygoogle> is not yet "done"
        const list = Array.from(document.querySelectorAll("ins.adsbygoogle")) as HTMLElement[];
        const hasPending = list.some(n => n.getAttribute("data-adsbygoogle-status") !== "done");
        if (!hasPending) return 0;
        return _push(arg);
      } catch {
        return 0;
      }
    };
    w.__fwvPushShim = true;
  } catch { /* ignore */ }
}

type Props = { enabled?: boolean };

export default function ClientAdsLoader({ enabled = true }: Props) {
  useEffect(() => {
    if (!enabled) return;
    if (process.env.NODE_ENV !== "production" || !ADS_ENABLED || !CLIENT) return;

    // Inject AdSense script exactly once (no Next.js <Script>, no data-nscript attribute)
    if (!document.querySelector('script[data-fwv-adsense-loader="1"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT)}`;
      s.setAttribute("data-fwv-adsense-loader", "1");
      document.head.appendChild(s);
    }

    // Install global safe-push shim once
    installPushShim();
  }, [enabled]);

  return null;
}
