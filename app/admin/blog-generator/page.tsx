'use client';

import React from 'react';

type GenResponse = {
  ok: boolean;
  saved: boolean;
  slug: string;
  title: string;
  excerpt: string;
  markdown: string;
  dryRun?: boolean;
  error?: string;
  [k: string]: any;
};

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}


export default function BlogGeneratorPage() {
  const [topic, setTopic] = React.useState('');
  const [dryRun, setDryRun] = React.useState(true);
  const [secret, setSecret] = React.useState(''); // optional (prod)
  const [secretHeader, setSecretHeader] = React.useState<'x-automate-secret' | 'x-admin-key' | 'basic'>('x-automate-secret');
  const [basicUser, setBasicUser] = React.useState('');
  const [basicPass, setBasicPass] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<GenResponse | null>(null);
  const [status, setStatus] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const isLocalhost = () => typeof window !== 'undefined' && location.host.startsWith('localhost');

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    setStatus(null);

    try {
      const headers: Record<string, string> = { 'content-type': 'application/json' };

      // In local dev, the API route bypasses auth; in prod, add whichever auth you prefer
      if (!isLocalhost() && secret) {
        if (secretHeader === 'x-automate-secret') headers['x-automate-secret'] = secret;
        if (secretHeader === 'x-admin-key') headers['x-admin-key'] = secret;
      }
      if (!isLocalhost() && secretHeader === 'basic' && basicUser && basicPass) {
        headers['authorization'] = 'Basic ' + btoa(`${basicUser}:${basicPass}`);
      }

      const res = await fetch('/api/blog/generator', {
        method: 'POST',
        headers,
        body: JSON.stringify({ topic, dryRun }),
      });

      setStatus(res.status);
      const data = (await res.json()) as GenResponse;

      if (!res.ok) {
        setError(data?.error || `Request failed (${res.status})`);
        setResult(data);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text || '');
  }

  function downloadMarkdown() {
    if (!result?.markdown) return;
    const fname = (result.slug || 'post') + '.md';
    const blob = new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const canSubmit = topic.trim().length > 3 && !loading;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog Generator (Admin)</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate SEO-ready posts for FWV Calculators. Localhost does not require auth; production does.
        </p>
      </header>

      {/* Form */}
      <div className="grid gap-6 rounded-2xl border border-gray-200 p-6">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Topic / Working Title</span>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-900"
            placeholder="e.g., Gold vs S&P 500: 20-Year Reality Check"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
            />
            <span className="text-sm">Dry run (no file write)</span>
          </label>

          {!isLocalhost() && (
            <>
              <label className="inline-flex items-center gap-2">
                <span className="text-sm">Auth type:</span>
                <select
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                  value={secretHeader}
                  onChange={(e) => setSecretHeader(e.target.value as any)}
                >
                  <option value="x-automate-secret">x-automate-secret</option>
                  <option value="x-admin-key">x-admin-key</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </label>

              {secretHeader !== 'basic' ? (
                <input
                  className="min-w-[18rem] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="Auth secret (do not hardcode in prod)"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                    placeholder="User"
                    value={basicUser}
                    onChange={(e) => setBasicUser(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                    placeholder="Pass"
                    value={basicPass}
                    onChange={(e) => setBasicPass(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generate}
            disabled={!canSubmit}
            className={classNames(
              'rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition',
              canSubmit
                ? 'bg-gray-900 text-white hover:bg-black'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            )}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>

          {status !== null && (
            <span
              className={classNames(
                'rounded-md px-2 py-1 text-xs font-medium',
                status >= 200 && status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}
              title="HTTP status"
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 grid gap-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        )}

        {result && (
          <div className="grid gap-6 rounded-2xl border border-gray-200 p-6">
            {/* Meta */}
            <div className="grid gap-2">
              <div className="text-sm text-gray-500">Slug</div>
              <div className="flex items-center justify-between gap-3">
                <code className="rounded bg-gray-100 px-2 py-1 text-sm">{result.slug}</code>
                <button
                  onClick={() => copy(result.slug)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                >
                  Copy slug
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="grid gap-2">
              <div className="text-sm text-gray-500">Title</div>
              <div className="flex items-center justify-between gap-3">
                <input
                  readOnly
                  value={result.title || ''}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
                <button
                  onClick={() => copy(result.title || '')}
                  className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="grid gap-2">
              <div className="text-sm text-gray-500">Meta Description / Excerpt</div>
              <div className="flex items-center justify-between gap-3">
                <textarea
                  readOnly
                  value={result.excerpt || ''}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
                <button
                  onClick={() => copy(result.excerpt || '')}
                  className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Markdown */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Markdown</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copy(result.markdown || '')}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    Copy markdown
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    Download .md
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={result.markdown || ''}
                rows={16}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs leading-5"
              />
            </div>

            {/* Hints */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="font-semibold">Publishing tips</div>
              <ul className="mt-1 list-disc pl-4">
                <li>Title: aim for ~45–60 chars. Meta description: ~140–160 chars.</li>
                <li>Add a strong CTA to calculators (Free/Plus/Pro) and include your faith footer whisper.</li>
                <li>If you need images, add them after the front-matter and commit to <code>content/blog/</code>.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
