// providers/PlanProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type PlanId = 'free' | 'plus' | 'pro' | 'premium';

const PLAN_COOKIE = 'fwv_plan';
const PLAN_LS = 'fwv:plan';
const VALID = new Set<PlanId>(['free', 'plus', 'pro', 'premium']);

type Ctx = {
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  showAds: boolean;
};

const PlanCtx = createContext<Ctx | null>(null);

export function PlanProvider({
  children,
  initialPlan = 'free',
}: {
  children: React.ReactNode;
  initialPlan?: PlanId;
}) {
  // Start with the server-known plan to avoid hydration mismatches
  const [plan, setPlanState] = useState<PlanId>(initialPlan);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|; )fwv_plan=([^;]+)/);
    const fromCookie = (cookieMatch?.[1] ?? '') as PlanId | '';
    const fromLS = (localStorage.getItem(PLAN_LS) ?? '') as PlanId | '';

    const resolved: PlanId =
      (VALID.has(fromCookie as PlanId) && (fromCookie as PlanId)) ||
      (VALID.has(fromLS as PlanId) && (fromLS as PlanId)) ||
      initialPlan;

    // Persist + sync if different
    if (resolved !== plan) setPlanState(resolved);

    document.cookie = `${PLAN_COOKIE}=${resolved}; path=/; max-age=${60 * 60 * 24 * 365}`;
    localStorage.setItem(PLAN_LS, resolved);
  }, [initialPlan]); // run once (keyed by the SSR plan)

  const setPlan = (p: PlanId) => {
    const next = VALID.has(p) ? p : 'free';
    document.cookie = `${PLAN_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    localStorage.setItem(PLAN_LS, next);
    setPlanState(next);
  };

  return (
    <PlanCtx.Provider value={{ plan, setPlan, showAds: plan === 'free' }}>
      {children}
    </PlanCtx.Provider>
  );
}

export const usePlan = () => {
  const v = useContext(PlanCtx);
  if (!v) throw new Error('usePlan must be used inside PlanProvider');
  return v;
};
