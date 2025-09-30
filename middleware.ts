// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PLAN_COOKIE = "fwv_plan";
const VALID = new Set(["free", "plus", "pro", "premium"]);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Dev helper: http://localhost:3000/?reset=1  => force free
  if (searchParams.get("reset") === "1") {
    const url = req.nextUrl.clone();
    url.searchParams.delete("reset");
    const r = NextResponse.redirect(url);
    r.cookies.set(PLAN_COOKIE, "free", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
    return r;
  }

  // Strip ?plan= overrides unless you explicitly allow in dev
  if (searchParams.has("plan")) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("plan");
    return NextResponse.redirect(url);
  }

  // Ensure valid cookie; default to free
  const current = req.cookies.get(PLAN_COOKIE)?.value ?? "";
  const hasValid = VALID.has(current);
  const res = NextResponse.next();
  if (!hasValid) {
    res.cookies.set(PLAN_COOKIE, "free", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // (Optional) gate /pro routes: only pro/premium allowed
  if (pathname.startsWith("/pro")) {
    const plan = hasValid ? current : "free";
    if (plan !== "pro" && plan !== "premium") {
      const url = req.nextUrl.clone();
      url.pathname = "/upgrade";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = { matcher: ["/:path*"] };
