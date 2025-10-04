// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import AdInContent from "@/components/ads/AdInContent";
import AdInSidebar from "@/components/ads/AdInSidebar";
import AdGateFreeOnly from "@/components/ads/AdGateFreeOnly";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const md = getPost(slug);
  if (!md) return notFound();

  const fm = md.match(/^---([\s\S]*?)---/m)?.[1] ?? "";
  const title =
    fm.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? slug.replace(/-/g, " ");
  const date =
    fm.match(/date:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? new Date().toISOString();

  const body = md.replace(/^---[\s\S]*?---\s*/m, "");
  const html = marked.parse(body) as string;

  return (
    <div className="container-page page">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main article */}
        <div>
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

          <header className="mb-6">
            <h1 className="text-3xl font-bold text-brand-green">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(date).toLocaleDateString()}
            </p>
          </header>

          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <div className="my-10">
              <AdGateFreeOnly>
                <AdInContent
                  slot={process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT}
                />
              </AdGateFreeOnly>
            </div>
          </article>
        </div>

        {/* Sticky sidebar ad */}
        <aside className="sticky top-6 h-fit">
          <AdGateFreeOnly>
            <AdInSidebar width={300} height={600} />
          </AdGateFreeOnly>
        </aside>
      </div>
    </div>
  );
}
