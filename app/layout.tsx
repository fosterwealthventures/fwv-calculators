// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Foster Wealth Calculators",
  description: "Professional Business & Financial Calculator Suites",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Foster Wealth Ventures" width={140} height={40} priority />
            <h1 className="text-lg font-semibold text-brand-green">Foster Wealth Calculators</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <footer className="bg-brand-green text-white py-6">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-brand-gold">Foster Wealth Ventures</span>. All
              rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
