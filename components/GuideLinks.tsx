"use client";
import Link from "next/link";

type Tier = "free" | "plus" | "pro" | "premium" | string;

export function OpenCalculatorButton({
  slug,
  tier,
  className = "",
}: {
  slug: string;         // calculator slug for /calculators?calc=...
  tier?: Tier;          // used to decide if CTA goes to pricing
  className?: string;
}) {
  const isPaid = tier && tier !== "free";
  const href = isPaid
    ? `/pricing?required=${tier}&calc=${slug}`
    : `/calculators?calc=${slug}`;
  const label = isPaid ? "Unlock to open calculator" : "Open the calculator";

  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-xl px-5 py-3 text-white bg-brand-green hover:bg-brand-green/90 shadow-soft ${className}`}
      data-testid="open-calculator"
    >
      {label}
    </Link>
  );
}

// New professional Related section components
export function RelatedSection({ title = "Related", children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="mt-10">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">{title}</h3>
      <div className="space-y-1">{children}</div>
    </aside>
  );
}

interface RelatedLinkProps extends React.ComponentProps<"a"> {
  tag?: string; // optional small tag/label
}

export function RelatedLink({ children, tag, ...props }: RelatedLinkProps) {
  return (
    <a
      {...props}
      className="group flex items-start justify-between rounded-lg border border-neutral-200/60 bg-white px-3 py-2 shadow-sm transition hover:bg-neutral-50"
    >
      <span className="text-sm text-neutral-800 group-hover:text-neutral-900">{children}</span>
      <span className="ml-3 shrink-0 inline-flex items-center gap-2">
        {tag ? <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">{tag}</span> : null}
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 opacity-60 group-hover:opacity-100">
          <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

// Keep the old RelatedLinks for backward compatibility (deprecated)
export function RelatedLinks({
  items,
  className = "",
}: {
  items: { slug: string; title: string; tier?: Tier }[];
  className?: string;
}) {
  return (
    <ul className={`list-none ${className}`}>
      {items.map((it) => (
        <li key={it.slug}>
          <Link
            href={`/guide/${it.slug}`}
            className="underline decoration-brand-gold/40 hover:no-underline"
          >
            {it.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
