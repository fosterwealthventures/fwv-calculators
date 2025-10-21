// app/layout.tsx
import Header from "@/components/Header";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script"; // ← added
import React from "react";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Foster Wealth Calculators",
  description:
    "Free and premium financial calculators by Foster Wealth Ventures. Upgrade to unlock advanced calculators.",
  icons: { icon: "/favicon.ico" },
};

type Plan = "free" | "plus" | "pro" | "premium";
function parsePlan(v?: string | null): Plan {
  const x = (v || "").toLowerCase().trim();
  return x === "plus" || x === "pro" || x === "premium" ? (x as Plan) : "free";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const plan = parsePlan(cookieStore.get("fwv_plan")?.value);

  return (
    <html lang="en" data-plan={plan}>
      <head>
        {/* Google Consent Mode v2 (no GTM, default deny) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent','default',{
                'ad_storage':'denied',
                'ad_user_data':'denied',
                'ad_personalization':'denied',
                'analytics_storage':'denied',
                'functionality_storage':'granted',
                'security_storage':'granted'
              });
            `,
          }}
        />
        {/* CMP callback bridge: call window.onCmpConsentUpdate({ ads: true/false, analytics: true/false }) */}
        <Script id="cmp-bridge" strategy="afterInteractive">
          {`
  window.onCmpConsentUpdate = function (consent) {
    try {
      var ads = !!(consent && consent.ads);
      var analytics = !!(consent && consent.analytics);
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('consent','update',{
        ad_storage: ads ? 'granted' : 'denied',
        ad_user_data: ads ? 'granted' : 'denied',
        ad_personalization: ads ? 'granted' : 'denied',
        analytics_storage: analytics ? 'granted' : 'denied'
      });
    } catch(e) { /* no-op */ }
  };
`}
        </Script>
        {/* Google AdSense verification + loader */}
        <meta name="google-adsense-account" content="ca-pub-7798339637698835" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7798339637698835"
          crossOrigin="anonymous"
        />
        {/* AdSense auto ads – ONE global tag only */}
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
        />
      </head>

      <body className="min-h-screen bg-neutral-50 text-gray-900" suppressHydrationWarning>
        <EntitlementsProvider>
          <Header />

          {/* Single column content (no ad sidebar) */}
          <main id="main" className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </main>

          <Footer />
        </EntitlementsProvider>
      </body>
    </html>
  );
}
