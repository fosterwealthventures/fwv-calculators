# FWV Calculator Migration Notes

This package uses the original GitHub calculator site as the foundation and selectively transplants the newer calculator work.

## Preserved from original site

- FWV visual system, header styling, global CSS, cards, blog system, guide structure, sitemap structure, PWA assets, and brand assets.
- Blog generator/admin structure is retained.
- Tip & Tab Split is preserved as a standalone utility calculator.

## Refocused public calculator lineup

### Credit → Credit Insight Intelligence
- `/credit-utilization` — Credit Utilization Optimizer
- `/debt-payoff-priority` — Debt Payoff Priority Ranker

### Real Estate → HavenMIND
- `/deal-snapshot` — Real Estate Deal Snapshot
- `/max-offer-arv` — Max Offer & ARV Calculator

### Utility
- `/tip-split` — Tip & Tab Split Calculator

## Removed/disabled from public flow

- Stripe checkout and Stripe webhook routes.
- Pricing/upgrade/pro/account/dashboard pages now redirect to `/calculators`.
- Old generic calculators are no longer in the public calculator registry or header dropdown.
- Old generic blog posts were moved to `content/blog-archive-generic` so the public blog feed starts focused on credit, debt payoff, and real estate investing.

## Blog generator refocus

The generator now suggests and links only these calculators:

- Credit Utilization Optimizer
- Debt Payoff Priority Ranker
- Real Estate Deal Snapshot Calculator
- Max Offer & ARV Calculator
- Tip & Tab Split Calculator

Credit topics should naturally lead toward Credit Insight Intelligence. Real estate topics should naturally lead toward HavenMIND.

## Build note

`package.json` build script is now `next build`; Prisma generation was removed because this refocused calculator site no longer depends on Stripe/subscription database flows.
