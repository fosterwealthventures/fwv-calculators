// lib/guides.ts
// Authoritative list for the Guides index.
// Add/remove here and the Guides page will reflect it.

type Guide = {
  slug: string;
  title: string;
  description?: string;
  plan?: "Free" | "Plus" | "Pro";
};

export function getAllGuides(): Guide[] {
  return [
    // --- Free guides (examples) ---
    {
      slug: "roi-vs-annualized-roi",
      title: "ROI vs Annualized ROI — Guide",
      description:
        "Understand return on investment and read it alongside annualized ROI.",
      plan: "Free",
    },
    {
      slug: "break-even-made-simple",
      title: "Break-Even Calculator — Guide",
      description:
        "Master fixed vs. variable costs and where you cross into profit.",
      plan: "Free",
    },
    {
      slug: "mortgage-payment-breakdown",
      title: "Mortgage Payment Calculator — Guide",
      description:
        "See what impacts your monthly cost: principal, interest, taxes, insurance.",
      plan: "Free",
    },
    {
      slug: "simple-vs-compound-interest",
      title: "Simple vs. Compound Interest — Guide",
      description:
        "Which grows money faster? Learn by experimenting with inputs.",
      plan: "Free",
    },
    {
      slug: "set-your-freelance-rate-right",
      title: "Freelancer Rate Calculator — Guide",
      description:
        "Price your time properly so you don't undervalue your work.",
      plan: "Free",
    },

    // --- Paid (Plus) ---
    {
      slug: "savings-growth",
      title: "Savings Growth Calculator — Guide",
      description: "Turn diligent planning into abundance with compounding.",
      plan: "Plus",
    },
    {
      slug: "debt-payoff",
      title: "Debt Payoff Calculator — Guide",
      description: "Organize debts and apply Snowball or Avalanche strategies to become debt-free faster.",
      plan: "Plus",
    },

    // --- Paid (Pro) ---
    {
      slug: "expense-split-deluxe",
      title: "Expense Split Deluxe — Guide",
      description:
        "Roommates, couples, co-parents, and trips — split fairly with categories and exports.",
      plan: "Pro",
    },
    {
      slug: "employee-cost",
      title: "Employee Cost Calculator — Guide",
      description:
        "See the true cost of a hire: wages, taxes, benefits, insurance, overhead.",
      plan: "Pro",
    },
  ];
}
