"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Plan } from "@/lib/plan";

function readPlanFromStorage(): Plan {
  try {
    const m = document.cookie.match(/(?:^|;\s*)fwv_plan=([^;]+)/);
    if (m) return decodeURIComponent(m[1]) as Plan;

    const ls =
      (localStorage.getItem("fwv-plan") as Plan | null) ??
      (localStorage.getItem("fwv.planId") as Plan | null);
    return (ls ?? "free") as Plan;
  } catch {
    return "free";
  }
}

type Ctx = { plan: Plan };
const PlanCtx = createContext<Ctx>({ plan: "free" });

export function usePlan() {
  return useContext(PlanCtx);
}

export default function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>("free");
  useEffect(() => setPlan(readPlanFromStorage()), []);
  return <PlanCtx.Provider value={{ plan }}>{children}</PlanCtx.Provider>;
}
