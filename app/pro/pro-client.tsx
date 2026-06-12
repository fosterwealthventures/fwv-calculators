// app/pro/pro-client.tsx
"use client";

import dynamic from "next/dynamic";

const FosterWealthCalculatorsClient = dynamic(
  () => import("@/components/foster_wealth_calculators_suites"),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-6xl p-8 text-sm opacity-70">
        Loading calculators…
      </div>
    ),
  }
);

export default function ProClient() {
  return <FosterWealthCalculatorsClient />;
}
