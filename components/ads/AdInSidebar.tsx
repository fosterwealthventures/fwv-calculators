"use client";

import AdGateFreeOnly from "./AdGateFreeOnly";
import AdSlot from "./AdSlot";

type Props = {
  enabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  slot1?: string;
  slot2?: string;
};

const ENV_SLOT1 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 || "";
const ENV_SLOT2 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2 || "";

export default function AdInSidebar({
  enabled = true,
  className = "",
  width = 300,
  height = 600,
  slot1,
  slot2,
}: Props) {
  if (!enabled) return null;

  const s1 = slot1 || ENV_SLOT1;
  const s2 = slot2 || ENV_SLOT2;

  return (
    <AdGateFreeOnly>
      <div className={`space-y-4 ${className}`}>
        {s1 && (
          <div className="flex justify-center">
            <AdSlot 
              slot={s1} 
              style={{ width: 300, height: 250, display: "block" }} 
              format="rectangle"
              responsive={false}
            />
          </div>
        )}
        {s2 && (
          <div className="flex justify-center">
            <AdSlot 
              slot={s2} 
              style={{ width, height, display: "block" }} 
              format="rectangle"
              responsive={false}
            />
          </div>
        )}
      </div>
    </AdGateFreeOnly>
  );
}