// app/blog/[slug]/page.tsx
import AdGateFreeOnly from "@/components/ads/AdGateFreeOnly";
import AdInContent from "@/components/ads/AdInContent";
import PostContainer from "@/components/PostContainer";
import TOC from "@/components/TOC";
import { getAllPosts, getPost } from "@/lib/blog";
import { marked } from "marked";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const md = getPost(slug);
  if (!md) return notFound();

  // --- front-matter parsing ---
  const fm = md.match(/^---([\s\S]*?)---/m)?.[1] ?? "";
  const title =
    fm.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? slug.replace(/-/g, " ");
  const date =
    fm.match(/date:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? new Date().toISOString();

  // strip front-matter block
  const body = md.replace(/^---[\s\S]*?---\s*/m, "");
  // also strip a leading markdown H1 to avoid duplicate titles
  const cleanBody = body.replace(/^\s*#\s+.+?\n+/, "");

  // basic markdown → HTML
  const html = marked.parse(cleanBody, { breaks: true, gfm: true }) as string;

  // light KaTeX hook (keep if you don’t use remark-math/rehype-katex pipeline)
  const processedHtml = html
    .replace(/\$\$([^$]+)\$\$/g, '<div data-katex-display>$1</div>')
    .replace(/(?<!\\)\$([^$]+)\$/g, '<span data-katex-inline>$1</span>');

  return (
    <>
      <Script id="katex-config" strategy="afterInteractive">
        {`
          document.addEventListener('DOMContentLoaded', function() {
            if (typeof katex !== 'undefined') {
              document.querySelectorAll('[data-katex-display]').forEach(function(el) {
                try { el.innerHTML = katex.renderToString(el.textContent, { displayMode: true, throwOnError: false }); } catch {}
              });
              document.querySelectorAll('[data-katex-inline]').forEach(function(el) {
                try { el.innerHTML = katex.renderToString(el.textContent, { displayMode: false, throwOnError: false }); } catch {}
              });
            }
          });
        `}
      </Script>

      {/* HERO: breadcrumb + date + PLUM title */}
      <section className="bg-gradient-to-b from-[#2b1a3d] to-[#3b2a55] py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <nav
            className="mb-3 text-sm text-white/80"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:underline">Blog</Link>
          </nav>

          {/* front-matter date visible */}
          <p className="text-sm mb-2 text-plum-200/90">
            {new Date(date).toLocaleDateString()}
          </p>

          {/* make the topic title PLUM (not white) */}
          <h1
            className="font-extrabold leading-tight drop-shadow-sm
                       text-plum-200 md:text-plum-100"
            style={{ fontSize: "clamp(34px,6vw,48px)" }}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* CONTENT GRID: TOC left, article right */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* TOC sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur p-4 max-h-[70vh] overflow-auto border border-plum-200/40 shadow-sm">
            <TOC />
          </div>
        </aside>

        {/* ARTICLE column */}
        <article
          className="
            mx-auto w-full max-w-[72ch]
            prose lg:prose-lg
            dark:prose-invert
            prose-headings:font-semibold
            prose-h2:text-2xl md:prose-h2:text-3xl
            prose-h3:text-xl md:prose-h3:text-2xl
            prose-headings:text-plum-900 dark:prose-headings:text-plum-100
            prose-a:text-plum-700 hover:prose-a:text-plum-900
            prose-strong:text-plum-900 dark:prose-strong:text-plum-100
          "
        >
          <PostContainer>
            <div className="article" dangerouslySetInnerHTML={{ __html: processedHtml }} />
            <div className="my-10">
              <AdGateFreeOnly>
                <AdInContent slot={process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT} />
              </AdGateFreeOnly>
            </div>
          </PostContainer>
        </article>
      </div>

      {/* TOC for mobile */}
      <div className="lg:hidden mx-auto max-w-7xl px-4 lg:px-6 -mt-4 mb-8">
        <details className="bg-white/90 dark:bg-white/10 backdrop-blur rounded-xl border border-plum-200/40 p-4 shadow-sm">
          <summary className="cursor-pointer font-semibold text-plum-900 dark:text-plum-100">
            📋 Table of Contents
          </summary>
          <div className="mt-4">
            <TOC />
          </div>
        </details>
      </div>
    </>
  );
}
