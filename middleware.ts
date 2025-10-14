// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Only run on actual app/API routes; skip static assets & robots
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|og-image|apple-touch-icon.png).*)',
  ],
};

function isLocal(req: NextRequest) {
  const host = req.headers.get('host') || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

// e.g. https://fosterwealthventures.store (no trailing slash)
const PROD_URL = (process.env.PRODUCTION_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(
  /\/+$/,
  ''
);
// just the hostname, e.g. fosterwealthventures.store
const PROD_HOST = PROD_URL.replace(/^https?:\/\//, '').replace(/\/.*/, '');

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // 0) Always allow preflight
  if (req.method === 'OPTIONS') {
    return NextResponse.next();
  }

  // 1) Always allow localhost/dev
  if (isLocal(req)) {
    return NextResponse.next();
  }

  // 2) Never canonicalize/redirect sensitive consoles or their APIs
  //    (prevents breaking your admin UI and blog generator)
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api/admin') ||
    path.startsWith('/api/blog') // <- keep generator/api free of host redirects
  ) {
    return NextResponse.next();
  }

  // 3) Canonical host redirect for everything else (prod only)
  if (PROD_HOST) {
    const currentHost = req.headers.get('host') || '';
    if (currentHost !== PROD_HOST) {
      const target = new URL(url.href);
      target.protocol = 'https:'; // force https in prod
      target.hostname = PROD_HOST; // set canonical host
      target.port = ''; // IMPORTANT: drop any port
      return NextResponse.redirect(target, 308);
    }
  }

  return NextResponse.next();
}
