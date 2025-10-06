"use client";

import AdGateFreeOnly from "./AdGateFreeOnly";
import AdSlot from "./AdSlot";

type Props = {
  enabled?: boolean;
  className?: string;
  /** Optional: override the default in-content slot via prop */
  slot?: string;
};

const ENV_SLOT = process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT || "";

export default function AdInContent({ enabled = true, className = "", slot }: Props) {
  const resolvedSlot = slot || ENV_SLOT;
  if (!resolvedSlot) return null;

  return (
    <AdGateFreeOnly>
      <AdSlot
        slot={resolvedSlot}
        enabled={enabled}
        format="auto"
        responsive
        className={className}
        style={{ display: "block", textAlign: "center", margin: "24px 0" }}
      />
    </AdGateFreeOnly>
  );
}
