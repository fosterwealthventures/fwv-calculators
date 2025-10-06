"use client";

import { usePathname, useSearchParams } from "next/navigation";
import AdGateFreeOnly from "./AdGateFreeOnly";
import AdSlot from "./AdSlot";

const PAID_GUIDE_SLUGS = new Set([
  "savings-growth",
  "debt-payoff",
  "employee-cost",
  "expense-split-deluxe",
]);

const PAID_CALC_SLUGS = new Set(["savings", "debt", "employee", "expense-split-deluxe"]);

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
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT || "";
  const isPaid = useIsPaidContext();

  if (!adSlot || isPaid) return null;

  return (
    <AdGateFreeOnly>
      <div className={`mt-8 flex justify-center ${className}`}>
        <AdSlot
          slot={adSlot}
          format="auto"
          responsive
          style={{ display: 'block', minHeight: 120 }}
        />
      </div>
    </AdGateFreeOnly>
  );
}