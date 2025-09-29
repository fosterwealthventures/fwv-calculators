// lib/plan.ts

/** Canonical plan type used everywhere. */
export type Plan = "free" | "plus" | "pro" | "premium";
// which single Pro feature the user picked
export type ProChoice = "employee" | "expense_split" | null;

/** Back-compat alias some files use */
export type PlanId = Plan;

/** Ordered list (lowest → highest). */
export const PLANS: PlanId[] = ["free", "plus", "pro", "premium"];

/** Rank table for comparisons. */
const RANK: Record<Plan, number> = {
  free: 0,
  plus: 1,
  pro: 2,
  premium: 3,
};

/** True if userPlan satisfies (>=) the minimum required plan. */
export function hasAccess(userPlan: Plan, required: Plan): boolean {
  return RANK[userPlan] >= RANK[required];
}

/** Pretty labels for UI. */
export function prettyPlan(p: Plan): "Free" | "Plus" | "Pro" | "Premium" {
  if (p === "premium") return "Premium";
  if (p === "pro") return "Pro";
  if (p === "plus") return "Plus";
  return "Free";
}

/** Calculator access by plan */
export const PLAN_CALCULATORS: Record<Plan, string[]> = {
  free: ["roi", "break-even", "mortgage", "interest", "freelancer-rate", "tip-split"],
  plus: ["roi", "break-even", "mortgage", "interest", "freelancer-rate", "tip-split", "savings", "debt-payoff"],
  pro: ["roi", "break-even", "mortgage", "interest", "freelancer-rate", "tip-split", "savings", "debt-payoff", "employee-cost", "expense-split-deluxe"],
  premium: ["roi", "break-even", "mortgage", "interest", "freelancer-rate", "tip-split", "savings", "debt-payoff", "employee-cost", "expense-split-deluxe"]
};

/** Check if a user can access a specific calculator */
export function planAllows(
  calculatorKey: string, 
  userPlan: Plan, 
  proChoice?: ProChoice
): boolean {
  // Premium gets everything
  if (userPlan === "premium") return true;
  
  // Check if calculator is in user's plan
  const hasCalculator = PLAN_CALCULATORS[userPlan].includes(calculatorKey);
  
  // For Pro plan, check choice restrictions
  if (userPlan === "pro" && hasCalculator) {
    // Pro choice restrictions only apply to these two calculators
    if (calculatorKey === "employee-cost") {
      return proChoice === "employee";
    }
    if (calculatorKey === "expense-split-deluxe") {
      return proChoice === "expense_split";
    }
  }
  
  return hasCalculator;
}

/** Check if user can download reports */
export function canDownload(userPlan: Plan, calculatorKey?: string): boolean {
  // Premium always gets downloads
  if (userPlan === "premium") return true;
  
  // Pro gets downloads for their chosen calculator (or any if no choice restriction applies)
  if (userPlan === "pro") {
    // If no specific calculator, they have download capability in general
    if (!calculatorKey) return true;
    
    // For choice calculators, they can only download from their chosen one
    if (calculatorKey === "employee-cost" || calculatorKey === "expense-split-deluxe") {
      // This will be checked at the component level with their actual choice
      return true;
    }
    
    return true;
  }
  
  // Plus and Free cannot download
  return false;
}

/** Check if ads should be shown */
export function shouldShowAds(userPlan: Plan): boolean {
  return userPlan === "free";
}

/** Get available calculators for a plan (filtered by pro choice if applicable) */
export function getAvailableCalculators(userPlan: Plan, proChoice?: ProChoice): string[] {
  const allCalculators = PLAN_CALCULATORS[userPlan];
  
  if (userPlan !== "pro" || !proChoice) {
    return allCalculators;
  }
  
  // Filter for Pro plan based on choice
  return allCalculators.filter(calc => {
    if (calc === "employee-cost") return proChoice === "employee";
    if (calc === "expense-split-deluxe") return proChoice === "expense_split";
    return true; // All other calculators are available
  });
}