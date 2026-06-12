# Foster Wealth Calculators

A comprehensive financial calculator suite built with Next.js, TypeScript, and Tailwind CSS.

## Development

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. The build process will automatically:

1. Build the Next.js application
2. Generate static pages where possible
3. Deploy to your configured Vercel domain

### Post-Deployment Verification

After each production deployment, it's important to clear browser cache to ensure the latest CSS and JavaScript bundles are loaded:

**For Users:**
- Hard refresh the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open the site in an incognito/private window
- Or clear browser cache completely

**For Developers:**
- Use browser developer tools to disable cache when testing
- Test in multiple browsers to ensure consistency

This step is crucial after layout or styling changes to avoid cached CSS/JS from showing outdated spacing, positioning, or visual elements.

## Project Structure

- `app/` - Next.js 13+ app directory with route handlers
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `public/` - Static assets
- `content/` - Blog posts and static content

## 🚀 Deploy (Vercel)

- Auto deploys on push to `main`
- Check progress: Vercel → Project → Deployments

## ⚡ Cache & CDN

- **HTML & data routes**: `no-store` (always fresh)
- **Hashed assets**: `/_next/static/*` → immutable, 1 year cache
- **Public assets** (e.g., `/public/logo.png`): 1 day cache, must-revalidate

## 🔄 Cache-busting (see changes instantly)

- Do a **hard refresh** (`Ctrl/Cmd + Shift + R`) or open an incognito window
- For `/public` files, change the **filename** or add a **query version** where referenced:
  - `"/logo.png?v=2025-10-17"` (update the `v` value when you redeploy)
- Next.js hashed files under `/_next/static` are updated automatically each build

## Key Features

- **Financial Calculators**: ROI, Break-even, Mortgage, Interest, and more
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Blog System**: Markdown-based content with dynamic routing
- **Ad Integration**: Configurable advertising system
- **User Management**: Entitlements and subscription tiers