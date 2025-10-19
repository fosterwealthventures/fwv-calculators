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

  // Configure marked to preserve img tags and allow necessary attributes
  const html = marked.parse(body, {
    breaks: true,
    gfm: true,
  }) as string;

  return (
    <>
      {/* MathJax Configuration */}
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=es6"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="beforeInteractive"
      />
      <Script id="mathjax-config" strategy="beforeInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true,
              processEnvironments: true
            },
            options: {
              skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
            }
          };
        `}
      </Script>

      <div className="fwv-container min-h-screen">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          {/* TOC sidebar (desktop) */}
          <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-plum-200/40 p-4 shadow-sm">
              <TOC />
            </div>
          </aside>

          {/* Article */}
          <article className="max-w-[75ch] mx-auto px-4 lg:px-6">
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
                <div className="article" dangerouslySetInnerHTML={{ __html: html }} />
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
