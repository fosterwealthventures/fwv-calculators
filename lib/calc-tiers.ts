export const CALC_TIERS = {
  // free
  roi: "free",
  "break-even": "free",
  mortgage: "free",
  interest: "free",
  "freelancer-rate": "free",
  "tip-split": "free",
  // plus
  savings: "plus",
  "debt-payoff": "plus",
  // pro
  "employee-cost": "pro",
  "expense-split-deluxe": "pro",
} as const;

export type Tier = (typeof CALC_TIERS)[keyof typeof CALC_TIERS];
