import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  topic?: string;
  dryRun?: boolean;
  useFixedContent?: boolean;
  options?: {
    template?: 'howto' | 'listicle' | 'comparison' | 'deep-dive';
    wordCountHint?: 'short' | 'standard' | 'long';
    tone?: string;
    schema?: boolean;
    faqSchema?: boolean;
    schemaHowTo?: boolean;
    internalLinks?: boolean;
    cta?: boolean;
    ctaVariant?: 'pricing' | 'upgrade' | 'calculators';
    imageSuggestions?: boolean;
    targetCalculators?: string[];
    mainCalculator?: string;
    intent?: string;
    keywords?: string[];
    meta_description?: string;
    meta_title?: string;
  };
};

const baseUrl = (process.env.SITE_URL || 'https://www.fosterwealthventures.store').replace(/\/+$/, '');

function truncate(s: string, max = 160) {
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + '…';
}

function computeReadingTime(text: string) {
  const words = (text || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractSection(markdown: string, headingRe: RegExp) {
  const lines = (markdown || '').split(/\r?\n/);
  let inSection = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (inSection) break; // next H2 ends section
      inSection = headingRe.test(line);
      continue;
    }
    if (inSection) out.push(line);
  }
  return out.join('\n').trim();
}

function extractFaqs(markdown: string) {
  const section = extractSection(markdown, /^##\s+faqs?/i);
  if (!section) return [] as Array<{ question: string; answer: string }>;
  const lines = section.split(/\r?\n/);
  const faqs: Array<{ question: string; answer: string }> = [];
  let currentQ: string | null = null;
  let currentA: string[] = [];
  for (const line of lines) {
    const h3 = /^###\s+(.+)$/i.exec(line);
    if (h3) {
      if (currentQ) faqs.push({ question: currentQ, answer: currentA.join('\n').trim() });
      currentQ = h3[1].trim();
      currentA = [];
    } else if (currentQ) {
      if (/^##\s+/.test(line)) break; // safety
      currentA.push(line);
    }
  }
  if (currentQ) faqs.push({ question: currentQ, answer: currentA.join('\n').trim() });
  return faqs.filter(f => f.question && f.answer);
}

function extractHowToSteps(markdown: string) {
  const section = extractSection(markdown, /^##\s+how\s+to\s+use/i);
  if (!section) return [] as string[];
  const steps: string[] = [];
  const lines = section.split(/\r?\n/);
  for (const ln of lines) {
    const m = /^\s*(?:[-*]|\d+[\.)])\s+(.+)$/.exec(ln);
    if (m) steps.push(m[1].trim());
  }
  return steps.slice(0, 8);
}

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

// Spell checking and LaTeX validation functions
function detectLatexIssues(content: string): { issues: string[], fixed: string } {
  const issues: string[] = [];
  let fixed = content;

  // Detect unescaped mathematical symbols that should be in LaTeX - be more conservative
  // Only detect actual mathematical symbols, not prices or common text patterns
  const mathSymbols = [
    { pattern: /(?<!\$)π(?!\$)/g, replacement: '$\\pi$', description: 'Unescaped pi symbol' },
    { pattern: /(?<!\$)±(?!\$)/g, replacement: '$\\pm$', description: 'Unescaped plus-minus' },
    { pattern: /(?<!\$)≥(?!\$)/g, replacement: '$\\geq$', description: 'Unescaped greater than or equal' },
    { pattern: /(?<!\$)≤(?!\$)/g, replacement: '$\\leq$', description: 'Unescaped less than or equal' },
    { pattern: /(?<!\$)√(?!\$)/g, replacement: '$\\sqrt{}$', description: 'Unescaped square root' },
    { pattern: /(?<!\$)∑(?!\$)/g, replacement: '$\\sum$', description: 'Unescaped summation' },
    { pattern: /(?<!\$)∞(?!\$)/g, replacement: '$\\infty$', description: 'Unescaped infinity' },
    { pattern: /(?<!\$)α(?!\$)/g, replacement: '$\\alpha$', description: 'Unescaped alpha' },
    { pattern: /(?<!\$)β(?!\$)/g, replacement: '$\\beta$', description: 'Unescaped beta' },
    { pattern: /(?<!\$)γ(?!\$)/g, replacement: '$\\gamma$', description: 'Unescaped gamma' },
    { pattern: /(?<!\$)δ(?!\$)/g, replacement: '$\\delta$', description: 'Unescaped delta' },
    { pattern: /(?<!\$)θ(?!\$)/g, replacement: '$\\theta$', description: 'Unescaped theta' },
    { pattern: /(?<!\$)λ(?!\$)/g, replacement: '$\\lambda$', description: 'Unescaped lambda' },
    { pattern: /(?<!\$)μ(?!\$)/g, replacement: '$\\mu$', description: 'Unescaped mu' },
    { pattern: /(?<!\$)σ(?!\$)/g, replacement: '$\\sigma$', description: 'Unescaped sigma' },
  ];

  mathSymbols.forEach(({ pattern, replacement, description }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push(`Found ${matches.length} instance(s) of ${description}`);
      fixed = fixed.replace(pattern, replacement as string);
    }
  });

  // Detect broken LaTeX expressions - be more conservative
  const brokenLatexPatterns = [
    { pattern: /\[ \\text\{([^}]+)\} \]/g, description: 'Incorrect text formatting [ \\text{...} ]', hasReplacement: true },
    { pattern: /\\text\{([^}]+)\}/g, description: 'Text command in math mode', hasReplacement: true },
    { pattern: /\$\$([^$\n]*\\[^$\n]*)\$\$/g, description: 'Display math without proper escaping', hasReplacement: false },
    { pattern: /\$([^$\n]*\\[^$\n]*)\$/g, description: 'Inline math without proper escaping', hasReplacement: false },
    { pattern: /\\\\/g, description: 'Double backslashes', hasReplacement: true },
  ];

  brokenLatexPatterns.forEach(({ pattern, description, hasReplacement }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      issues.push(`Found ${matches.length} potentially broken LaTeX expressions (${description})`);
      if (hasReplacement) {
        if (pattern.source.includes('\\\\')) {
          fixed = fixed.replace(pattern, '\\');
        } else if (pattern.source.includes('\\text\\{')) {
          fixed = fixed.replace(pattern, (match: string, p1: string) => `$\\text{${p1}}$`);
        } else if (pattern.source.includes('\\[ \\\\text\\{')) {
          fixed = fixed.replace(pattern, (match: string, p1: string) => `$$${p1}$$`);
        }
      }
    }
  });

  // Check for mismatched LaTeX delimiters
  const displayMathCount = (content.match(/\$\$/g) || []).length;
  const inlineMathCount = (content.match(/(?<!\$)\$(?!\$)/g) || []).length;

  if (displayMathCount % 2 !== 0) {
    issues.push('Mismatched display math delimiters ($$) - odd number detected');
  }

  if (inlineMathCount % 2 !== 0) {
    issues.push('Mismatched inline math delimiters ($) - odd number detected');
  }

  return { issues, fixed };
}

function basicSpellCheck(content: string): { misspelled: string[], suggestions: Record<string, string[]> } {
  // Common financial and business misspellings
  const commonMisspellings: Record<string, string[]> = {
    'calculater': ['calculator'],
    'recieve': ['receive'],
    'seperate': ['separate'],
    'definately': ['definitely'],
    'neccessary': ['necessary'],
    'accomodate': ['accommodate'],
    'begining': ['beginning'],
    'occured': ['occurred'],
    'occuring': ['occurring'],
    'untill': ['until'],
    'thier': ['their'],
    'teh': ['the'],
    'adress': ['address'],
    'bussiness': ['business'],
    'sucess': ['success'],
    'sucessful': ['successful'],
    'proffesional': ['professional'],
    'oppurtunity': ['opportunity'],
    'intrest': ['interest'],
    'investmant': ['investment'],
    'finacial': ['financial'],
    'reveneu': ['revenue'],
    'expence': ['expense'],
    'profitt': ['profit'],
    'assest': ['asset'],
    'liablity': ['liability'],
    'amortization': ['amortization'],
    'depreciation': ['depreciation'],
    'principal': ['principal'],
    'principle': ['principle'],
    'capitol': ['capital'],
    'affect': ['affect', 'effect'],
    'effect': ['effect', 'affect'],
  };

  // Remove HTML tags and special characters, then extract words
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/[^\w\s]/g, ' ');
  const words = cleanContent.toLowerCase().match(/\b[a-z]+\b/g) || [];

  const misspelled = words.filter(word => {
    // Skip very short words and common financial abbreviations
    if (word.length < 3 || ['roi', 'irr', 'npv', 'pv', 'fv', 'pmi', 'apy', 'apr'].includes(word)) {
      return false;
    }
    return commonMisspellings[word];
  });

  const suggestions: Record<string, string[]> = {};
  misspelled.forEach(word => {
    suggestions[word] = commonMisspellings[word] || [];
  });

  return { misspelled: [...new Set(misspelled)], suggestions };
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

    const { topic = '', dryRun = true, useFixedContent = false, options = {} } = body;
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
    const utm = (target: string) => `${target}${target.includes('?') ? '&' : '?'}utm_source=blog&utm_medium=link&utm_campaign=${slug}`;
    const internalLinksBlock =
      options.internalLinks && Array.isArray(options.targetCalculators) && options.targetCalculators.length
        ? `\n\n### Try our calculators\n${options.targetCalculators.slice(0, 5).map(n => `- [${n}](${utm('/calculators')})`).join('\n')}\n`
        : '';

    // contextual guide link by main calculator
    const guideByCalc: Record<string, string> = {
      'ROI Calculator': '/guide/roi',
      'Break-even Calculator': '/guide/break-even',
      'Mortgage Calculator': '/guide/mortgage',
      'Simple vs Compound Interest Calculator': '/guide/simple-vs-compound-interest',
      'Savings Growth Calculator': '/guide/savings-growth',
      'Debt Payoff Calculator': '/guide/debt-payoff',
      'Freelance Rate Calculator': '/guide/freelancer-rate',
      'Restaurant Tips Calculator': '/guide/restaurant-tips-tabs-split',
    };
    const guideLinksBlock = (() => {
      const link = guideByCalc[options?.mainCalculator || ''];
      if (!link) return '';
      return `\n\n### Learn the method\nSee our step-by-step guide: [${options?.mainCalculator}](${utm(link)})\n`;
    })();

    const ctaBlock = options.cta
      ? `\n\n---\n**Next step:** Explore our calculators for hands-on planning — try [ROI Calculator](${utm('/calculators')}), [Break-even Calculator](${utm('/calculators')}), or [Mortgage Calculator](${utm('/calculators')}).\n`
      : '';

    // Use meta_description if available, otherwise fall back to excerpt
    const descriptionForSchema = truncate(options?.meta_description || excerpt, 160);

    const schemaBlock = options.schema ? `\n\n<script type="application/ld+json">
${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: descriptionForSchema,
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

    // Main calculator prominence
    const mainCalculator = options?.mainCalculator || '';
    const mainCalculatorPrompt = mainCalculator ? `

CRITICAL: MAIN CALCULATOR INTEGRATION - THIS IS MANDATORY:
- "${mainCalculator}" MUST be the primary calculator featured throughout this entire article
- EVERY major section should reference and demonstrate ${mainCalculator}
- Include AT LEAST 3-4 practical examples showing step-by-step usage of ${mainCalculator}
- The article should read like a tutorial FOR ${mainCalculator} applied to the topic "${topic}"
- Mention ${mainCalculator} in the introduction, every subsection, and conclusion
- Show the EXACT URL format: [${mainCalculator}](/calculators) every time
- Structure calculations and examples AROUND ${mainCalculator}'s functionality
- Make ${mainCalculator} the HERO calculator - users should finish reading knowing exactly how to use it` : '';

    // --- Generate content using OpenAI API
    let markdown: string;
    let fullMarkdown: string;

    const systemPrompt = `You are a senior financial content writer creating comprehensive, practical guides for a financial calculators website.

Write in a ${options.tone || 'friendly and helpful'} tone for ${options.wordCountHint === 'short' ? 'concise' : options.wordCountHint === 'long' ? 'comprehensive' : 'balanced'} content.

CRITICAL INSTRUCTION: This article MUST prominently feature and demonstrate the selected MAIN CALCULATOR throughout the entire content. The main calculator should be the central focus of the article, with extensive examples and step-by-step guidance showing exactly how to use it for the specific topic.

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
5. Calculator recommendations pointing to /calculators on fosterwealthventures.store${mainCalculatorPrompt}

PRIMARY OBJECTIVE: This article must serve as a comprehensive tutorial for "${mainCalculator}". Every section should demonstrate practical applications of this calculator for the topic "${topic}". Readers should finish the article knowing exactly how to use ${mainCalculator} for their specific needs.

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

      // Extract SEO fields from options
      const intent = options?.intent || '';
      const keywords = options?.keywords || [];
      const metaDescription = options?.meta_description || excerpt;
      const mainCalculator = options?.mainCalculator || '';

      // Apply LaTeX fixes if requested
      let finalContent = generatedContent;
      if (useFixedContent) {
        const latexCheck = detectLatexIssues(generatedContent);
        if (latexCheck.fixed) {
          finalContent = latexCheck.fixed;
        }
      }

      // Compute derived SEO fields
      const metaTitle = (options?.meta_title || `${topic.trim()} | ${mainCalculator || 'Foster Wealth Calculators'}`).slice(0, 60);
      const canonical = `${baseUrl}/blog/${slug}`;
      const readingTime = computeReadingTime(finalContent);

      // Generate preview markdown (without schema blocks or title H1)
      markdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
main_calculator: "${mainCalculator}"
intent: "${intent}"
keywords: [${keywords.map(k => `"${k}"`).join(', ')}]
meta_description: "${metaDescription}"
meta_title: "${metaTitle}"
canonical: "${canonical}"
og_image: "/blog/${slug}/opengraph-image"
reading_time: ${readingTime}
noindex: false
---

${finalContent}

${internalLinksBlock}${guideLinksBlock}${ctaBlock}`;

      // Generate full markdown (with schema blocks for saving)
      fullMarkdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
main_calculator: "${mainCalculator}"
intent: "${intent}"
keywords: [${keywords.map(k => `"${k}"`).join(', ')}]
meta_description: "${metaDescription}"
meta_title: "${metaTitle}"
canonical: "${canonical}"
og_image: "/blog/${slug}/opengraph-image"
reading_time: ${readingTime}
noindex: false
---

${finalContent}

${internalLinksBlock}${guideLinksBlock}${ctaBlock}${schemaBlock}${faqBlock}`;

      // Run validation checks
      const spellCheck = basicSpellCheck(generatedContent);
      const latexCheck = detectLatexIssues(generatedContent);

      const meta = {
        categories,
        tags,
        images,
        related,
      };

      // Prepare validation warnings
      const validationWarnings = {
        spelling: {
          misspelled: spellCheck.misspelled,
          suggestions: spellCheck.suggestions,
          count: spellCheck.misspelled.length
        },
        latex: {
          issues: latexCheck.issues,
          count: latexCheck.issues.length,
          fixedContent: latexCheck.fixed
        },
        hasIssues: spellCheck.misspelled.length > 0 || latexCheck.issues.length > 0
      };

      if (dryRun) {
        return NextResponse.json({
          ok: true,
          saved: false,
          slug,
          title,
          excerpt,
          markdown,
          meta,
          validation: validationWarnings
        });
      }

      // Save to content/blog/{slug}.md (use full version with schema blocks)
      const outDir = path.join(process.cwd(), 'content', 'blog');
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `${slug}.md`), fullMarkdown, 'utf8');

      return NextResponse.json({ ok: true, saved: true, slug, title, excerpt, markdown, meta });

    } catch (error) {
      console.error('OpenAI API error:', error);

      // Extract SEO fields from options for fallback content
      const fallbackIntent = options?.intent || '';
      const fallbackKeywords = options?.keywords || [];
      const fallbackMetaDescription = options?.meta_description || excerpt;
      const fallbackMainCalculator = options?.mainCalculator || '';

      // Apply LaTeX fixes if requested (for fallback content too)
      let fallbackContent = `# ${title}

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

      if (useFixedContent) {
        const latexCheck = detectLatexIssues(fallbackContent);
        if (latexCheck.fixed) {
          fallbackContent = latexCheck.fixed;
        }
      }

      const fallbackMetaTitle = (options?.meta_title || `${title} | ${fallbackMainCalculator || 'Foster Wealth Calculators'}`).slice(0, 60);
      const canonical = `${baseUrl}/blog/${slug}`;
      const readingTime = computeReadingTime(fallbackContent);
      // Fallback content if OpenAI fails
      markdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
main_calculator: "${fallbackMainCalculator}"
intent: "${fallbackIntent}"
keywords: [${fallbackKeywords.map(k => `"${k}"`).join(', ')}]
meta_description: "${truncate(fallbackMetaDescription, 160)}"
meta_title: "${fallbackMetaTitle}"
canonical: "${canonical}"
og_image: "/blog/${slug}/opengraph-image"
reading_time: ${readingTime}
noindex: false
---

${fallbackContent}`;

      fullMarkdown = `---
title: "${title}"
date: "${new Date().toISOString()}"
excerpt: "${excerpt}"
image: "/fwv-logo-gold.svg"
category: "${categories[0]}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
main_calculator: "${fallbackMainCalculator}"
intent: "${fallbackIntent}"
keywords: [${fallbackKeywords.map(k => `"${k}"`).join(', ')}]
meta_description: "${truncate(fallbackMetaDescription, 160)}"
meta_title: "${fallbackMetaTitle}"
canonical: "${canonical}"
og_image: "/blog/${slug}/opengraph-image"
reading_time: ${readingTime}
noindex: false
---

${fallbackContent}${schemaBlock}${faqBlock}`;
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
