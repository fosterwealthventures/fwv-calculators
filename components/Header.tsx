// components/Header.tsx
"use client";

import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import HeaderNavCalculators from "@/components/HeaderNavCalculators";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Merged header:
 * - Classic solid purple bar, high-contrast white links
 * - Logo + gold-gradient "Calculators" label (like your screenshot)
 * - Full top-nav links (Calculators, Home, Pricing, Guides, Blog, About, Contact, Privacy, Terms)
 * - Optional calculators dropdown hidden behind a small chevron next to the "Calculators" link
 * - Mobile menu with the same links and an expandable calculators list
 *
 * IMPORTANT: expects /public/logo.svg to exist (adjust path/size if different).
 * Uses .header-regal, .nav-link-regal, and .text-gradient-gold utilities from globals.css.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false); // desktop dropdown
  const [authOpen, setAuthOpen] = useState(false); // auth dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCalcOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      data-site-header
      className="header-regal sticky top-0 z-40 border-b border-plum-800 bg-plum-900 text-white"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo + Gold "Calculators" label */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/fwv-logo-gold.svg"
            alt="Foster Wealth Ventures"
            width={140}
            height={60}
            priority
          />
          <span className="hidden sm:inline-block text-gradient-gold text-lg font-semibold tracking-wide">
            Calculators
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {/* Calculators link + optional dropdown chevron */}
          <div className="relative inline-flex items-center" ref={dropdownRef}>
            <Link href="/calculators" className="nav-link-regal text-white/90 hover:text-white">
              Calculators
            </Link>
            <button
              aria-label="Open calculators menu"
              aria-expanded={calcOpen}
              aria-haspopup="menu"
              onClick={() => setCalcOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && calcOpen) {
                  setCalcOpen(false);
                } else if (e.key === 'ArrowDown' && !calcOpen) {
                  e.preventDefault();
                  setCalcOpen(true);
                }
              }}
              className="ml-1 rounded-md p-1 text-white/80 hover:bg-white/10"
            >
              <svg viewBox="0 0 20 20" className={`h-4 w-4 transition ${calcOpen ? "rotate-180" : ""}`}>
                <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Dropdown */}
            {calcOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-[280px] max-h-[70vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-xl p-2 pointer-events-auto"
                onMouseLeave={() => setCalcOpen(false)}
              >
                <HeaderNavCalculators />
              </div>
            )}
          </div>

          {/* The rest of your top links (kept intact) */}
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/mortgage">Mortgage</HeaderLink>
          <HeaderLink href="/pricing">Pricing</HeaderLink>
          <HeaderLink href="/guide">Guides</HeaderLink>
          <HeaderLink href="/blog">Blog</HeaderLink>
          <HeaderLink href="/about">About</HeaderLink>
          <HeaderLink href="/contact">Contact</HeaderLink>
          <HeaderLink href="/privacy">Privacy</HeaderLink>
          <HeaderLink href="/terms">Terms</HeaderLink>

          {/* Authentication dropdown */}
          <div className="relative inline-flex items-center" ref={authDropdownRef}>
            <button
              onClick={() => setAuthOpen((v) => !v)}
              aria-expanded={authOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              <span>{status === "loading" ? "Loading..." : session ? "Account" : "Sign In"}</span>
              <svg viewBox="0 0 20 20" className={`h-4 w-4 transition ${authOpen ? "rotate-180" : ""}`}>
                <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Auth dropdown */}
            {authOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-[200px] max-h-[70vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-xl p-4 pointer-events-auto"
                onMouseLeave={() => setAuthOpen(false)}
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                  </div>
                ) : session ? (
                  <div className="space-y-3">
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.email}</p>
                      <p className="text-xs text-gray-500">Signed in</p>
                    </div>
                    <Link
                      href="/account"
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAuthOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <SignOutButton />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">Sign in to access your subscription across devices</p>
                    <SignInButton />
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMobileOpen((s) => !s)}
          aria-expanded={mobileOpen}
          aria-label="Open menu"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>

      {/* Mobile menu (same links + expandable calculators) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-plum-800 bg-plum-900/95">
          <nav className="mx-auto max-w-7xl px-4 py-2">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-white/90 hover:bg-white/10">
                Calculators
                <svg aria-hidden viewBox="0 0 20 20" className="ml-1 h-4 w-4 opacity-90">
                  <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </summary>
              <div className="mt-1 rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-xl p-2">
                <HeaderNavCalculators />
              </div>
            </details>

            <MobileLink href="/" onClick={() => setMobileOpen(false)}>
              Home
            </MobileLink>
            <MobileLink href="/mortgage" onClick={() => setMobileOpen(false)}>
              Mortgage
            </MobileLink>
            <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </MobileLink>
            <MobileLink href="/guide" onClick={() => setMobileOpen(false)}>
              Guides
            </MobileLink>
            <MobileLink href="/blog" onClick={() => setMobileOpen(false)}>
              Blog
            </MobileLink>
            <MobileLink href="/about" onClick={() => setMobileOpen(false)}>
              About
            </MobileLink>
            <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </MobileLink>
            <MobileLink href="/privacy" onClick={() => setMobileOpen(false)}>
              Privacy
            </MobileLink>
            <MobileLink href="/terms" onClick={() => setMobileOpen(false)}>
              Terms
            </MobileLink>

            {/* Authentication section */}
            <div className="border-t border-plum-800 mt-2 pt-2">
              {status === "loading" ? (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white truncate">{session.user?.email}</p>
                    <p className="text-xs text-white/70">Signed in</p>
                  </div>
                  <MobileLink href="/account" onClick={() => setMobileOpen(false)}>
                    Account Settings
                  </MobileLink>
                  <div className="px-3 py-2">
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <SignInButton />
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- small helpers (unchanged behavior) ---------- */

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="nav-link-regal text-white/90 hover:text-white transition"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
