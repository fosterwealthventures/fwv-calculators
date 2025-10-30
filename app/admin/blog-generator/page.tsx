'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { suggestFromTopic } from '../../../lib/blog/suggestCalculator';

// Import KaTeX CSS for math rendering
// KaTeX styling for better integration with our brand
const katexStyle = `
.katex { font-size: 1.1em !important; }
.katex-display .katex { font-size: 1.2em !important; }
.katex .katex-html { color: rgb(17 24 39) !important; }
.katex .mord { color: rgb(17 24 39) !important; }
`;

type GenResponse = {
  ok: boolean;
  saved: boolean;
  slug?: string;
  title?: string;
  excerpt?: string;
  markdown?: string;
  error?: string;
  meta?: {
    categories?: string[];
    tags?: string[];
    images?: { title: string; alt: string }[];
    related?: { title: string; slug: string }[];
  };
  validation?: {
    spelling?: {
      misspelled?: string[];
      suggestions?: Record<string, string[]>;
      count?: number;
    };
    latex?: {
      issues?: string[];
      count?: number;
      fixedContent?: string;
    };
    hasIssues?: boolean;
  };
};

type GenOptions = {
  template?: 'howto' | 'listicle' | 'comparison' | 'deep-dive';
  wordCountHint?: 'short' | 'standard' | 'long';
  tone?: string;
  schema?: boolean;
  faqSchema?: boolean;
  internalLinks?: boolean;
  cta?: boolean;
  imageSuggestions?: boolean;
  targetCalculators?: string[];
  mainCalculator?: string;
  intent?: string;
  keywords?: string[];
  meta_description?: string;
};


const TEMPLATE_PRESETS: Array<{ label: string; value: GenOptions['template'] }> = [
  { label: 'How-To', value: 'howto' },
  { label: 'Listicle', value: 'listicle' },
  { label: 'Comparison', value: 'comparison' },
  { label: 'Deep Dive', value: 'deep-dive' },
];

export default function BlogGeneratorDevUI() {
  // ---- single generation controls
  const [topic, setTopic] = React.useState('');
  const [tone, setTone] = React.useState('Friendly & helpful');
  const [intent, setIntent] = React.useState('');
  const [keywords, setKeywords] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [mainCalculator, setMainCalculator] = React.useState('');
  const [ctaVariant, setCtaVariant] = React.useState<'pricing' | 'upgrade' | 'calculators'>('calculators');
  const [schemaHowTo, setSchemaHowTo] = React.useState(false);
  const [options, setOptions] = React.useState<GenOptions>({
    template: 'howto',
    wordCountHint: 'standard',
    tone: 'Friendly & helpful',
    schema: true,
    faqSchema: false,
    internalLinks: true,
    cta: true,
    imageSuggestions: true,
    targetCalculators: ['Break-even Calculator', 'ROI Calculator', 'Mortgage Calculator', 'Savings Growth Calculator'],
    mainCalculator: '',
    intent: '',
    keywords: [],
    meta_description: '',
  });

  const [loading, setLoading] = React.useState<null | 'preview' | 'publish'>(null);
  const [resp, setResp] = React.useState<GenResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [previewTab, setPreviewTab] = React.useState<'rendered' | 'raw'>('rendered');
  const [useFixedContent, setUseFixedContent] = React.useState(false);
  const [disableLatexProcessing, setDisableLatexProcessing] = React.useState(false);

  // ---- bulk controls
  const [bulkText, setBulkText] = React.useState('');
  const [bulkRunning, setBulkRunning] = React.useState(false);
  const [bulkProgress, setBulkProgress] = React.useState({ done: 0, total: 0 });
  const [bulkRows, setBulkRows] = React.useState<
    Array<{ topic: string; status: 'queued' | 'ok' | 'failed'; slug?: string; error?: string; content?: string }>
  >([]);
  const [selectedBulkPost, setSelectedBulkPost] = React.useState<number | null>(null);

  React.useEffect(() => {
    console.log('[BlogGen] Dev UI v4 mounted');

    // Add KaTeX styling
    const styleId = 'katex-brand-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = katexStyle;
      document.head.appendChild(style);
    }

    // Load KaTeX CSS if not already loaded
    const katexLinkId = 'katex-css';
    if (!document.getElementById(katexLinkId)) {
      const link = document.createElement('link');
      link.id = katexLinkId;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      link.onload = () => console.log('KaTeX CSS loaded successfully');
      link.onerror = () => console.error('Failed to load KaTeX CSS');
      document.head.appendChild(link);
    }
  }, []);

  // Auto-check the fix checkbox when LaTeX issues are detected
  React.useEffect(() => {
    if (resp?.validation?.latex?.count && resp.validation.latex.count > 0 && !useFixedContent) {
      setUseFixedContent(true);
    }
  }, [resp?.validation?.latex?.count, useFixedContent]);

  function toggle<K extends keyof GenOptions>(key: K) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] as any }));
  }

  // Auto-suggest calculators when topic changes and mainCalculator is empty
  React.useEffect(() => {
    const t = topic.trim();
    if (!t) return;
    if (!mainCalculator.trim()) {
      const s = suggestFromTopic(t);
      setMainCalculator(s.main);
      setOptions((prev) => ({
        ...prev,
        targetCalculators: s.targets,
      }));
    }
  }, [topic]);

  function handleSuggest() {
    const t = topic.trim();
    if (!t) return;
    const s = suggestFromTopic(t);
    setMainCalculator(s.main);
    setOptions((prev) => ({ ...prev, targetCalculators: s.targets }));
  }

  async function run(dryRun: boolean) {
    setLoading(dryRun ? 'preview' : 'publish');
    setError(null);
    setResp(null);
    try {
      // Process keywords into array
      const processedKeywords = keywords.split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .slice(0, 8); // Limit to 8 keywords

      // If no mainCalculator was manually selected, auto-suggest from topic
      const suggestion = !mainCalculator.trim() ? suggestFromTopic(topic.trim()) : null;

      const payload = {
        topic: topic.trim(),
        dryRun,
        useFixedContent: !dryRun && useFixedContent, // Only apply fixes when actually publishing
        options: {
          ...options,
          tone,
          mainCalculator: mainCalculator.trim() || suggestion?.main || '',
          intent: intent.trim(),
          keywords: processedKeywords,
          meta_description: metaDescription.trim(),
          targetCalculators:
            (options.targetCalculators && options.targetCalculators.length > 0)
              ? options.targetCalculators
              : (suggestion?.targets || options.targetCalculators)
        }
      };
      const r = await fetch('/api/admin/bloggen', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await r.json()) as GenResponse;
      if (!r.ok || !json.ok) throw new Error(json.error || `HTTP ${r.status}`);
      setResp(json);
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
    } finally {
      setLoading(null);
    }
  }

  // Apply fixes to content before publishing
  function applyFixesToContent(content: string): string {
    if (useFixedContent && resp?.validation?.latex?.fixedContent) {
      return resp.validation.latex.fixedContent;
    }
    return content;
  }

  // ---- TOC (client-side from markdown)
  const headings = React.useMemo(() => {
    const md = selectedBulkPost !== null && bulkRows[selectedBulkPost]?.content
      ? bulkRows[selectedBulkPost]?.content || ''
      : resp?.markdown || '';
    return Array.from(md.matchAll(/^(#{2,3})\s+(.+)$/gm)).map(m => ({
      level: m[1].length, text: m[2].trim(),
      id: m[2].trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    }));
  }, [resp?.markdown, selectedBulkPost, bulkRows]);

  // ---- Process markdown for better math rendering and hide frontmatter
  const processedMarkdown = React.useMemo(() => {
    let md = selectedBulkPost !== null && bulkRows[selectedBulkPost]?.content
      ? bulkRows[selectedBulkPost]?.content || ''
      : resp?.markdown || '';

    // Use fixed content if available and enabled
    if (useFixedContent && resp?.validation?.latex?.fixedContent) {
      md = resp.validation?.latex?.fixedContent || md;
    }

    // Hide frontmatter from preview (everything between --- markers)
    const withoutFrontmatter = md.replace(/^---[\s\S]*?---\n/, '');

    // Remove the first H1 title to avoid duplication (since we show it above)
    const withoutDuplicateTitle = withoutFrontmatter.replace(/^(#\s+[^\n]+)\n/, '');

    // Fix LaTeX expressions that aren't properly formatted - be extremely conservative
    // Escape currency dollars so they don't open inline math spans
    // Example: $300,000 ... $400 would be parsed as one math block and collapse spaces
    const currencyEscaped = withoutDuplicateTitle.replace(/\$(?=\d)/g, '\\$');

    let processed = currencyEscaped;

    // Skip LaTeX processing if disabled or if no actual LaTeX content detected
    if (!disableLatexProcessing) {
      // Only apply LaTeX fixes if there's actual LaTeX content (contains LaTeX commands)
      const hasLatexContent = /\\[a-zA-Z]+/.test(processed);

      if (hasLatexContent) {
        processed = processed
          .replace(/\[ \\text{([^}]+)} \]/g, '$$$1$$')  // Convert [ \text{...} ] to $$...$$
          .replace(/\\text{([^}]+)}/g, '$\\text{$1}$')  // Convert \text{...} to $\text{...}$
          .replace(/\\\\/g, '\\')  // Fix double backslashes
          .replace(/\$\$([^$]*\\[^$]*)\$\$/g, (match, content) => {  // Only fix display math that actually contains LaTeX commands
            return `$$$${content}$$$`;
          })
          .replace(/\$([^$]*\\[^$]*)\$/g, (match, content) => {  // Only fix inline math that actually contains LaTeX commands
            return `$${content}$`;
          });
      }
    }

    return processed;
  }, [resp?.markdown, selectedBulkPost, bulkRows]);

  // ---- bulk client loop (3 at a time)
  async function runBulk(dryRun: boolean) {
    const topics = bulkText.split('\n').map(s => s.trim()).filter(Boolean);
    if (!topics.length) return;

    setBulkRows(topics.map(t => ({ topic: t, status: 'queued' as const })));
    setBulkProgress({ done: 0, total: topics.length });
    setBulkRunning(true);

    let i = 0;
    const conc = 3;

    const updateRow = (idx: number, patch: Partial<(typeof bulkRows)[number]>) => {
      setBulkRows(prev => {
        const next = prev.slice();
        next[idx] = { ...next[idx], ...patch };
        return next;
      });
    };

    async function worker() {
      while (i < topics.length) {
        const idx = i++;
        const t = topics[idx];
        try {
          console.log(`Processing topic ${idx + 1}/${topics.length}: ${t.substring(0, 50)}...`);

          // Process keywords into array
          const processedKeywords = keywords.split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0)
            .slice(0, 8); // Limit to 8 keywords

          // If no mainCalculator is set in the UI, auto-suggest per topic row
          const suggestion = !mainCalculator.trim() ? suggestFromTopic(t.trim()) : null;

          const payload = {
            topic: t,
            dryRun,
            useFixedContent: !dryRun && useFixedContent, // Only apply fixes when actually publishing
            options: {
              template: options.template,
              wordCountHint: options.wordCountHint,
              tone: tone,
              schema: options.schema,
              faqSchema: options.faqSchema,
              schemaHowTo: schemaHowTo,
              internalLinks: options.internalLinks,
              cta: options.cta,
              ctaVariant: ctaVariant,
              imageSuggestions: options.imageSuggestions,
              targetCalculators:
                (options.targetCalculators && options.targetCalculators.length > 0)
                  ? options.targetCalculators
                  : (suggestion?.targets || options.targetCalculators),
              mainCalculator: mainCalculator.trim() || suggestion?.main || '',
              intent: intent.trim(),
              keywords: processedKeywords,
              meta_description: metaDescription.trim(),
              meta_title: metaTitle.trim(),
            }
          };

          console.log('Payload length:', JSON.stringify(payload).length);

          const r = await fetch('/api/admin/bloggen', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });

          let json: GenResponse;
          if (r.ok) {
            json = (await r.json()) as GenResponse;
          } else {
            // If response is not ok, get the error text
            const errorText = await r.text();
            throw new Error(`HTTP ${r.status}: ${r.statusText} - ${errorText}`);
          }

          if (!json.ok) throw new Error(json.error || 'API returned error');

          updateRow(idx, { status: 'ok', slug: json.slug, content: json.markdown });
        } catch (e: any) {
          console.error(`Error processing topic ${idx + 1}:`, e);
          updateRow(idx, { status: 'failed', error: e?.message || 'Unknown error' });
        } finally {
          setBulkProgress(prev => ({ ...prev, done: prev.done + 1 }));
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    await Promise.all(Array.from({ length: conc }).map(worker));
    setBulkRunning(false);
  }

  // Validation checks
  const isIntentValid = intent.trim().length > 0 && intent.trim().length <= 160;
  const isMetaDescriptionValid = metaDescription.trim().length > 0 && metaDescription.trim().length <= 160;
  const processedKeywords = keywords.split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .slice(0, 8);
  const areKeywordsValid = processedKeywords.length <= 8;

  const disabled = !topic.trim() || !mainCalculator.trim() || !isIntentValid || !isMetaDescriptionValid || !areKeywordsValid || !!loading;

  // Clear/refresh function
  const clearForm = () => {
    setTopic('');
    setIntent('');
    setKeywords('');
    setMetaDescription('');
    setMainCalculator('');
    setResp(null);
    setError(null);
    setSelectedBulkPost(null);
    setBulkText('');
    setBulkRows([]);
    setBulkProgress({ done: 0, total: 0 });
    setPreviewTab('rendered');
    setUseFixedContent(false);
    setDisableLatexProcessing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Blog Generator — Dev UI v4 ✅</h1>
      <p className="text-sm text-gray-600 mb-6">Templates, length, tone, TOC, image suggestions, categories/tags, related posts, and bulk generation.</p>

      {/* Topic and Main Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic</label>
          <input
            id="topic"
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Explain how to calculate ROI and annualized ROI for small business investments"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="mainCalculator" className="block text-sm font-medium mb-2">
            Main Calculator <span className="text-amber-600">*</span>
            <button
              type="button"
              onClick={handleSuggest}
              className="ml-2 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
              title="Suggest based on topic"
            >
              Suggest
            </button>
          </label>
          <select
            id="mainCalculator"
            className="w-full border rounded px-3 py-2"
            value={mainCalculator}
            onChange={(e) => setMainCalculator(e.target.value)}
            required
          >
            <option value="">Select main calculator...</option>

            {/* FREE Calculators */}
            <optgroup label="🆓 FREE Calculators">
              <option value="Break-even Calculator">Break-even Calculator</option>
              <option value="ROI Calculator">ROI Calculator</option>
              <option value="Mortgage Calculator">Mortgage Calculator</option>
              <option value="Simple vs Compound Interest Calculator">Simple vs Compound Interest Calculator</option>
              <option value="Freelance Rate Calculator">Freelance Rate Calculator</option>
              <option value="Restaurant Tips Calculator">Restaurant Tips Calculator</option>
              <option value="Tip & Tab Split Calculator">Tip & Tab Split Calculator</option>
              <option value="Shopping Budget Calculator">Shopping Budget Calculator</option>
            </optgroup>

            {/* PLUS Calculators */}
            <optgroup label="⭐ PLUS Calculators">
              <option value="Savings Growth Calculator">Savings Growth Calculator</option>
              <option value="Debt Payoff Calculator">Debt Payoff Calculator</option>
              <option value="Split by Order Calculator">Split by Order Calculator</option>
            </optgroup>

            {/* PRO Calculators */}
            <optgroup label="👑 PRO Calculators">
              <option value="Employee Cost Calculator">Employee Cost Calculator (PRO)</option>
              <option value="Expense Split Deluxe Calculator">Expense Split Deluxe Calculator (PRO)</option>
            </optgroup>
          </select>
          <div className="mt-1 text-xs text-gray-500">
            Choose which calculator to feature prominently. FREE = all users, PLUS = paid subscribers, PRO = premium subscribers.
          </div>
          {options.targetCalculators?.length ? (
            <div className="mt-2 text-xs text-gray-700">
              <div className="mb-1 font-medium">Suggested supporting calculators:</div>
              <div className="flex flex-wrap gap-1">
                {options.targetCalculators.map((t, i) => (
                  <span key={i} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {mainCalculator && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <strong>Main Calculator:</strong> {mainCalculator}
                  <div className="mt-1 text-green-700">
                    This calculator will be featured prominently throughout the entire article with detailed examples
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Fields */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <div className={`border rounded p-6 ${intent.trim() && !isIntentValid ? 'border-red-300 bg-red-50' : ''}`}>
          <label htmlFor="intent" className="block text-sm font-medium mb-2">
            Search Intent <span className="text-red-500">*</span>
          </label>
          <textarea
            id="intent"
            className={`w-full border rounded px-3 py-2 text-sm h-16 resize-vertical ${intent.trim() && !isIntentValid ? 'border-red-300' : ''}`}
            placeholder="e.g., Users want to understand how to calculate ROI to make better investment decisions"
            value={intent}
            onChange={(e) => setIntent(e.target.value.slice(0, 160))}
            maxLength={160}
            required
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {intent.length}/160 characters
          </div>
          {intent.trim() && !isIntentValid && (
            <div className="mt-1 text-xs text-red-600">
              Search intent is required and must be 160 characters or less
            </div>
          )}
        </div>

        <div className="border rounded p-6">
          <label htmlFor="keywords" className="block text-sm font-medium mb-2">
            Focus Keywords
          </label>
          <input
            id="keywords"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="ROI, return on investment, investment analysis, business metrics"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <div className="mt-1 text-xs text-gray-500">
            Comma-separated keywords (max 8)
          </div>
          {keywords.trim() && (
            <div className="mt-2 flex flex-wrap gap-1">
              {keywords.split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0)
                .slice(0, 8)
                .map((keyword, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className={`border rounded p-6 ${metaDescription.trim() && !isMetaDescriptionValid ? 'border-red-300 bg-red-50' : ''}`}>
          <label htmlFor="meta_description" className="block text-sm font-medium mb-2">
            Meta Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="meta_description"
            className={`w-full border rounded px-3 py-2 text-sm h-20 resize-vertical ${metaDescription.trim() && !isMetaDescriptionValid ? 'border-red-300' : ''}`}
            placeholder="A comprehensive guide to calculating ROI and annualized ROI for small business investments with practical examples."
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
            maxLength={160}
            required
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {metaDescription.length}/160 characters
          </div>
          <div className="mt-4">
            <label htmlFor="meta_title" className="block text-sm font-medium mb-2">Meta Title (optional)</label>
            <input
              id="meta_title"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Include main keyword and calculator, ~60 chars"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value.slice(0, 60))}
              maxLength={60}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">{metaTitle.length}/60 characters</div>
          </div>
          {metaDescription.trim() && !isMetaDescriptionValid && (
            <div className="mt-1 text-xs text-red-600">
              Meta description is required and must be 160 characters or less
            </div>
          )}
        </div>
      </div>

      {/* Template / Length / Tone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded p-6">
          <label className="block text-sm font-medium mb-3">Template</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={options.template}
            onChange={(e) => setOptions(o => ({ ...o, template: e.target.value as GenOptions['template'] }))}
          >
            {TEMPLATE_PRESETS.map(t => <option key={t.value!} value={t.value!}>{t.label}</option>)}
          </select>
        </div>

        <div className="border rounded p-6">
          <label className="block text-sm font-medium mb-3">Length</label>
          <div className="space-y-2">
            {(['short', 'standard', 'long'] as const).map(k => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="radio" name="length" checked={options.wordCountHint === k}
                  onChange={() => setOptions(o => ({ ...o, wordCountHint: k }))} />
                {k === 'short' ? 'Short (~700 words)' : k === 'long' ? 'Long (~1,800 words)' : 'Standard (~1,200 words)'}
              </label>
            ))}
          </div>
        </div>

        <div className="border rounded p-6">
          <label className="block text-sm font-medium mb-3">Tone & Style Instructions</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm h-24 resize-vertical"
            value={tone}
            onChange={(e) => { setTone(e.target.value); setOptions(o => ({ ...o, tone: e.target.value })) }}
            placeholder="Describe the tone, style, and specific instructions for the content...

Examples:
• Friendly & helpful, like a trusted mentor explaining concepts clearly
• Professional & authoritative, focusing on data-driven insights
• Faith-integrated & encouraging, with biblical principles and motivational elements
• Story-like cinematic, engaging narrative with practical examples
• Data-driven & concise, focusing on actionable metrics and calculations"
          />
          <div className="mt-3 text-xs text-gray-500 leading-relaxed">
            💡 Tip: Be specific about your desired voice, target audience, and any particular elements to emphasize or avoid.
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 border rounded p-4">
        <p className="font-medium mb-3">Blog Generation Options</p>
        <div className="grid grid-cols-2 gap-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!options.schema} onChange={() => toggle('schema')} />Schema Markup</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!options.faqSchema} onChange={() => toggle('faqSchema')} />FAQ Schema</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!schemaHowTo} onChange={() => setSchemaHowTo(v => !v)} />HowTo Schema</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!options.internalLinks} onChange={() => toggle('internalLinks')} />Internal Links</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!options.cta} onChange={() => toggle('cta')} />Call-to-Action</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!options.imageSuggestions} onChange={() => toggle('imageSuggestions')} />Image Suggestions</label>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">CTA Variant</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={ctaVariant} onChange={(e) => setCtaVariant(e.target.value as any)}>
              <option value="calculators">Link to Calculators</option>
              <option value="pricing">Link to Pricing</option>
              <option value="upgrade">Link to Upgrade</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Target Calculators (comma-separated)</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Break-even Calculator, ROI Calculator, Mortgage Calculator, Savings Growth Calculator"
            value={(options.targetCalculators || []).join(', ')}
            onChange={(e) =>
              setOptions(prev => ({
                ...prev,
                targetCalculators: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              }))
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => run(true)} disabled={disabled} className="rounded bg-gray-900 text-white px-4 py-2 disabled:opacity-50">
          {loading === 'preview' ? 'Generating…' : 'Preview (dry run)'}
        </button>
        <button onClick={() => run(false)} disabled={disabled} className="rounded bg-emerald-600 text-white px-4 py-2 disabled:opacity-50">
          {loading === 'publish' ? 'Publishing…' : 'Publish'}
        </button>
        <button onClick={clearForm} className="rounded bg-gray-500 text-white px-4 py-2 hover:bg-gray-600">
          Clear Form
        </button>
      </div>

      {/* Preview region */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* TOC */}
        <aside className="md:sticky md:top-4 h-max border rounded p-4">
          <p className="text-sm font-medium mb-2">Table of Contents</p>
          {headings.length ? (
            <ul className="text-sm space-y-1">
              {headings.map((h, i) => (
                <li key={i} className={h.level === 2 ? 'ml-0' : 'ml-4'}>
                  <a href={`#${h.id}`} className="text-blue-700 underline">{h.text}</a>
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-gray-500">No headings yet.</p>}
        </aside>

        <div className="rounded border bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm text-gray-600">
              {loading ? (loading === 'preview' ? 'Generating preview…' : 'Publishing…')
                : selectedBulkPost !== null ? `Bulk post preview (${selectedBulkPost + 1}/${bulkRows.length})`
                  : resp ? (resp.saved ? 'Saved ✅' : 'Preview only (not saved)')
                    : 'No preview yet. Click "Preview (dry run)" or select a bulk post below.'}
            </div>
            <div className="flex gap-1 items-center">
              <div className="flex gap-1">
                <button className={`text-xs px-2 py-1 rounded ${previewTab === 'rendered' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setPreviewTab('rendered')}>Rendered</button>
                <button className={`text-xs px-2 py-1 rounded ${previewTab === 'raw' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setPreviewTab('raw')}>Raw</button>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="checkbox"
                  id="disable-latex-processing"
                  checked={disableLatexProcessing}
                  onChange={(e) => setDisableLatexProcessing(e.target.checked)}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <label htmlFor="disable-latex-processing" className="text-xs text-gray-600">
                  Disable LaTeX processing
                </label>
              </div>
            </div>
          </div>

          <div className="px-4 py-5">
            {error && <div className="mb-4 rounded border border-red-300 bg-red-50 text-red-800 px-3 py-2">{error}</div>}

            {/* Validation Warnings */}
            {resp?.validation?.hasIssues && (
              <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-3 py-3">
                <h3 className="font-medium text-amber-900 mb-2">Content Validation Issues Detected</h3>

                {/* Spelling Issues */}
                {resp.validation?.spelling?.count && resp.validation.spelling.count > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      Spelling Issues ({resp.validation.spelling.count} words):
                    </p>
                    <div className="text-xs text-amber-700">
                      {resp.validation.spelling.misspelled?.map(word => (
                        <span key={word} className="inline-block mr-2 mb-1">
                          <span className="font-medium">{word}</span>
                          {resp.validation?.spelling?.suggestions?.[word] && (
                            <span className="ml-1 text-amber-600">
                              → {resp.validation.spelling.suggestions[word]?.join(', ')}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* LaTeX Issues */}
                {resp.validation?.latex?.count && resp.validation.latex.count > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      LaTeX Formatting Issues ({resp.validation.latex.count}):
                    </p>
                    <ul className="text-xs text-amber-700 list-disc list-inside">
                      {resp.validation.latex.issues?.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>

                    <div className="mt-3 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id="use-fixed-content"
                          checked={useFixedContent}
                          onChange={(e) => setUseFixedContent(e.target.checked)}
                          className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="use-fixed-content" className="text-sm font-medium text-amber-800">
                          ✅ Apply LaTeX fixes when publishing
                        </label>
                      </div>
                      <p className="text-xs text-amber-700 ml-6">
                        When enabled, auto-fixed content will be saved to the published post. Leave unchecked to keep original formatting.
                        <strong>Note:</strong> Preview shows fixes for display only - published content may differ until you check this box and publish.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-amber-600 mt-2">
                  These issues won't prevent publishing, but fixing them will improve content quality.
                </p>
              </div>
            )}

            {/* Show either single post or selected bulk post info */}
            {(resp || selectedBulkPost !== null) && (
              <div className="text-sm mb-2">
                <span className="font-medium">
                  {selectedBulkPost !== null ? 'Bulk Post:' : 'Post:'}
                </span>{' '}
                <code>
                  {selectedBulkPost !== null
                    ? bulkRows[selectedBulkPost]?.slug || 'Generating...'
                    : resp?.slug
                  }
                </code>
                {selectedBulkPost !== null && bulkRows[selectedBulkPost]?.slug && (
                  <> · <a className="text-blue-600 underline" href={`/blog/${bulkRows[selectedBulkPost]?.slug}`} target="_blank">Open post</a></>
                )}
                {resp?.saved && resp?.slug && <> · <a className="text-blue-600 underline" href={`/blog/${resp.slug}`} target="_blank">Open post</a></>}
              </div>
            )}

            {/* Meta suggestions - only show for single posts or selected bulk posts */}
            {((resp?.meta && selectedBulkPost === null) || (selectedBulkPost !== null && bulkRows[selectedBulkPost])) && (
              <div className="mb-4 text-sm">
                <p><b>Topic:</b> {
                  selectedBulkPost !== null
                    ? bulkRows[selectedBulkPost]?.topic || ''
                    : topic
                }</p>
                {/* Note: Meta suggestions would need to be stored for bulk posts too */}
              </div>
            )}

            {previewTab === 'rendered' ? (
              <div className="space-y-4">
                <article className="
                  prose prose-sm max-w-none
                  prose-headings:text-gray-900 prose-headings:leading-tight
                  prose-a:text-emerald-700 hover:prose-a:text-emerald-800
                  prose-strong:text-gray-900
                  prose-blockquote:border-emerald-200
                  prose-code:bg-emerald-50 prose-code:text-emerald-900 prose-code:text-xs
                  prose-img:rounded-lg
                  prose-p:leading-relaxed
                ">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {processedMarkdown}
                  </ReactMarkdown>
                </article>
              </div>
            ) : (
              <textarea
                readOnly
                value={processedMarkdown}
                className="mt-2 w-full h-96 border-t p-3 font-mono text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bulk */}
      <div className="mt-10 border rounded">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="font-semibold">Bulk generation</h2>
          <div className="text-sm text-gray-600">
            Progress: {bulkProgress.done}/{bulkProgress.total}
            {!bulkRunning && bulkProgress.done > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Complete
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">Topics (one per line)</label>
          <textarea
            className="w-full border rounded p-2 h-40 font-mono text-sm"
            placeholder="ROI for small business\nAnnualized ROI vs simple ROI\nBreak-even analysis for Etsy shop"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
          />
          <div className="flex gap-2 mt-3">
            <button disabled={bulkRunning || !bulkText.trim()} onClick={() => runBulk(true)} className="rounded bg-gray-900 text-white px-3 py-2 disabled:opacity-50">Bulk Preview</button>
            <button disabled={bulkRunning || !bulkText.trim()} onClick={() => runBulk(false)} className="rounded bg-emerald-600 text-white px-3 py-2 disabled:opacity-50">Bulk Publish</button>
          </div>

          {bulkRows.length ? (
            <div className="mt-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead><tr><th className="text-left p-2">Topic</th><th className="text-left p-2">Status</th><th className="text-left p-2">Slug / Error</th></tr></thead>
                  <tbody>
                    {bulkRows.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-t ${r.status === 'ok' && r.content ? 'cursor-pointer hover:bg-gray-50' : ''} ${selectedBulkPost === i ? 'bg-blue-50' : ''}`}
                        onClick={() => r.status === 'ok' && r.content && setSelectedBulkPost(selectedBulkPost === i ? null : i)}
                      >
                        <td className="p-2">{r.topic}</td>
                        <td className="p-2">{r.status === 'ok' ? '✅' : r.status === 'failed' ? '❌' : '⏳'}</td>
                        <td className="p-2">
                          {r.slug ? (
                            <div>
                              <code className="text-green-600">{r.slug}</code>
                              <a href={`/blog/${r.slug}`} target="_blank" className="ml-2 text-blue-600 underline text-xs">View</a>
                              {r.content && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {selectedBulkPost === i ? '👁️ Showing below' : '👁️ Click to preview'}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-red-600">{r.error || 'Processing...'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!bulkRunning && bulkProgress.done > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm text-green-800">
                    ✅ Bulk generation complete! {bulkRows.filter(r => r.status === 'ok').length} posts generated successfully.
                    {bulkRows.filter(r => r.status === 'failed').length > 0 && (
                      <span className="block mt-1 text-orange-700">
                        ⚠️ {bulkRows.filter(r => r.status === 'failed').length} posts failed - check errors above.
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
