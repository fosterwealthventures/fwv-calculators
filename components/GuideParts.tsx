//components/GuideParts.tsx
import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";
import { Share2 } from "lucide-react";

/* ---------- Layout / Typography helpers ---------- */
export function Section({ children }: PropsWithChildren) {
  return <section className="prose prose-slate max-w-none">{children}</section>;
}
export function H2({ children }: PropsWithChildren) {
  return <h2 className="mt-10 text-2xl font-bold">{children}</h2>;
}
export function P({ children }: PropsWithChildren) {
  return <p className="mt-4 leading-7">{children}</p>;
}
export function UL({ children }: PropsWithChildren) {
  return <ul className="mt-4 list-disc pl-6">{children}</ul>;
}
export function LI({ children }: PropsWithChildren) {
  return <li className="my-1">{children}</li>;
}

/* ---------- Hero ---------- */
export function GuideHero({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <header className="rounded-2xl border border-brand-gold bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h1 className="m-0 text-2xl font-bold text-brand-green">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-700">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}

/* ---------- CTA & Share ---------- */
export function CTAButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-xl px-4 py-2 font-semibold transition hover:opacity-90 bg-brand-green text-white ${className}`}
    >
      {children}
    </Link>
  );
}

export function SocialShare({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    {
      label: "X",
      href: `https://x.com/intent/tweet?url=${u}&text=${t}`,
      aria: `Share “${title}” on X`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      aria: `Share “${title}” on LinkedIn`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      aria: `Share “${title}” on Facebook`,
    },
  ];
  return (
    <div className="flex items-center gap-3 text-sm">
      <Share2 size={16} className="text-brand-green" aria-hidden />
      <span className="text-gray-700">Share:</span>
      {links.map((l) => (
        <a
          key={l.label}
          className="text-brand-green underline"
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.aria}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

/* ---------- Default export so both import styles work ---------- */
const GuideParts = { Section, H2, P, UL, LI, GuideHero, CTAButton, SocialShare };
export default GuideParts;
