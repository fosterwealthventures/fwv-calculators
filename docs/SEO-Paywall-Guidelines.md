FWV Calculators — SEO + Paywall Best Practices Guide
How to Build High-Ranking, Paywall-Safe Landing Pages for Free, Plus, and Pro Calculators

Version: 1.0
Maintained by: Foster Wealth Ventures
Applies to:

calculators.fosterwealthventures.com

fosterwealthventures.store

All current & future Free, Plus, and Pro Calculators

📌 Overview

This document defines the official standards for how all FWV calculators must be structured to achieve:

High Google Search rankings

Zero duplicate content penalties

Complete paywall compliance

Maximum upgrade conversions

Consistent branding and layout

Clear separation between Free vs Plus vs Pro

All new calculators added to the system must follow this pattern to maintain SEO performance and avoid Search Console issues.

🧱 Part 1 — Page Types & Requirements

FWV has three calculator tiers, and each requires a different SEO pattern.

1. Free Calculators

(Always fully accessible)

Examples: Mortgage, ROI, Break-Even, Interest, Shopping Budget, Tip-Split, Freelancer Rate

Requirements:

✔ Full calculator functionality visible
✔ Full SEO content (hero, explainer sections, FAQ, FAQ schema)
✔ No gating logic
✔ Calculator component loaded normally
✔ Included in sitemap with high priority
✔ Store domain gets a distinct overview page

2. Plus Calculators

(Gated; paid subscriber tools)

Examples: Savings Growth, Debt Payoff, Order Split (Plus)

Requirements:

✔ SEO landing page visible to everyone
✔ No full calculator for free users
✔ Blurred static screenshot preview
✔ Overlay upgrade box with CTA to /pricing
✔ Calculator component never loads for Free users
✔ Actual calculator only loads for logged-in Plus users
✔ Use data-nosnippet around the blurred preview
✔ FAQ + JSON-LD schema required
✔ Store domain gets a separate “overview + CTA” page
✔ Must avoid duplicated text between store + calculators domains

3. Pro Calculators

(Gated; top-tier tools)

Examples: Employee Cost Pro, Expense Split Deluxe

Requirements:

✔ Same as Plus, but branded FWV PRO
✔ Purple-themed upgrade overlay
✔ More robust explanation content
✔ SEO on both calculators + store domains
✔ Use screenshot blur + CTA (Option 2 standard)
✔ Load actual tool only for authenticated Pro users

🧱 Part 2 — Calculator Landing Page Structure

Every calculator page on the calculators domain must follow this structure:

<main>
  1. Metadata (required)
  2. Hero Section
  3. Primary CTA buttons
  4. Explainer section(s)
  5. Internal links (contextual)
  6. Calculator Presentation
      - Free: full calculator component
      - Plus/Pro: blurred screenshot + upgrade overlay
  7. FAQ Section
  8. FAQ JSON-LD Schema
  9. Bottom CTA
 10. Ad placements (Free calculators only)
</main>

🧱 Part 3 — Paywall Safe Zones

Google has strict rules around “cloaked” content.

FWV must follow these:

❗ Anything behind a paywall MUST be wrapped in:
<div data-nosnippet>
  ...blurred screenshot...
  ...upgrade overlay...
</div>


Google:

Can index the landing page content

Cannot index the hidden content

Will not penalize the paywall

❗ DO NOT:

Render the real calculator for unauthenticated users

Redirect users automatically

Hide text differently for Google vs real users

Put visible text inside data-nosnippet

🧱 Part 4 — Blurred Screenshot Pattern
This is the official FWV method for paid tools.
<LockedProCalculatorPreview
  imageSrc="/images/expense-split-deluxe-preview.png"
  title="Expense Split Deluxe"
/>


The component:

Shows a blurred screenshot

Prevents Google from indexing locked content

Displays a premium upgrade box

Keeps your real tool protected

Screenshot guidelines:

PNG or JPG

1200–1600px wide

Named: [calculator-name]-preview.png

Stored in /public/images/

🧱 Part 5 — FAQ & JSON-LD Schema

Every calculator page must include:

✔ FAQ section (visible HTML)
✔ FAQ schema (JSON-LD, matching visible content)

This increases:

Search rankings

Featured snippet chances

Page authority

Schema placed near the bottom of page:
<Script 
  id="calculator-faq-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({...}) }}
/>

🧱 Part 6 — Store Domain Role

The store domain (fosterwealthventures.store) is NOT allowed to duplicate text from the calculators domain.

Rules:

✔ Store pages must be marketing/overview pages
✔ Clear CTA linking to calculators domain
✔ Text must be unique
✔ Metadata must differ
✔ No blurred screenshot required (optional)
✔ No calculator embed

Purpose:

Store = “What this calculator is and why it matters”
Calculators = “Use or preview the calculator”

Google sees them as two different pages, preventing duplication penalties.

🧱 Part 7 — Metadata Standards

All FWV calculator pages must include:

✔ Title
✔ Description
✔ Canonical URL
✔ OpenGraph block
Canonical examples:

Free:

alternates: {
  canonical: "https://calculators.fosterwealthventures.com/mortgage",
}


Plus/Pro:

alternates: {
  canonical: "https://calculators.fosterwealthventures.com/savings-growth",
}


Store:

alternates: {
  canonical: "https://fosterwealthventures.store/savings-growth",
}

🧱 Part 8 — Internal Linking Protocol

Each calculator page must include:

1–3 internal links
To related tools only

Examples:

Mortgage ➝ ROI, Interest

Shopping Budget ➝ Tip Split, Interest

Employee Cost Pro ➝ Break-Even, ROI

This helps build a strong topical cluster and improves rankings.

🧱 Part 9 — Sitemap Rules
calculators.fosterwealthventures.com/sitemap

Includes all Free, Plus, and Pro calculators

Plus/Pro pages must be included (SEO landing pages are indexable)

Priority:

0.9 Free

0.75 Plus

0.7 Pro

fosterwealthventures.store/sitemap

Includes only high-level marketing pages

Lower priority (0.6–0.7)

🧱 Part 10 — Adding a New Calculator (Checklist)

Every new tool MUST follow this procedure:

✔ Step 1 — Create calculators-domain landing page
✔ Step 2 — Add Metadata block
✔ Step 3 — Add Hero + CTA
✔ Step 4 — Add Explainer section
✔ Step 5 — Add blurred preview (Plus/Pro only)
✔ Step 6 — Add calculator component (Free OR authenticated users only)
✔ Step 7 — Add FAQ text
✔ Step 8 — Add FAQ schema
✔ Step 9 — Add internal links
✔ Step 10 — Create store-domain page with unique text
✔ Step 11 — Add both to sitemap
✔ Step 12 — Test with Google Rich Results Tool
✔ Step 13 — Submit URL to Search Console

This ensures the page ranks, converts, and complies with Google policies.

🧱 Part 11 — Paywall Gradient System

To keep branding consistent:

Free

Green theme

No gating

PLUS

Emerald theme

“FWV PLUS Exclusive”

Screenshot preview

Blurred + Upgrade box

PRO

Purple theme

“FWV PRO Exclusive”

Screenshot preview

Blurred + Upgrade box

Premium positioning

🧱 Part 12 — Forbidden Patterns (MUST NOT DO)

🚫 Hiding content from search bots
🚫 Rendering the full calculator for free users
🚫 Duplicating calculator text across domains
🚫 Redirecting free users instantly
🚫 Blocking landing pages from indexing
🚫 Loading calculator inside data-nosnippet
🚫 Showing different content to Google vs users

Breaking any of these can cause SEO penalties.

🧱 Part 13 — Recommended Folder Structure
/app
  /mortgage
  /roi
  /break-even
  /freelancer-rate
  /interest
  /shopping-budget
  /tip-split
  /savings-growth
  /debt-payoff
  /order-split
  /employee-cost-pro
  /expense-split-deluxe

/public
  /images
    mortgage-preview.png
    roi-preview.png
    ...
    savings-growth-preview.png
    debt-payoff-preview.png
    order-split-preview.png
    employee-cost-pro-preview.png
    expense-split-deluxe-preview.png

/docs
  SEO-Paywall-Guidelines.md

🎯 Conclusion

This document is now your master operating manual for building, maintaining, and expanding FWV’s calculator ecosystem.

Following these patterns ensures:

✔ Excellent SEO
✔ Clean paywall behavior
✔ Scaling to 30+ calculators without conflict
✔ Google-compliant premium features
✔ Higher upgrade conversions
✔ No duplicate content risk
✔ Strong brand consistency