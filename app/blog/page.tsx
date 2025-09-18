import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function BlogPage() {
  const postsDir = path.join(process.cwd(), "content/blog");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const src = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(src);
      return {
        slug: file.replace(".md", ""),
        title: data.title,
        date: data.date,
        description: data.description,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-brand-green">Blog</h1>
      {posts.map((p) => (
        <div key={p.slug} className="border-b border-neutral-200 pb-4">
          <h2 className="text-xl font-semibold">
            <Link href={`/blog/${p.slug}`} className="text-brand-green hover:underline">
              {p.title}
            </Link>
          </h2>
          <p className="text-sm text-neutral-500">{p.date}</p>
          <p className="text-neutral-700">{p.description}</p>
        </div>
      ))}
    </div>
  );
}
