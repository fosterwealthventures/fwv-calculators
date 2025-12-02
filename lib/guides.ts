// lib/guides.ts

export type PlanTier = "free" | "plus" | "pro";

export type Guide = {
  slug: string;              // URL slug (folder under app/guide/)
  title: string;             // Card title
  description?: string;      // Short blurb for the grid card
  plan?: PlanTier;           // Badge shown on the card
};

export const GUIDES: Guide[] = [
  // ---- Free guides ----
  {
    slug: "roi-vs-annualized-roi",
    title: "ROI Calculator Guide: How to Calculate Return on Investment",
    description: "Apples-to-apples comparisons for returns over time.",
    plan: "free",
  },
  {
    slug: "break-even-made-simple",
    title: "Break-Even Calculator Guide: How to Find Your Break-Even Point",
    description: "Find the point where revenue covers costs.",
    plan: "free",
  },
  {
    slug: "mortgage-payment-breakdown",
    title: "Mortgage Payment Calculator Guide: Understand Your Monthly Payment",
    description: "Principal, interest, taxes, and insurance—deconstructed.",
    plan: "free",
  },
  {
    slug: "mortgage",
    title: "Mortgage Calculator Basics: Rates, Amortization & Payoff",
    description: "Rates, amortization, and payoff strategies that matter.",
    plan: "free",
  },
  {
    slug: "simple-vs-compound-interest",
    title: "Compound Interest Calculator Guide: Simple vs. Compound",
    description: "See how compounding changes outcomes over time.",
    plan: "free",
  },
  {
    slug: "set-your-freelance-rate-right",
    title: "Freelance Rate Calculator Guide: How to Price Your Services",
    description: "Price your time with overhead, taxes, and profit.",
    plan: "free",
  },
  {
    slug: "restaurant-tips-tabs-split",
    title: "Tip Split Calculator Guide: Split Restaurant Bills & Tips",
    description: "Quickly split checks and tips without drama.",
    plan: "free",
  },
  {
    slug: "shopping-budget",
    title: "Shopping Budget Calculator Guide: Plan and Track Spending",
    description: "Plan a spend, track items, and stay on budget.",
    plan: "free",
  },

  // ---- Plus guides ----
  {
    slug: "savings-growth",
    title: "Savings Calculator Guide: How Your Money Grows Over Time",
    description: "Recurring contributions and compounding, visualized.",
    plan: "plus",
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator Guide: Snowball vs. Avalanche",
    description: "Snowball vs avalanche: timelines and interest saved.",
    plan: "plus",
  },
  {
    slug: "debt-planner",
    title: "Debt Planner Calculator Guide: Plan and Track Multiple Debts",
    description: "Multi-debt planning with budgets, strategies, tracking.",
    plan: "plus",
  },
  {
    slug: "restaurant-split-by-order",
    title: "Bill Split by Item Calculator Guide: Orders & Shared Appetizers",
    description: "Split the bill by what each person ordered, plus shared items.",
    plan: "plus",
  },

  // ---- Pro guides ----
  {
    slug: "employee-cost",
    title: "Employee Cost Calculator Guide: Total Cost per Employee",
    description: "Total employment cost beyond salary—taxes, benefits, overhead.",
    plan: "pro",
  },
  {
    slug: "expense-split-deluxe",
    title: "Advanced Expense Split Calculator Guide: Weights, Caps & Shares",
    description: "Advanced cost splitting with weights, caps, and downloads.",
    plan: "pro",
  },
];

export const getAllGuides = (): Guide[] => GUIDES;
export const findGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
// app/guide/[slug]/page.tsx
