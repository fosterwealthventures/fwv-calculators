// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { remark } from 'remark';
import html from 'remark-html';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <article className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-brand-green">{post.title ?? params.slug}</h1>
      {post.date && <p className="text-sm text-neutral-500">{post.date}</p>}
      <div className="prose prose-neutral max-w-none mt-6" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
