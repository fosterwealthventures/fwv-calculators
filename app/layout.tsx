/* eslint-disable @next/next/no-img-element */
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { cookies } from "next/headers";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import { PlanProvider } from "@/providers/PlanProvider";
import AdSlot from "@/components/ads/AdSlot"; // ← safe slot

export const dynamic = "force-dynamic";

type Plan = "free" | "plus" | "pro" | "premium";
const isProd = process.env.NODE_ENV === "production";

// AdSense env flags (set these in Vercel)
const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";   // e.g. "ca-pub-xxxxxxxx"
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

export const metadata: Metadata = {
  title: "Foster Wealth Calculators",
  description:
    "Free and premium financial calculators by Foster Wealth Ventures. Upgrade to unlock advanced calculators and an ad-free experience.",
  icons: { icon: "/favicon.ico" },
};

function parsePlan(v?: string | null): Plan {
  const x = (v || "").toLowerCase().trim();
  return x === "plus" || x === "pro" || x === "premium" ? (x as Plan) : "free";
}

function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Foster Wealth Ventures" width={184} height={100} className="rounded-sm" />
          <span className="text-lg md:text-xl font-semibold text-emerald-900">
            Foster Wealth Calculators
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-700">
          <a href="/" className="hover:text-emerald-800">Home</a>
          <a href="/dashboard" className="hover:text-emerald-800">Calculators</a>
          <a href="/pricing" className="hover:text-emerald-800">Pricing</a>
          <a href="/guide" className="hover:text-emerald-800">Guides</a>
          <a href="/blog" className="hover:text-emerald-800">Blog</a>
          <a href="/about" className="hover:text-emerald-800">About</a>
          <a href="/contact" className="hover:text-emerald-800">Contact</a>
          <a href="/privacy" className="hover:text-emerald-800">Privacy</a>
          <a href="/terms" className="hover:text-emerald-800">Terms</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 flex flex-wrap gap-4 items-center justify-between">
        <div>© {new Date().getFullYear()} Foster Wealth Ventures</div>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-emerald-800" href="/about">About</a>
          <a className="hover:text-emerald-800" href="/blog">Blog</a>
          <a className="hover:text-emerald-800" href="/privacy">Privacy</a>
          <a className="hover:text-emerald-800" href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function Sidebar({ showAds }: { showAds: boolean }) {
  // optional per-page slots via env
  const SLOT1 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 || "";
  const SLOT2 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2 || "";

  if (!showAds) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
        <div className="text-sm font-medium text-green-800">🎉 Ad-Free Experience</div>
        <div className="text-xs text-green-600 mt-1">
          <a href="/pricing" className="underline hover:text-green-800">Manage plan</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {SLOT1 && <AdSlot slot={SLOT1} />}
      {SLOT2 && <AdSlot slot={SLOT2} />}
      {!SLOT1 && !SLOT2 && !isProd && (
        <div className="rounded-xl border border-dashed p-3 text-center text-xs text-gray-500">
          (dev) Set NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 / SLOT2
        </div>
      )}
    </div>
  );
}

function RootLayoutInner({ children, plan }: { children: React.ReactNode; plan: Plan }) {
  // Show ads only for FREE plan, in production, with env enabled + client set.
  const showAds = plan === "free" && isProd && ADS_ENABLED && !!ADS_CLIENT;

  return (
    <html lang="en" data-plan={plan}>
      <head>
        {/* Helps Google verify ownership */}
        {ADS_CLIENT && <meta name="google-adsense-account" content={ADS_CLIENT} />}

        {/* Remove noisy extension attributes before hydration (harmless noop) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try{var h=document.documentElement;['data-qb-installed','data-new-gr-c-s-check-loaded','data-gr-ext-installed'].forEach(a=>h.removeAttribute(a));}catch(e){}
            `,
          }}
        />

        {/* Load AdSense after hydration so <ins> exists first */}
        {showAds && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
              ADS_CLIENT
            )}`}
          />
        )}
      </head>

      <body className="min-h-screen bg-neutral-50 text-gray-900" suppressHydrationWarning>
        <EntitlementsProvider>
          <PlanProvider initialPlan={plan}>
            <Header />
            <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <main>{children}</main>
              <aside className="sticky top-4 self-start">
                <Sidebar showAds={showAds} />
              </aside>
            </div>
            <Footer />
          </PlanProvider>
        </EntitlementsProvider>
      </body>
    </html>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const plan = parsePlan(cookieStore.get("fwv_plan")?.value);
  return <RootLayoutInner plan={plan}>{children}</RootLayoutInner>;
}
