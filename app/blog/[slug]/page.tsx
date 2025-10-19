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

  const fm = md.match(/^---([\s\S]*?)---/m)?.[1] ?? "";
  const title =
    fm.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? slug.replace(/-/g, " ");
  const date =
    fm.match(/date:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? new Date().toISOString();

  const body = md.replace(/^---[\s\S]*?---\s*/m, "");

  // Remove leading H1 from markdown content to prevent duplicate titles
  const cleanBody = body.replace(/^#\s+.+$/m, "");

  // Configure marked to preserve img tags and allow necessary attributes
  const html = marked.parse(cleanBody, {
    breaks: true,
    gfm: true,
  }) as string;

  // Post-process math expressions for KaTeX rendering
  let processedHtml = html
    // Convert display math $$...$$ to div with data-katex attribute
    .replace(/\$\$([^$]+)\$\$/g, '<div data-katex-display>$1</div>')
    // Convert inline math $...$ to span with data-katex attribute (but not inside display math)
    .replace(/(?<!\\)\$([^$]+)\$/g, '<span data-katex-inline>$1</span>');

  return (
    <>
      <Script id="katex-config" strategy="afterInteractive">
        {`
          // Simple KaTeX math rendering for blog posts
          document.addEventListener('DOMContentLoaded', function() {
            // Check if KaTeX is available
            if (typeof katex !== 'undefined') {
              // Render display math
              document.querySelectorAll('[data-katex-display]').forEach(function(el) {
                try {
                  el.innerHTML = katex.renderToString(el.textContent, {
                    displayMode: true,
                    throwOnError: false
                  });
                } catch (e) {
                  console.warn('KaTeX rendering error:', e);
                }
              });

              // Render inline math
              document.querySelectorAll('[data-katex-inline]').forEach(function(el) {
                try {
                  el.innerHTML = katex.renderToString(el.textContent, {
                    displayMode: false,
                    throwOnError: false
                  });
                } catch (e) {
                  console.warn('KaTeX rendering error:', e);
                }
              });
            }
          });
        `}
      </Script>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* TOC sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur p-4 max-h-[70vh] overflow-auto">
              <TOC />
            </div>
          </aside>

          {/* Article */}
          <article className="mx-auto w-full max-w-[72ch] prose lg:prose-lg prose-invert dark:prose-invert">
            <div className="prose lg:prose-lg leading-[1.7]">
              <nav className="mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <span className="mx-2">›</span>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
                <span className="mx-2">›</span>
                <span className="text-gray-500">{title}</span>
              </nav>

              <header className="mb-6">
                <p className="text-sm text-plum-200/80 mb-3">{new Date(date).toLocaleDateString()}</p>
                <h1 className="font-extrabold leading-tight text-plum-50 drop-shadow-sm" style={{ fontSize: 'clamp(34px, 6vw, 48px)' }}>{title}</h1>
              </header>

              <PostContainer>
                <div className="article" dangerouslySetInnerHTML={{ __html: processedHtml }} />
                <div className="my-10">
                  <AdGateFreeOnly>
                    <AdInContent
                      slot={process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT}
                    />
                  </AdGateFreeOnly>
                </div>
              </PostContainer>
            </div>
          </article>
        </div>

        {/* TOC mobile (collapsible) */}
        <div className="lg:hidden mt-6 -mb-2">
          <details className="bg-white/90 backdrop-blur-sm rounded-xl border border-plum-200/40 p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-plum-900 hover:text-plum-700 transition-colors">
              📋 Table of Contents
            </summary>
            <div className="mt-4">
              <TOC />
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
