// lib/calculators.ts
// Single source of truth for all calculators in the app.
// Everything else (nav, index grid, sitemap) can derive from this list.

export type CalcTier = "free" | "plus" | "pro";

export type CalcEntry = {
    /** Stable id; used as a key in maps and URLs */
    slug: string;
    /** Display name shown to users */
    title: string;
    /** Route to the calculator page */
    path: `/${string}`;
    /** Monetization tier for gating */
    tier: CalcTier;
    /** Optional route to a guide page */
    guide?: `/${string}`;
    /** Optional short blurb (cards/SEO) */
    summary?: string;
    /** Optional lucide icon name if your menus show icons */
    icon?: string;
};

/**
 * Calculators present in your app (synced with the suites file):
 * - free: roi, break-even, mortgage, interest, freelancer-rate, tip-split, shopping-budget
 * - plus: savings, debt-payoff, split-by-order
 * - pro : employee-cost, expense-split-deluxe
 */
export const CALCULATORS: CalcEntry[] = [
    // --------------------
    // Free
    // --------------------
    {
        slug: "roi",
        title: "ROI Calculator",
        path: "/calculators/roi",
        tier: "free",
        guide: "/guide/roi",
        summary: "Quick return on investment math with optional annualization.",
        icon: "TrendingUp",
    },
    {
        slug: "break-even",
        title: "Break-Even",
        path: "/calculators/break-even",
        tier: "free",
        guide: "/guide/break-even",
        summary: "Find the sales volume needed to cover fixed and variable costs.",
        icon: "BarChart3",
    },
    {
        slug: "mortgage",
        title: "Mortgage",
        path: "/calculators/mortgage",
        tier: "free",
        guide: "/guide/mortgage",
        summary: "Payment, interest, and amortization breakdowns.",
        icon: "Home",
    },
    {
        slug: "interest",
        title: "Interest (Simple/Compound)",
        path: "/calculators/interest",
        tier: "free",
        guide: "/guide/interest",
        summary: "Simple vs. compound growth with time and rate controls.",
        icon: "DollarSign",
    },
    {
        slug: "freelancer-rate",
        title: "Freelancer Rate",
        path: "/calculators/freelancer-rate",
        tier: "free",
        guide: "/guide/freelancer-rate",
        summary: "Back into an hourly/day rate that covers costs and target income.",
        icon: "Users",
    },
    {
        slug: "tip-and-tab-split",
        title: "Tip & Tab Split",
        path: "/calculators/tip-and-tab-split",
        tier: "free",
        guide: "/guide/tip-and-tab-split",
        summary:
            "Split a restaurant bill and tips fairly across diners with optional tax/tip handling.",
        icon: "UtensilsCrossed",
    },
    {
        slug: "shopping-budget",
        title: "Shopping Budget",
        path: "/calculators/shopping-budget",
        tier: "free",
        guide: "/guide/shopping-budget",
        summary:
            "Plan your cart, include tax, and track remaining budget with inline edits and persistence.",
        icon: "ShoppingCart",
    },

    // --------------------
    // Plus
    // --------------------
    {
        slug: "savings-growth",
        title: "Savings Growth",
        path: "/calculators/savings-growth",
        tier: "plus",
        guide: "/guide/savings-growth",
        summary: "Recurring deposits with interest; visualize balance over time.",
        icon: "PiggyBank",
    },
    {
        slug: "debt-payoff",
        title: "Debt Payoff",
        path: "/calculators/debt-payoff",
        tier: "plus",
        guide: "/guide/debt-payoff",
        summary: "Snowball/avalanche projections with total interest saved.",
        icon: "DollarSign",
    },
    {
        slug: "split-by-order",
        title: "Split by Order (+ Shared Apps)",
        path: "/calculators/split-by-order",
        tier: "plus",
        guide: "/guide/split-by-order",
        summary:
            "Assign each dish to people, handle shared items and appetizers, and split precisely.",
        icon: "Utensils",
    },

    // --------------------
    // Plus/Pro (adjusted based on requirements)
    // --------------------
    {
        slug: "employee-cost",
        title: "Employee Cost",
        path: "/calculators/employee-cost",
        tier: "plus",
        guide: "/guide/employee-cost",
        summary:
            "True employee cost with taxes, benefits, overhead, and utilization.",
        icon: "Users",
    },
    {
        slug: "expense-split-deluxe",
        title: "Expense Split Deluxe",
        path: "/calculators/expense-split-deluxe",
        tier: "plus",
        guide: "/guide/expense-split-deluxe",
        summary:
            "Advanced restaurant bill split with shared items, service fees, tax, and rounding.",
        icon: "Utensils",
    },
];

// -----------------------------
// Helpers you can import anywhere
// -----------------------------

/** Quick lookup by slug */
export const bySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
/** Quick lookup by path */
export const byPath = (path: string) => CALCULATORS.find((c) => c.path === path);

/** Map form for O(1) lookups */
export const CALC_MAP: Record<string, CalcEntry> = CALCULATORS.reduce(
    (acc, c) => ((acc[c.slug] = c), acc),
    {} as Record<string, CalcEntry>
);

/**
 * Filter calculators by plan for menus/grids.
 * - free → show only "free"
 * - plus → show free + plus
 * - pro  → show all
 */
export const visibleCalculators = (plan: CalcTier = "free") =>
    CALCULATORS.filter((c) =>
        plan === "pro" ? true : plan === "plus" ? c.tier !== "pro" : c.tier === "free"
    );

/** Small label to show next to a calculator title */
export const tierLabel = (tier: CalcTier) =>
    tier === "free" ? "Free" : tier.toUpperCase();

/** Minimal data useful for sitemap.ts generation */
export type SitemapEntry = {
    url: string;
    lastModified: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
};

/** Build sitemap entries for all calculators (and optionally guides) */
export const buildCalculatorSitemap = (baseUrl: string, includeGuides = true) => {
    const now = new Date().toISOString();

    const calcPages: SitemapEntry[] = CALCULATORS.map((c) => ({
        url: `${baseUrl}${c.path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    if (!includeGuides) return calcPages;

    const guidePages: SitemapEntry[] = CALCULATORS.filter((c) => c.guide).map((c) => ({
        url: `${baseUrl}${c.guide!}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [...calcPages, ...guidePages];
};

/** Optional grouping helper (Free / Plus / Pro) */
export const groupByTier = () =>
    CALCULATORS.reduce(
        (acc, c) => {
            acc[c.tier].push(c);
            return acc;
        },
        { free: [] as CalcEntry[], plus: [] as CalcEntry[], pro: [] as CalcEntry[] }
    );
