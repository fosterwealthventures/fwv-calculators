// app/layout.tsx
import CmpBanner from "@/components/consent/CmpBanner";
import Header from "@/components/Header";
import PWAInstaller from "@/components/PWAInstaller";
import { SessionProvider } from "@/components/SessionProvider";
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
        {/* Google Consent Mode v2 — DEFAULTS (must run before any ads/analytics) */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent','default',{
              'ad_storage':'denied',
              'ad_user_data':'denied',
              'ad_personalization':'denied',
              'analytics_storage':'denied',
              'functionality_storage':'granted',
              'security_storage':'granted'
            });
            window.__consentDefaultsFired = true;
          `}
        </Script>
        {/* CMP → Consent Mode bridge */}
        {/* Consent management will be configured with new ad network */}
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
    } catch(e){}
  };
`}
        </Script>
        {/* Ad network meta tags will be added when new network is approved */}
        {plan === "free" && (
          <>
            {/* Adsterra Banner Script */}
            <Script id="adsterra-banner" strategy="afterInteractive">
              {`
                (function(d, s, id) {
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(id)) return;
                  js = d.createElement(s); js.id = id;
                  js.async = true;
                  js.setAttribute('data-cfasync', 'false');
                  js.src = '//pl27994832.effectivegatecpm.com/1ae6deb893d2fba7115c6c32ef705246/invoke.js';
                  fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'adsterra-banner'));
              `}
            </Script>
          </>
        )}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://fosterwealthventures.store"} />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FWV Calculators" />
        <meta name="application-name" content="Foster Wealth Calculators" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="theme-color" content="#059669" />

      </head>

      <body className="min-h-screen bg-neutral-50 text-gray-900" suppressHydrationWarning>
        <SessionProvider>
          <EntitlementsProvider>
            <PWAInstaller />
            <Header />

            {/* PWA Install Banner */}
            <div id="pwa-install-banner" className="bg-emerald-600 text-white p-3 text-center">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <span>📱 Install Foster Wealth Calculators app for quick access!</span>
                <div className="flex gap-2">
                  <button id="pwa-install-button" className="bg-white text-emerald-600 px-4 py-1 rounded font-medium hover:bg-emerald-50 transition-colors">
                    Install App
                  </button>
                  <button id="pwa-install-manual" className="bg-emerald-700 text-white px-4 py-1 rounded font-medium hover:bg-emerald-800 transition-colors">
                    How to Install
                  </button>
                  <button id="pwa-dismiss-button" className="text-white hover:text-emerald-200 px-2">
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* PWA Install Instructions Modal */}
            <div id="pwa-instructions" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <h3 className="text-lg font-bold mb-4">How to Install the App</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Chrome/Edge:</span>
                    <span>Click the install icon (⊕) in the address bar or use the "Install App" button above</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Safari:</span>
                    <span>Click the share icon (📤) and select "Add to Home Screen"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Firefox:</span>
                    <span>Click the menu icon (⋮) and select "Install"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Mobile:</span>
                    <span>Look for "Add to Home Screen" prompt in your browser</span>
                  </div>
                </div>
                <button id="pwa-close-instructions" className="mt-4 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
                  Got it!
                </button>
              </div>
            </div>

            {/* Single column content (no ad sidebar) */}
            <main id="main" className="mx-auto max-w-6xl px-4 py-6">
              {children}

              {/* Adsterra Banner Container - only shown for free plan users */}
              {plan === "free" && (
                <div className="mt-8">
                  <div id="container-1ae6deb893d2fba7115c6c32ef705246" className="adsterra-native-banner" style={{ textAlign: "center", margin: "16px 0", border: "1px dashed #ccc", padding: "10px" }}>
                    Ad container - ads should appear here
                  </div>
                </div>
              )}
            </main>

            {/* Simple in-house CMP banner (non-TCF) */}
            <CmpBanner />

            <Footer />
          </EntitlementsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
