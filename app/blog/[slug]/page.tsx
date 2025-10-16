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

      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        <div className="relative">
          {/* TOC - positioned on the left side */}
          <div className="hidden xl:block absolute left-0 top-0 w-64 -ml-72">
            <div className="sticky top-24">
              <TOC />
            </div>
          </div>

          {/* Main article - full width */}
          <div className="xl:ml-8">
            <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
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

            <header className="mb-8 lg:mb-12">
              <p className="text-sm text-plum-200/80">{new Date(date).toLocaleDateString()}</p>
              <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold tracking-tight text-plum-50">{title}</h1>
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
        </div>
      </div>
    </>
  );
}
