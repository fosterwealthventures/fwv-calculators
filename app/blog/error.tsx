"use client";

export default function BlogError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-sm text-neutral-600 mb-4">
        The blog page encountered an error. Please try again or return to the blog index.
      </p>
      {error?.digest && (
        <p className="text-xs text-neutral-500 mb-4">Digest: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Try again
        </button>
        <a href="/blog" className="rounded border px-4 py-2 hover:bg-neutral-50">Back to Blog</a>
      </div>
    </main>
  );
}

