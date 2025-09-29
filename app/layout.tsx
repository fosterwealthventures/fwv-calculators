// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { cookies } from "next/headers";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import GoogleAd from "@/components/ads/GoogleAd";
import ClientAdsLoader from "@/components/ads/ClientAdsLoader";
import { PlanProvider } from "@/providers/PlanProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Foster Wealth Calculators",
  description:
    "Free and premium financial calculators by Foster Wealth Ventures. Upgrade to unlock advanced calculators and an ad-free experience.",
  icons: { icon: "/favicon.ico" },
};

type Plan = "free" | "plus" | "pro" | "premium";

function parsePlan(v?: string | null): 'free' | 'plus' | 'pro' | 'premium' {const x = (v || '').toLowerCase().trim();
  return x === 'plus' || x === 'pro' || x === 'premium' ? (x as any) : 'free';
}

const isProd = process.env.NODE_ENV === "production";

function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Foster Wealth Ventures" width={184} height={100} className="rounded-sm" />
          <span className="text-lg md:text-xl font-semibold text-emerald-900">Foster Wealth Calculators</span>
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

function PlanDebug({ plan, showAds }: { plan: Plan; showAds: boolean }) {
  if (isProd) return null;
  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-md bg-black/70 px-2.5 py-1.5 text-xs text-white">
      plan=<b>{plan}</b> | showAds=<b>{String(showAds)}</b>
    </div>
  );
}

function SidebarAds() {
  const SLOT1 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1 || "";
  const SLOT2 = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2 || "";

  return (
    <div className="space-y-4">
      {SLOT1 ? (
        <GoogleAd slot={SLOT1} />
      ) : !isProd ? (
        <div className="rounded-xl border border-dashed p-3 text-center text-xs text-gray-500">
          Set NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT1
        </div>
      ) : null}

      {SLOT2 ? (
        <GoogleAd slot={SLOT2} />
      ) : !isProd ? (
        <div className="rounded-xl border border-dashed p-3 text-center text-xs text-gray-500">
          Set NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT2
        </div>
      ) : null}
    </div>
  );
}

// Client component wrapper for the ad-free message
function AdFreeMessage({ plan }: { plan: Plan }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
      <div className="text-sm font-medium text-green-800">🎉 Ad-Free Experience</div>
      <div className="text-xs text-green-600 mt-1">
        You're enjoying our {plan} plan. <a href="/pricing" className="underline hover:text-green-800">Manage plan</a>
      </div>
    </div>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const plan = parsePlan(cookieStore.get("fwv_plan")?.value);
  const showAds = plan === "free";
  const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en" data-plan={plan}>
      <head>
        {/* Helpful for Google */}
        {ADSENSE_CLIENT ? (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        ) : null}
        {/* Remove extension noise before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var html = document.documentElement;
                  var attrs = ['data-qb-installed','data-new-gr-c-s-check-loaded','data-gr-ext-installed'];
                  for (var i=0;i<attrs.length;i++) if (html.hasAttribute(attrs[i])) html.removeAttribute(attrs[i]);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Server-side loader (still keep client fallback below) */}
        {showAds && ADSENSE_CLIENT ? (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
              ADSENSE_CLIENT
            )}`}
          />
        ) : null}
      </head>

      <body className="min-h-screen bg-neutral-50 text-gray-900" suppressHydrationWarning>
        <EntitlementsProvider>
          <PlanProvider initialPlan={plan}>
            {/* Client-side guarantee that the script exists */}
            <ClientAdsLoader enabled={showAds} />

            <Header />

            {/* Always render the sidebar column so you SEE the space */}
            <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <main>{children}</main>
              <aside className="sticky top-4 self-start">
                {showAds ? (
                  <SidebarAds />
                ) : (
                  <AdFreeMessage plan={plan} />
                )}
              </aside>
            </div>

            <Footer />
            <PlanDebug plan={plan} showAds={showAds} />
          </PlanProvider>
        </EntitlementsProvider>
      </body>
    </html>
  );
}