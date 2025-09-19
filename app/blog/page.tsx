// app/blog/page.tsx
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

export default function BlogIndex() {
  const posts = getAllPosts();

  if (!posts.length) {
    return <p className="text-neutral-600">No posts yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-brand-green">Blog</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-neutral-200 pb-4">
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${p.slug}`} className="text-brand-green hover:underline">
                {p.title ?? p.slug}
              </Link>
            </h2>
            {p.date && <p className="text-sm text-neutral-500">{p.date}</p>}
            {p.excerpt && <p className="text-neutral-700 mt-1">{p.excerpt}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
