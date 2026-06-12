// app/upgrade/client-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

const UpgradeClient = dynamic(() => import("./upgrade-client"), { ssr: false });

// Incoming (from page.tsx) can be missing/undefined.
// We coerce to what UpgradeClient expects.
type PropsIn = {
  calc?: string | null | undefined;
  redirect?: string | null | undefined;
};

export default function UpgradeClientWrapper({ calc, redirect }: PropsIn) {
  const safeCalc: string | null = calc ?? null;
  const safeRedirect: string = redirect ?? "/dashboard"; // <- required string
  return <UpgradeClient calc={safeCalc} redirect={safeRedirect} />;
}
