// lib/guides.ts
// Master catalog for Guide pages.
// - Authoritative slugs to prevent 404s
// - Tier model where Premium inherits access to all lower tiers
// - Rich metadata for listing, SEO cards, and related guides

export type Tier = "free" | "plus" | "pro"; // Premium is implied for items at "pro"
export type PlanChip = "Free" | "Plus" | "Pro / Premium";

export type Guide = {
  slug: string;                 // /guide/<slug>
  title: string;                // Heading & list title
  description: string;          // Short blurb under title
  minTier: Tier;                // Lowest plan that unlocks the matching calc
  readingMinutes?: number;      // For "Estimated reading time"
  calcSlug?: string;            // Matching calculator route, if any
  related?: string[];           // Other guide slugs to link under "Related Guides"
  // You can add fields like `heroVerse`, `faq`, `schema`, etc. later without changing callers.
};

// ---------- Display helpers ----------

/** Returns the chip label shown in lists/cards for the required tier. */
export function tierChip(minTier: Tier): PlanChip {
  switch (minTier) {
    case "free":
      return "Free";
    case "plus":
      return "Plus";
    case "pro":
      // Premium includes Pro, so show both to reduce confusion on Pro pages.
      return "Pro / Premium";
  }
}

/** If you need a boolean: does this user plan unlock the guide’s matching calculator? */
export function planUnlocks(minTier: Tier, userPlan: "free" | "plus" | "pro" | "premium"): boolean {
  if (userPlan === "premium") return true;
  if (minTier === "free") return true;
  if (minTier === "plus") return userPlan === "plus" || userPlan === "pro";
  if (minTier === "pro") return userPlan === "pro";
  return false;
}

// ---------- Catalog (edit here to add/remove guides) ----------

const CATALOG: Guide[] = [
  // ===== FREE =====
  {
    slug: "roi-vs-annualized-roi",
    title: "ROI Calculator — Guide",
    description:
      "Understand return on investment and read it alongside annualized ROI.",
    minTier: "free",
    readingMinutes: 4,
    calcSlug: "roi",
    related: ["break-even-made-simple", "mortgage-payment-breakdown"],
  },
  {
    slug: "break-even-made-simple",
    title: "Break-Even Calculator — Guide",
    description:
      "Master fixed vs. variable costs and where you cross into profit.",
    minTier: "free",
    readingMinutes: 5,
    calcSlug: "break-even",
    related: ["roi-vs-annualized-roi", "set-your-freelance-rate-right"],
  },
  {
    slug: "mortgage-payment-breakdown",
    title: "Mortgage Payment Calculator — Guide",
    description:
      "See what impacts your monthly cost: principal, interest, taxes, insurance.",
    minTier: "free",
    readingMinutes: 4,
    calcSlug: "mortgage",
    related: ["simple-vs-compound-interest"],
  },
  {
    slug: "simple-vs-compound-interest",
    title: "Simple vs. Compound Interest — Guide",
    description:
      "Compare the two and see how time can multiply growth through compounding.",
    minTier: "free",
    readingMinutes: 3,
    calcSlug: "simple-vs-compound",
    related: ["savings-growth"],
  },
  {
    slug: "set-your-freelance-rate-right",
    title: "Freelancer Rate Calculator — Guide",
    description:
      "Price your time correctly with costs, capacity, and profit baked in.",
    minTier: "free",
    readingMinutes: 5,
    calcSlug: "freelancer-rate",
    related: ["break-even-made-simple"],
  },
  // Optional extra free guide you had in the tree:
  {
    slug: "costly-calculator-mistakes",
    title: "Costly Calculator Mistakes — Guide",
    description:
      "Avoid common pitfalls that skew results and lead to bad decisions.",
    minTier: "free",
    readingMinutes: 4,
    related: ["roi-vs-annualized-roi", "break-even-made-simple"],
  },

  // ===== PLUS (Premium also unlocks these) =====
  {
    slug: "savings-growth",
    title: "Savings Growth Calculator — Guide",
    description:
      "Project growth with contributions, interest, and compounding.",
    minTier: "plus",
    readingMinutes: 4,
    calcSlug: "savings",
    related: ["simple-vs-compound-interest", "debt-payoff"],
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator — Guide",
    description:
      "Compare snowball vs. avalanche, see payoff dates and total interest saved.",
    minTier: "plus",
    readingMinutes: 5,
    calcSlug: "debt-payoff",
    related: ["savings-growth"],
  },

  // ===== PRO (Premium includes Pro) =====
  {
    slug: "expense-split-deluxe",
    title: "Expense Split Deluxe — Guide",
    description:
      "Roommates, couples, co-parents, and trips—split fairly with categories and exports.",
    minTier: "pro",
    readingMinutes: 5,
    calcSlug: "expense-split-deluxe",
    related: ["employee-cost"],
  },
  {
    slug: "employee-cost",
    title: "Employee Cost Calculator — Guide",
    description:
      "See the true cost of a hire: wages, taxes, benefits, insurance, overhead.",
    minTier: "pro",
    readingMinutes: 6,
    calcSlug: "employee-cost",
    related: ["break-even-made-simple"],
  },
];

// ---------- Queries ----------

export function getAllGuides(): Guide[] {
  return CATALOG;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return CATALOG.find((g) => g.slug === slug);
}

export function getRelatedGuides(slug: string): Guide[] {
  const g = getGuideBySlug(slug);
  if (!g || !g.related?.length) return [];
  return g.related
    .map((s) => getGuideBySlug(s))
    .filter((x): x is Guide => Boolean(x));
}
