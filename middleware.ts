// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Only guard admin & its APIs
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isAdminApi = nextUrl.pathname.startsWith("/api/admin");
  if (!isAdmin && !isAdminApi) return NextResponse.next();

  // FULL BYPASS on localhost/127.0.0.1
  const host = nextUrl.hostname; // reliable
  if (host === "localhost" || host === "127.0.0.1") {
    return NextResponse.next();
  }

  // In prod you can decide later (404 or auth); for now just 404.
  return NextResponse.rewrite(new URL("/not-found", req.url));
}

export const config = {
  matcher: ["/admin/:path*","/api/admin/:path*"],
};
