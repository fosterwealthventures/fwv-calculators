// lib/calculators.ts
// Single source of truth for the refocused FWV calculator site.
// The site is now free lead-generation for Credit Insight Intelligence and HavenMIND,
// while preserving the original FWV look, blog system, and guide structure.

export type CalcTier = "free" | "plus" | "pro";
export type CalcPillar = "credit" | "real-estate" | "utility";

export type CalcEntry = {
  /** Stable id; used as a key in maps and URLs */
  slug: string;
  /** Display name shown to users */
  title: string;
  /** Route to the calculator page */
  path: `/${string}`;
  /** All active calculators are free in this lead-gen version */
  tier: CalcTier;
  /** New strategic pillar */
  pillar: CalcPillar;
  /** Optional route to a guide page */
  guide?: `/${string}`;
  /** Optional short blurb (cards/SEO) */
  summary?: string;
  /** Optional lucide icon name if menus show icons */
  icon?: string;
  /** Primary next step after the calculator */
  cta?: { label: string; href: string };
};

export const CALCULATORS: CalcEntry[] = [
  {
    slug: "credit-utilization",
    title: "Credit Utilization Optimizer",
    path: "/credit-utilization",
    tier: "free",
    pillar: "credit",
    guide: "/guide/credit-utilization",
    summary: "See your utilization risk across all cards and identify which card to pay first.",
    icon: "CreditCard",
    cta: {
      label: "Start Credit Insight Intelligence",
      href: "https://fosterwealthventures.com/credit-insight",
    },
  },
  {
    slug: "debt-payoff-priority",
    title: "Debt Payoff Priority Ranker",
    path: "/debt-payoff-priority",
    tier: "free",
    pillar: "credit",
    guide: "/guide/debt-payoff-priority",
    summary: "Compare avalanche and snowball payoff order so you know which debt to attack first.",
    icon: "TrendingDown",
    cta: {
      label: "Start Credit Insight Intelligence",
      href: "https://fosterwealthventures.com/credit-insight",
    },
  },
  {
    slug: "deal-snapshot",
    title: "Real Estate Deal Snapshot",
    path: "/deal-snapshot",
    tier: "free",
    pillar: "real-estate",
    guide: "/guide/real-estate-deal-snapshot",
    summary: "Estimate cash flow, cap rate, DSCR, breakeven rent, and deal strength for a rental property.",
    icon: "Building2",
    cta: {
      label: "Explore HavenMIND AI",
      href: "https://fosterwealthventures.com/havenmind",
    },
  },
  {
    slug: "max-offer-arv",
    title: "Max Offer & ARV Calculator",
    path: "/max-offer-arv",
    tier: "free",
    pillar: "real-estate",
    guide: "/guide/max-offer-arv",
    summary: "Work backward from ARV, repairs, holding costs, and profit targets to find your max offer.",
    icon: "Home",
    cta: {
      label: "Explore HavenMIND AI",
      href: "https://fosterwealthventures.com/havenmind",
    },
  },
  {
    slug: "tip-and-tab-split",
    title: "Tip & Tab Split",
    path: "/tip-split",
    tier: "free",
    pillar: "utility",
    guide: "/guide/tip-and-tab-split",
    summary: "Split a restaurant bill with tax, tip, discounts, and number of people included.",
    icon: "UtensilsCrossed",
  },
];

export const PILLAR_LABELS: Record<CalcPillar, string> = {
  credit: "Credit Calculators",
  "real-estate": "Real Estate Calculators",
  utility: "Utility Calculators",
};

export const PILLAR_DESCRIPTIONS: Record<CalcPillar, string> = {
  credit: "Understand credit utilization, debt payoff order, and what may need a deeper credit review.",
  "real-estate": "Run deal numbers before you buy, refinance, or move deeper into investment analysis.",
  utility: "Simple everyday tools that keep the site useful without distracting from the core pillars.",
};

// -----------------------------
// Helpers you can import anywhere
// -----------------------------
export const bySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
export const byPath = (path: string) => CALCULATORS.find((c) => c.path === path);
export const byPillar = (pillar: CalcPillar) => CALCULATORS.filter((c) => c.pillar === pillar);

export const CALC_MAP: Record<string, CalcEntry> = CALCULATORS.reduce(
  (acc, c) => ((acc[c.slug] = c), acc),
  {} as Record<string, CalcEntry>
);

export const visibleCalculators = (_plan: CalcTier = "free") => CALCULATORS;
export const tierLabel = (_tier: CalcTier) => "Free";

export type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

export const buildCalculatorSitemap = (baseUrl: string, includeGuides = true) => {
  const now = new Date().toISOString();

  const calcPages: SitemapEntry[] = CALCULATORS.map((c) => ({
    url: `${baseUrl}${c.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  if (!includeGuides) return calcPages;

  const guidePages: SitemapEntry[] = CALCULATORS.filter((c) => c.guide).map((c) => ({
    url: `${baseUrl}${c.guide!}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.55,
  }));

  return [...calcPages, ...guidePages];
};

export const groupByTier = () => ({ free: CALCULATORS, plus: [], pro: [] });
export const groupByPillar = () =>
  CALCULATORS.reduce(
    (acc, c) => {
      acc[c.pillar].push(c);
      return acc;
    },
    { credit: [], "real-estate": [], utility: [] } as Record<CalcPillar, CalcEntry[]>
  );
