"use client";

import AdGateFreeOnly from "./AdGateFreeOnly";
import AdSlot from "./AdSlot";

type Props = {
  enabled?: boolean;
  className?: string;
  slot?: string;
  eager?: boolean;
};

export default function AdInContent({ enabled = true, className = "", slot, eager = false }: Props) {
  const resolvedSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT || "";
  if (!resolvedSlot) return null;

  return (
    <AdGateFreeOnly>
      <AdSlot
        slot={resolvedSlot}
        enabled={enabled}
        format="auto"
        responsive
        eager={eager}
        className={className}
        style={{ display: "block", textAlign: "center", margin: "24px 0" }}
      />
    </AdGateFreeOnly>
  );
}