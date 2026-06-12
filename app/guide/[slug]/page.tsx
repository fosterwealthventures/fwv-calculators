import { findGuide, type GuideCategory } from "@/lib/guides";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: { slug: string } };

const badgeClass: Record<GuideCategory, string> = {
  Credit: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Real Estate": "border-aure-200 bg-aure-50 text-aure-800",
  Utility: "border-plum-200 bg-plum-50 text-plum-700",
};

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = findGuide(params.slug);
  return {
    title: guide?.title || "Guide",
    description: guide?.description || "Step-by-step FWV calculator guide.",
    alternates: guide ? { canonical: `/guide/${guide.slug}` } : undefined,
  };
}

export default function GuidePage({ params }: PageProps) {
  const guide = findGuide(params.slug);
  if (!guide) return notFound();

  return (
    <main className="fwv-container py-8 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href="/" className="link-regal">
          Home
        </Link>
        <span className="mx-2 text-plum-500">/</span>
        <Link href="/guides" className="link-regal">
          Guides
        </Link>
        <span className="mx-2 text-plum-500">/</span>
        <span className="font-medium text-plum-800">{guide.title}</span>
      </nav>

      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-plum-200/70 bg-white/90 shadow-sm">
        <header className="border-b border-plum-100 bg-gradient-to-br from-plum-50 via-white to-aure-50 p-6 md:p-9">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass[guide.category]}`}>
            {guide.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-purple-title md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-plum-900/78">
            {guide.description}
          </p>
        </header>

        <div className="article prose prose-regal max-w-none px-6 py-7 md:px-9 md:py-9">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="border-t border-plum-100 px-6 py-6 md:px-9">
          <div className="rounded-2xl border border-aure-200 bg-aure-50/70 p-5 md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-aure-800">
                Run your numbers
              </p>
              <p className="mt-1 text-sm leading-6 text-plum-900/80">
                Open the matching FWV calculator and apply this guide to your
                own inputs.
              </p>
            </div>
            <Link href={guide.calculatorHref} className="btn-accent-regal mt-4 md:mt-0">
              {guide.calculatorLabel}
            </Link>
          </div>

          {guide.disclaimer ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              {guide.disclaimer}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
