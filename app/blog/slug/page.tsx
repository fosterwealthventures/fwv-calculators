import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "content/blog", `${params.slug}.md`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return (
    <article className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-brand-green">{data.title}</h1>
      <p className="text-sm text-neutral-500">{data.date}</p>
      <div
        className="prose prose-neutral max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
