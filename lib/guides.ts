// lib/guides.ts
export type Plan = "Free" | "Plus" | "Pro";

export type Guide = {
  slug: string;
  title: string;
  description?: string;
  plan: Plan;
};

const ALL_GUIDES: Guide[] = [
  // ---------- Free ----------
  {
    slug: "roi-vs-annualized-roi",
    title: "ROI vs Annualized ROI",
    description: "Understand plain ROI vs annualized ROI for apples-to-apples comparisons.",
    plan: "Free",
  },
  {
    slug: "break-even-made-simple",
    title: "Break-Even Made Simple",
    description: "Find the point where revenue covers costs so decisions turn profitable.",
    plan: "Free",
  },
  {
    slug: "mortgage-payment-breakdown",
    title: "Mortgage Payment Breakdown",
    description: "Deconstruct principal, interest, taxes, and insurance like a pro.",
    plan: "Free",
  },
  {
    slug: "mortgage",
    title: "Mortgage Basics",
    description: "Rates, amortization, and payoff strategies—what really moves your payment.",
    plan: "Free",
  },
  {
    slug: "simple-vs-compound-interest",
    title: "Simple vs Compound Interest",
    description: "See how compounding changes outcomes over time.",
    plan: "Free",
  },
  {
    slug: "set-your-freelance-rate-right",
    title: "Set Your Freelance Rate Right",
    description: "Price your time with overhead, taxes, and profit in mind.",
    plan: "Free",
  },
  {
    slug: "restaurant-tips-tabs-split",
    title: "Restaurant Tips & Tabs Split",
    description: "Quickly split checks and tips without drama.",
    plan: "Free",
  },
  {
    slug: "costly-calculator-mistakes",
    title: "5 Costly Calculator Mistakes",
    description: "Avoid setup errors that skew results and decisions.",
    plan: "Free",
  },

  // ---------- Plus ----------
  {
    slug: "savings-growth",
    title: "Savings Growth",
    description: "Project balances with recurring contributions and compounding.",
    plan: "Plus",
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff",
    description: "Snowball vs avalanche: simulate timelines and interest saved.",
    plan: "Plus",
  },
  {
    slug: "debt-planner",
    title: "Debt Planner",
    description: "Multi-debt planning with budgets, strategies, and tracking.",
    plan: "Plus",
  },

  // ---------- Pro ----------
  {
    slug: "employee-cost",
    title: "Employee Cost",
    description: "Total employment cost beyond salary—taxes, benefits, overhead.",
    plan: "Pro",
  },
  {
    slug: "expense-split-deluxe",
    title: "Expense Split Deluxe",
    description: "Advanced cost splitting with weights, caps, and downloads.",
    plan: "Pro",
  },
];

export function getAllGuides(): Guide[] {
  return ALL_GUIDES; // keep order as listed
}

export { ALL_GUIDES };
export default getAllGuides;
