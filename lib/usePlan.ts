// lib/usePlan.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { type Plan, rank } from "@/lib/planConfig";

function parsePlan(v?: string | null): Plan | null {
  if (!v) return null;
  const p = v.toLowerCase();
  return (["free", "plus", "pro", "premium"] as Plan[]).includes(p as Plan)
    ? (p as Plan)
    : null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function usePlan() {
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    try {
      const urlPlan = parsePlan(new URL(window.location.href).searchParams.get("plan"));
      if (urlPlan) {
        localStorage.setItem("fwv-plan", urlPlan);
        document.cookie = `fwv_plan=${urlPlan}; path=/; max-age=${60 * 60 * 24 * 365}`;
        setPlan(urlPlan);
        return;
      }
      const lsPlan = parsePlan(localStorage.getItem("fwv-plan"));
      if (lsPlan) return setPlan(lsPlan);
      const ckPlan = parsePlan(getCookie("fwv_plan"));
      if (ckPlan) return setPlan(ckPlan);
    } catch {}
  }, []);

  const helpers = useMemo(() => {
    const gte = (min: Plan) => rank[plan] >= rank[min];
    return { gte };
  }, [plan]);

  return { plan, ...helpers };
}
