/* eslint-disable @next/next/no-img-element */
// app/layout.tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import React from 'react';
import './globals.css';

import AdSlot from '@/components/ads/AdSlot';
import ClientAdsLoader from '@/components/ads/ClientAdsLoader';
import { ADS_CLIENT, ADS_ENABLED } from '@/lib/ads-config';
import { EntitlementsProvider } from '@/lib/entitlements-client';
import { PlanProvider } from '@/providers/PlanProvider';

export const dynamic = 'force-dynamic';

type Plan = 'free' | 'plus' | 'pro' | 'premium';
const isProd = process.env.NODE_ENV === 'production';

export const metadata: Metadata = {
  title: 'Foster Wealth Calculators',
  description:
    'Free and premium financial calculators by Foster Wealth Ventures. Upgrade to unlock advanced calculators and an ad-free experience.',
  icons: { icon: '/favicon.ico' },
};

function parsePlan(v?: string | null): Plan {
  const x = (v || '').toLowerCase().trim();
  return x === 'plus' || x === 'pro' || x === 'premium' ? (x as Plan) : 'free';
}

function Header() {
  return (
    <header className="header-regal">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <a href="/" className="logo-ring-regal flex items-center gap-3 shrink-0 transition-transform hover:scale-105">
          <img src="/fwv-logo-gold.svg" alt="Foster Wealth Ventures" width={184} height={100} className="rounded-sm" />
          <span className="text-lg md:text-xl font-bold text-gradient-gold">Calculators</span>
        </a>
        <nav className="hidden md:flex items-center gap-5">
          <a className="nav-link-regal" href="/">Home</a>
          <a className="nav-link-regal" href="/dashboard">Calculators</a>
          <a className="nav-link-regal" href="/pricing">Pricing</a>
          <a className="nav-link-regal" href="/guide">Guides</a>
          <a className="nav-link-regal" href="/blog">Blog</a>
          <a className="nav-link-regal" href="/about">About</a>
          <a className="nav-link-regal" href="/contact">Contact</a>
          <a className="nav-link-regal" href="/privacy">Privacy</a>
          <a className="nav-link-regal" href="/terms">Terms</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-plum-200/60 bg-plum-50/30 dark:bg-plum-900/20 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-plum-600 dark:text-plum-300 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Foster Wealth Ventures</span>
          <span className="text-plum-400">•</span>
          <span className="text-plum-500 dark:text-plum-400">Professional Financial Tools</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <a className="link-regal" href="/about">About</a>
          <a className="link-regal" href="/blog">Blog</a>
          <a className="nav-link-regal" href="/privacy">Privacy</a>
          <a className="nav-link-regal" href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function Sidebar({ showAds }: { showAds: boolean }) {
  const SLOT1 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 || '';
  const SLOT2 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2 || '';

  if (!showAds) {
    return (
      <div className="card-regal p-4 text-center">
        <div className="text-sm font-medium text-plum-800">🎉 Ad-Free Experience</div>
        <div className="text-xs text-plum-600 mt-1">
          <a href="/pricing" className="link-regal">Manage plan</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {SLOT1 && (
        <div className="flex justify-center">
          <AdSlot
            slot={SLOT1}
            style={{ width: 300, height: 250, display: 'block' }}
            format="rectangle"
            responsive={false}
          />
        </div>
      )}
      {SLOT2 && (
        <div className="flex justify-center">
          <AdSlot
            slot={SLOT2}
            style={{ width: 300, height: 600, display: 'block' }}
            format="rectangle"
            responsive={false}
          />
        </div>
      )}
      {!SLOT1 && !SLOT2 && !isProd && (
        <div className="card-regal p-3 text-center text-xs text-plum-500">
          (dev) Set NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 / SLOT2
        </div>
      )}
    </div>
  );
}

function RootLayoutInner({ children, plan }: { children: React.ReactNode; plan: Plan }) {
  // Show ads only for free plan in production, and only when Adsense is enabled+configured.
  const showAds = plan === 'free' && isProd && ADS_ENABLED && !!ADS_CLIENT;

  return (
    <html lang="en" className="dark" data-plan={plan}>
      <head>
        {ADS_CLIENT && <meta name="google-adsense-account" content={ADS_CLIENT} />}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
      </head>

      <body className="min-h-dvh" suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 page-bg-regal" />
        {/* Single global loader */}
        <ClientAdsLoader enabled={ADS_ENABLED} />

        <EntitlementsProvider>
          <PlanProvider initialPlan={plan}>
            <Header />
            <main className="min-h-screen">
              <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                  <div className="animate-fade-in">
                    {children}
                  </div>
                  <aside className="sticky top-4 self-start animate-slide-up">
                    <Sidebar showAds={showAds} />
                  </aside>
                </div>
              </div>
            </main>
            <Footer />
          </PlanProvider>
        </EntitlementsProvider>
      </body>
    </html>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // In your Next version/types, cookies() returns a Promise
  const cookieStore = await cookies();                 // <-- await here
  const plan = parsePlan(cookieStore.get('fwv_plan')?.value);

  return <RootLayoutInner plan={plan}>{children}</RootLayoutInner>;
}