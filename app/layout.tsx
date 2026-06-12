// app/layout.tsx
import CmpBanner from "@/components/consent/CmpBanner";
import Header from "@/components/Header";
import PWAInstaller from "@/components/PWAInstaller";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foster Wealth Calculators",
  description: "Free credit, debt payoff, real estate, and everyday money calculators by Foster Wealth Ventures.",
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fosterwealthventures.store"),
  alternates: { canonical: "/" },
};

function Footer() {
  return (
    <footer className="w-full border-t mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 flex flex-wrap gap-4 items-center justify-between">
        <div>&copy; {new Date().getFullYear()} Foster Wealth Ventures</div>
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-plan="free">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" defer></script>
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
        <PWAInstaller />
        <Header />

        <main id="main" className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>

        <CmpBanner />
        <Footer />
      </body>
    </html>
  );
}
