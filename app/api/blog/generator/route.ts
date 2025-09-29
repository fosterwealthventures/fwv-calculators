// app/api/blog/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;          // server-only
const BLOG_AUTOMATE_SECRET = process.env.BLOG_AUTOMATE_SECRET; // server-only

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
function savePost(slug: string, content: string) {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), content, "utf8");
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  if (req.headers.get("x-blog-secret") !== BLOG_AUTOMATE_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

  const prompt = `Write a concise, practical blog post in Markdown with this frontmatter:
---
title: "${topic}"
date: "${new Date().toISOString()}"
excerpt: "A short teaser about the topic."
---
Focus on actionable finance insights and how to use calculators effectively. Use H2/H3 headings, short paragraphs, and a conclusion.`;

  // Call OpenAI (no client lib needed)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });

  const data = await res.json();
  const md = data.choices?.[0]?.message?.content ?? "";
  const slug = slugify(topic);

  savePost(slug, md);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ ok: true, slug });
}
