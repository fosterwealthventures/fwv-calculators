export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-brand-green">404 — Page Not Found</h1>
      <p className="mt-4 text-gray-600">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-brand-green px-6 py-3 text-white shadow hover:bg-brand-green/90"
      >
        Back to Home
      </a>
    </div>
  );
}
