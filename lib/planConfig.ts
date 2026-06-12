// lib/planConfig.ts
export type Plan = "free" | "plus" | "pro" | "premium";

export const rank: Record<Plan, number> = {
  free: 0,
  plus: 1,
  pro: 2,
  premium: 3,
};

export const ENTITLEMENTS = {
  free: {
    ads: true,
    calculators: {
      freeSuite: true,
      savings: false,
      debt: false,
      employee: false,
      expenseSplitDeluxe: false,
    },
  },
  plus: {
    ads: false, // <= ad-free
    calculators: {
      freeSuite: true,
      savings: true, // <= unlocked on Plus
      debt: true, // <= unlocked on Plus
      employee: false,
      expenseSplitDeluxe: false,
    },
  },
  pro: {
    ads: false,
    calculators: {
      freeSuite: true,
      savings: true,
      debt: true,
      employee: true, // Pro can use ONE advanced (via ProChoice flow)
      expenseSplitDeluxe: true, // Pro can use ONE advanced
    },
    proChoice: { oneOf: ["employee", "expenseSplitDeluxe"] as const },
  },
  premium: {
    ads: false,
    calculators: {
      freeSuite: true,
      savings: true,
      debt: true,
      employee: true,
      expenseSplitDeluxe: true,
    },
    prioritySupport: true,
  },
} as const;

export function isAdFree(plan: Plan) {
  return ENTITLEMENTS[plan].ads === false;
}
