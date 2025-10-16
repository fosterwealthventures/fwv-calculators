import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  topic?: string;
  dryRun?: boolean;
  options?: {
    template?: 'howto' | 'listicle' | 'comparison' | 'deep-dive';
    wordCountHint?: 'short' | 'standard' | 'long';
    tone?: string;
    schema?: boolean;
    faqSchema?: boolean;
    internalLinks?: boolean;
    cta?: boolean;
    imageSuggestions?: boolean;
    targetCalculators?: string[];
  };
};

function betterSlugify(s: string) {
  // lowercase, strip non-word, collapse spaces to hyphens, drop stopwords, trim to ~60 chars
  const stop = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'with', 'how', 'what', 'why', 'vs', 'by']);
  const words = s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w && !stop.has(w));
  let slug = words.join('-').replace(/-+/g, '-');
  if (slug.length > 60) slug = slug.slice(0, 60).replace(/-+$/, '');
  return slug || 'post';
}

function readExistingPostsMeta() {
  // read titles/tags from front matter (very simple parser)
  const dir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const meta: Array<{ slug: string; title: string; tags: string[] }> = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const raw = fs.readFileSync(p, 'utf8');
    const fm = /^---\n([\s\S]*?)\n---/.exec(raw)?.[1] || '';
    const title = /title:\s*"?([^"\n]+)"?/.exec(fm)?.[1] || f.replace(/\.md$/, '');
    const tags = /tags:\s*\[([^\]]*)\]/.exec(fm)?.[1]?.split(',').map(s => s.replace(/["']/g, '').trim()).filter(Boolean) || [];
    meta.push({ slug: f.replace(/\.md$/, ''), title, tags });
  }
  return meta;
}

function suggestCategoriesAndTags(topic: string): { categories: string[]; tags: string[] } {
  // Lightweight heuristic; swap for LLM JSON later if you want
  const t = topic.toLowerCase();
  const categories: string[] = [];
  if (/(roi|return)/.test(t)) categories.push('Investing');
  if (/(mortgage|home|real estate)/.test(t)) categories.push('Real Estate');
  if (/(budget|saving|expense)/.test(t)) categories.push('Personal Finance');
  if (!categories.length) categories.push('Finance');

  const words = Array.from(new Set(
    t.replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 2).slice(0, 8)
  ));
  const tags = words;

  return { categories, tags };
}

function imageIdeas(topic: string) {
  const base = topic.replace(/"/g, '');
  return [
    { title: `${base} — simple chart`, alt: 'Line chart illustrating ROI trend' },
    { title: `${base} — formula card`, alt: 'ROI formula card with inputs and outputs' },
    { title: `${base} — comparison table`, alt: 'Table comparing options by ROI and risk' },
  ];
}

export async function POST(req: Request) {
  try {
    console.log('=== NEW REQUEST TO BLOG GENERATOR ===');
    console.log('OPENAI_API_KEY available:', !!process.env.OPENAI_API_KEY);
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    let body: Body;
    try {
      const rawBody = await req.text();
      console.log('Raw request body length:', rawBody.length);
      console.log('Raw request body preview:', rawBody.substring(0, 200));
      body = JSON.parse(rawBody) as Body;
      console.log('Parsed body successfully:', { topic: body.topic?.substring(0, 50), dryRun: body.dryRun, optionsKeys: Object.keys(body.options || {}) });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ ok: false, error: `Invalid JSON in request body: ${parseError}` }, { status: 400 });
    }

    const { topic = '', dryRun = true, options = {} } = body;
    if (!topic.trim()) return NextResponse.json({ ok: false, error: 'Topic is required' }, { status: 400 });

    // knobs
    const lengthText =
      options.wordCountHint === 'short' ? '~700 words, concise, scannable'
        : options.wordCountHint === 'long' ? '~1,800 words, comprehensive but no filler'
          : '~1,200 words, balanced';
    const templateOutline = {
      'howto': `# Title\nIntro\n## Steps\n## Common mistakes\n## Example\n## FAQs`,
      'listicle': `# Title\nIntro\n## 7 Key Points\n## Examples\n## FAQs`,
      'comparison': `# Title\nIntro\n## Option A vs B\n## Pros/Cons Table\n## Use-cases\n## FAQs`,
      'deep-dive': `# Title\nIntro\n## Background\n## Method\n## Examples\n## FAQs`,
    }[options.template || 'howto'];

    // title/excerpt
    const title = `${topic.trim()} — Complete Guide`;
    const excerpt = `A practical, step-by-step walkthrough of “${topic.trim()}”.`;

    // better slug
    const base = betterSlugify(topic);
    const slug = `${base}-${crypto.randomBytes(3).toString('hex')}`;

    // related posts by local tag overlap (simple)
    const existing = readExistingPostsMeta();
    const { categories, tags } = suggestCategoriesAndTags(topic);
    const related = existing
      .map(p => ({ ...p, score: p.tags.filter(t => tags.includes(t.toLowerCase())).length }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(p => ({ title: p.title, slug: p.slug }));

    // internal links
    const internalLinksBlock =
      options.internalLinks && Array.isArray(options.targetCalculators) && options.targetCalculators.length
        ? `\n\n### Try our calculators\n${options.targetCalculators.slice(0, 5).map(n => `- [${n}](/calculators)`).join('\n')}\n`
        : '';

    const ctaBlock = options.cta
      ? `\n\n---\n**Next step:** Explore our calculators for hands-on planning — try [ROI Calculator](/calculators), [Break-even Calculator](/calculators), or [Mortgage Calculator](/calculators).\n`
      : '';

    const schemaBlock = options.schema ? `\n\n<script type="application/ld+json">
${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      author: { '@type': 'Organization', name: 'Foster Wealth Ventures' },
      datePublished: new Date().toISOString(),
      image: '/fwv-logo-gold.svg',
    }, null, 2)}
</script>\n` : '';

    const faqBlock = options.faqSchema ? `\n\n<script type="application/ld+json">
{ "@context":"https://schema.org", "@type":"FAQPage", "mainEntity": [] }
</script>\n` : '';

    const toneNote = '';
    const images = options.imageSuggestions ? imageIdeas(topic) : [];

    // --- Generate content using OpenAI API
    let markdown: string;
    let fullMarkdown: string;

    const systemPrompt = `You are a senior financial content writer creating comprehensive, practical guides for a financial calculators website.

Write in a ${options.tone || 'friendly and helpful'} tone for ${options.wordCountHint === 'short' ? 'concise' : options.wordCountHint === 'long' ? 'comprehensive' : 'balanced'} content.

Create a complete, informative blog post with:
- Clear explanations of financial concepts
- Step-by-step calculations with real numbers
- Common mistakes to avoid
- Practical examples with actual data
- Specific, actionable advice

Structure: ${templateOutline}
Focus on calculator usage and practical application.`;

    const userPrompt = `Topic: ${topic}
Length: ${lengthText}
Template: ${options.template || 'howto'}

IMPORTANT SITE INSTRUCTIONS:
- This site is fosterwealthventures.store
- ALWAYS recommend calculators from /calculators (this site's calculators)
- NEVER recommend calculator.net or other external calculator sites
- ONLY recommend these calculators that actually exist:
  * Break-even Calculator
  * ROI Calculator
  * Mortgage Calculator
  * Savings Growth Calculator
  * Debt Payoff Calculator
  * Employee Cost Calculator
  * Expense Split Calculator
  * Simple vs Compound Interest Calculator
  * Restaurant Tips Calculator
  * Freelance Rate Calculator
- NEVER recommend: Loan Calculator, Personal Loan Calculator, or any calculator not listed above
- Use this format: "Use our [Calculator Name](/calculators) to..."

Please write a comprehensive financial guide with these requirements:

MATHEMATICAL EXPRESSIONS:
- Use proper LaTeX math formatting for all calculations
- Examples: $CM = 30 - 15 = 15$ instead of [ \text{CM} = 30 - 15 = 15 ]
- Use $...$ for inline math and $$...$$ for display math
- For fractions use $\frac{numerator}{denominator}$
- For subscripts use $A_{sub}$
- For superscripts use $A^{sup}$
- Show step-by-step calculations with clear formulas
- Examples of correct format:
  * Total: $Total = 600 + 300 + 200 + 200 = 1300$
  * Fraction: $\frac{1300}{4} = 325$
  * Subscript: $Price_{unit} = 30$

CONTENT REQUIREMENTS:
1. Real calculations with specific numbers using proper LaTeX
2. Practical examples from business/finance
3. Common pitfalls and how to avoid them
4. Actionable next steps for readers
5. Calculator recommendations pointing to /calculators on fosterwealthventures.store

Make it immediately useful for someone searching for "${topic}". Include specific numerical examples with proper mathematical notation.`;

    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY environment variable is not set');
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      console.log('Making OpenAI API call for topic:', topic.substring(0, 50) + '...');

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: options.wordCountHint === 'short' ? 800 : options.wordCountHint === 'long' ? 2000 : 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const generatedContent = data.choices?.[0]?.message?.content || "Content generation failed.";

      console.log('OpenAI API call successful, content length:', generatedContent.length);

      // Generate preview markdown (without schema blocks or title H1)
      markdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

${generatedContent}

${internalLinksBlock}${ctaBlock}`;

      // Generate full markdown (with schema blocks for saving)
      fullMarkdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

${generatedContent}

${internalLinksBlock}${ctaBlock}${schemaBlock}${faqBlock}`;

      const meta = {
        categories,
        tags,
        images,
        related,
      };

      if (dryRun) {
        return NextResponse.json({ ok: true, saved: false, slug, title, excerpt, markdown, meta });
      }

      // Save to content/blog/{slug}.md (use full version with schema blocks)
      const outDir = path.join(process.cwd(), 'content', 'blog');
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `${slug}.md`), fullMarkdown, 'utf8');

      return NextResponse.json({ ok: true, saved: true, slug, title, excerpt, markdown, meta });

    } catch (error) {
      console.error('OpenAI API error:', error);

      // Fallback content if OpenAI fails
      markdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

# ${title}

I'm sorry, but I encountered an issue generating the full content. Here's a basic outline to help you understand ${topic.trim()}:

## Overview
${topic.trim()} is an important financial concept that helps with investment analysis and business decision-making.

## Key Components
- **Input variables**: The data points needed for calculation
- **Calculation method**: How to compute the results
- **Interpretation**: Understanding what the numbers mean

## Basic Example
Let's say you invest $10,000 in a project that returns $12,000 after one year.

The calculation would involve assessing the return relative to the initial investment and time period.

## Common Applications
- Investment analysis
- Business project evaluation
- Financial planning decisions

## Next Steps
Use our calculators at [/calculators](/calculators) to run specific calculations for your situation. Start with our [ROI Calculator](/calculators), [Break-even Calculator](/calculators), or [Mortgage Calculator](/calculators).

> **Note**: This is fallback content. Please check your OpenAI API configuration for complete content generation.

${internalLinksBlock}${ctaBlock}`;

      fullMarkdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

# ${title}

I'm sorry, but I encountered an issue generating the full content. Here's a basic outline to help you understand ${topic.trim()}:

## Overview
${topic.trim()} is an important financial concept that helps with investment analysis and business decision-making.

## Key Components
- **Input variables**: The data points needed for calculation
- **Calculation method**: How to compute the results
- **Interpretation**: Understanding what the numbers mean

## Basic Example
Let's say you invest $10,000 in a project that returns $12,000 after one year.

The calculation would involve assessing the return relative to the initial investment and time period.

## Common Applications
- Investment analysis
- Business project evaluation
- Financial planning decisions

## Next Steps
Use our calculators at [/calculators](/calculators) to run specific calculations for your situation. Start with our [ROI Calculator](/calculators) or [Break-even Calculator](/calculators).

> **Note**: This is fallback content. Please check your OpenAI API configuration for complete content generation.

${internalLinksBlock}${ctaBlock}${schemaBlock}${faqBlock}`;
    }

    // Handle dry run vs save
    const meta = {
      categories,
      tags,
      images,
      related,
    };

    if (dryRun) {
      return NextResponse.json({ ok: true, saved: false, slug, title, excerpt, markdown, meta });
    }

    // Save to content/blog/{slug}.md (use full version with schema blocks)
    const outDir = path.join(process.cwd(), 'content', 'blog');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${slug}.md`), fullMarkdown, 'utf8');

    return NextResponse.json({ ok: true, saved: true, slug, title, excerpt, markdown, meta });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
