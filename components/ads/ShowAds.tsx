"use client";

import { usePlan } from "@/providers/PlanProvider"; // <-- align with layout.tsx
import { isPaid } from "@/lib/plan";


export default function ShowAds({ children }: { children: React.ReactNode }) {
  const { plan } = usePlan();
  if (isPaid(plan)) return null; // hide ads for paid plans
  return <>{children}</>;
}
