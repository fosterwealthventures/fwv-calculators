// lib/entitlements.ts
import { Plan, ProChoice, planAllows, canDownload } from "./plan";

export type UserEntitlements = {
  planId: Plan;
  removesAds: boolean;
  proChoice?: ProChoice;
};

export function getUserEntitlements(
  session?: {
    planId?: Plan;
    proChoice?: ProChoice;
  } | null,
): UserEntitlements {
  const planId = (session?.planId ?? "free") as Plan;
  const removesAds = planId !== "free";
  const proChoice = session?.proChoice;
  return { planId, removesAds, proChoice };
}

export function canUseCalculator(
  calculatorKey: string,
  ent: UserEntitlements,
): boolean {
  return planAllows(calculatorKey, ent.planId, ent.proChoice);
}

export function canDownloadReports(
  ent: UserEntitlements,
  calculatorKey?: string,
): boolean {
  return canDownload(ent.planId, calculatorKey);
}
