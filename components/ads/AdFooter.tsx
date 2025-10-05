"use client";

import { useEffect, useRef } from "react";
import AdGateFreeOnly from "./AdGateFreeOnly";
import { getAdsClient, getFooterSlot } from "./adEnv";
import { usePathname, useSearchParams } from "next/navigation";

const PAID_GUIDE_SLUGS = new Set([
  "savings-growth",
  "debt-payoff",
  "employee-cost",
  "expense-split-deluxe",
]);
const PAID_CALC_SLUGS = new Set(["savings", "debt", "employee", "expense-split-deluxe"]); // update if your internal calc keys differ

function useIsPaidContext() {
  const pathname = usePathname();
  const qp = useSearchParams();
  const calc = qp?.get("calc");
  if (calc && PAID_CALC_SLUGS.has(calc)) return true;
  if (pathname?.startsWith("/guide/")) {
    const slug = pathname.split("/")[2] || "";
    if (PAID_GUIDE_SLUGS.has(slug)) return true;
  }
  return false;
}

type Props = { slot?: string; className?: string };

export default function AdFooter({ slot, className = "" }: Props) {
  const pushedRef = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const client = getAdsClient();
  const adSlot = slot ?? getFooterSlot();
  const isPaid = useIsPaidContext();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!client || !adSlot) return;
    if (pushedRef.current) return;
    const el = ref.current?.querySelector('ins.adsbygoogle') as HTMLElement | null;
    if (!el) return;
    const status = el.getAttribute('data-adsbygoogle-status');
    if (status && status === 'done') { pushedRef.current = true; return; }
    pushedRef.current = true;
    try {
      (window.adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {/* ignore */}
  }, [client, adSlot]);

  const wrapper = `mt-8 flex justify-center ${className}`;

  return (
    <AdGateFreeOnly>
      {!client || !adSlot || isPaid ? (
        <div ref={ref} className={wrapper} aria-label="Ad placeholder">
          <div
            className="w-full max-w-6xl rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 text-center shadow-sm"
            style={{ minHeight: 120 }}
          >
            <div className="text-sm text-gray-500">
              Footer ad space — set your AdSense env vars.
            </div>
          </div>
        </div>
      ) : (
        <div ref={ref} className={wrapper}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center", minHeight: 120 }}
            data-ad-client={client}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}
    </AdGateFreeOnly>
  );
}
