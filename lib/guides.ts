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
    title: "ROI vs Annualized ROI",
    description: "Apples-to-apples comparisons for returns over time.",
    plan: "free",
  },
  {
    slug: "break-even-made-simple",
    title: "Break-Even Made Simple",
    description: "Find the point where revenue covers costs.",
    plan: "free",
  },
  {
    slug: "mortgage-payment-breakdown",
    title: "Mortgage Payment Breakdown",
    description: "Principal, interest, taxes, and insurance—deconstructed.",
    plan: "free",
  },
  {
    slug: "mortgage",
    title: "Mortgage Basics",
    description: "Rates, amortization, and payoff strategies that matter.",
    plan: "free",
  },
  {
    slug: "simple-vs-compound-interest",
    title: "Simple vs Compound Interest",
    description: "See how compounding changes outcomes over time.",
    plan: "free",
  },
  {
    slug: "set-your-freelance-rate-right",
    title: "Set Your Freelance Rate Right",
    description: "Price your time with overhead, taxes, and profit.",
    plan: "free",
  },
  {
    slug: "restaurant-tips-tabs-split",
    title: "Restaurant Tips & Tabs Split",
    description: "Quickly split checks and tips without drama.",
    plan: "free",
  },
  {
    slug: "shopping-budget",
    title: "Shopping Budget",
    description: "Plan a spend, track items, and stay on budget.",
    plan: "free",
  },

  // ---- Plus guides ----
  {
    slug: "savings-growth",
    title: "Savings Growth",
    description: "Recurring contributions and compounding, visualized.",
    plan: "plus",
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff",
    description: "Snowball vs avalanche: timelines and interest saved.",
    plan: "plus",
  },
  {
    slug: "debt-planner",
    title: "Debt Planner",
    description: "Multi-debt planning with budgets, strategies, tracking.",
    plan: "plus",
  },
  {
    slug: "restaurant-split-by-order",
    title: "Split by Order (+ Shared Appetizers)",
    description: "Split the bill by what each person ordered, plus shared items.",
    plan: "plus",
  },

  // ---- Pro guides ----
  {
    slug: "employee-cost",
    title: "Employee Cost",
    description: "Total employment cost beyond salary—taxes, benefits, overhead.",
    plan: "pro",
  },
  {
    slug: "expense-split-deluxe",
    title: "Expense Split Deluxe",
    description: "Advanced cost splitting with weights, caps, and downloads.",
    plan: "pro",
  },
];

export const getAllGuides = (): Guide[] => GUIDES;
export const findGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
