import React from "react";

export function NavText({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm">{children}</p>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{children}</h1>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">{children}</h3>;
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6">{children}</ul>;
}

export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mt-8 space-y-8">{children}</section>;
}

export function CTAWrap({ children }: { children: React.ReactNode }) {
  return <div className="mt-6">{children}</div>;
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-base text-gray-600">{children}</p>;
}

type QuoteProps = { children: React.ReactNode; variant?: "free" | "paid" };
export function Quote({ children, variant = "free" }: QuoteProps) {
  const cls =
    variant === "paid"
      ? "text-sm leading-relaxed"
      : "mt-3 rounded-xl bg-brand-gold/10 p-4 text-sm leading-relaxed text-brand-green";
  return <blockquote className={cls}>{children}</blockquote>;
}

export function QuoteRef({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}