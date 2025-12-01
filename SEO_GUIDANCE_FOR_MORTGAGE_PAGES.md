# SEO Strategy for Handling Duplicate Content Between Calculator and Store Pages

## Overview

To avoid SEO confusion between the calculator and store pages, we need to implement a clear strategy that differentiates the content and purpose of each page while ensuring both pages provide value to users.

## Recommended Strategy

### 1. Page Differentiation

#### Calculator Page (calculators.fosterwealthventures.com/mortgage)
- **Purpose**: Functional tool for calculating mortgage payments
- **Content**: Interactive calculator with input fields and results
- **Target Audience**: Users actively looking to calculate mortgage payments
- **Metadata**: Focus on functionality and calculations
- **Canonical URL**: `https://calculators.fosterwealthventures.com/mortgage`

#### Store Page (fosterwealthventures.store/mortgage)
- **Purpose**: Marketing/overview page about the mortgage calculator
- **Content**: Benefits, screenshots, explanations, and CTAs
- **Target Audience**: Users researching mortgage calculator options
- **Metadata**: Focus on value proposition and brand
- **Canonical URL**: `https://fosterwealthventures.store/mortgage`

### 2. Content Strategy

#### Calculator Page Content:
- Interactive mortgage calculator
- Brief explanation of how to use the calculator
- Input fields for loan amount, interest rate, term, etc.
- Results display with monthly payment, total interest, etc.
- FAQ section with schema markup (already implemented)
- Links to related calculators

#### Store Page Content:
- Introduction to the mortgage calculator
- Benefits of using the calculator
- Screenshots of the calculator in action
- Step-by-step guide on how to use it
- Testimonials or use cases
- Strong CTAs directing to the calculator page
- Different wording - not copy-pasted content

### 3. Metadata Configuration

#### Calculator Page Metadata:
```typescript
export const metadata: Metadata = {
  title: "Mortgage Calculator – Estimate Monthly House Payments (Free P&I Tool)",
  description: "Use this free mortgage calculator to estimate your monthly house payment, total interest, and payoff cost. Compare loan terms and rates before you buy or refinance.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/mortgage",
  },
  openGraph: {
    title: "Mortgage Calculator – Estimate Monthly House Payments",
    description: "Instantly estimate your monthly mortgage payment, total interest, and payoff cost. Free calculator for homebuyers, refinancers, and investors.",
    url: "https://calculators.fosterwealthventures.com/mortgage",
    siteName: "Foster Wealth Calculators",
    type: "website",
  },
};
```

#### Store Page Metadata:
```typescript
export const metadata: Metadata = {
  title: "Free Mortgage Calculator by Foster Wealth Ventures",
  description: "Explore our free mortgage calculator from Foster Wealth Ventures. See your estimated monthly payment and total loan cost, then access more money tools in the FWV Calculators app.",
  alternates: {
    canonical: "https://fosterwealthventures.store/mortgage",
  },
  openGraph: {
    title: "Free Mortgage Calculator by Foster Wealth Ventures",
    description: "Learn how our mortgage calculator helps you estimate monthly payments, compare loan terms, and make smarter homebuying decisions.",
    url: "https://fosterwealthventures.store/mortgage",
    siteName: "Foster Wealth Ventures Store",
    type: "website",
  },
};
```

### 4. Call-to-Action Strategy

#### Store Page CTA:
```jsx
<Link
  href="https://calculators.fosterwealthventures.com/mortgage"
  className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
>
  Open Free Mortgage Calculator
</Link>
```

#### Calculator Page CTA:
```jsx
<Link
  href="https://fosterwealthventures.store/mortgage"
  className="inline-flex px-6 py-3 rounded-xl border border-gray-300 text-gray-700"
>
  Learn More About This Calculator
</Link>
```

### 5. Internal Linking Strategy

- Calculator page should link to store page for users who want more information
- Store page should prominently link to calculator page for users ready to calculate
- Both pages should link to related calculators and resources

### 6. Sitemap Configuration

#### Calculators Domain Sitemap:
```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://calculators.fosterwealthventures.com/mortgage",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // ...other calculator pages
  ];
}
```

#### Store Domain Sitemap:
```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fosterwealthventures.store/mortgage",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // ...other store pages
  ];
}
```

## Implementation Checklist

- [ ] Implement distinct metadata for both pages
- [ ] Create unique content for each page
- [ ] Add appropriate CTAs on both pages
- [ ] Configure sitemaps for both domains
- [ ] Add FAQ schema to calculator page (completed)
- [ ] Set up proper internal linking between pages
- [ ] Monitor performance and rankings for both pages

## Monitoring and Maintenance

1. **Track Performance**: Use Google Search Console to monitor rankings for both pages
2. **Analyze Traffic**: Check which page attracts more traffic for different intents
3. **Update Content**: Regularly refresh content to keep it relevant and valuable
4. **Test CTAs**: Monitor CTR on different CTAs and optimize as needed

This strategy ensures that both pages serve their distinct purposes while complementing each other, avoiding duplicate content issues and providing a clear user journey.