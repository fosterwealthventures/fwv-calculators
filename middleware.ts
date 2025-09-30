// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PLAN_COOKIE = "fwv_plan";
const VALID = new Set(["free", "plus", "pro", "premium"] as const);

function normalizePlan(value: string | undefined): "free" | "plus" | "pro" | "premium" {
  if (!value) return "free";
  const v = value.toLowerCase();
  return (VALID.has(v as any) ? (v as any) : "free");
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const current = normalizePlan(req.cookies.get(PLAN_COOKIE)?.value);

  // ?reset=1 => force free
  if (searchParams.get("reset") === "1") {
    const url = req.nextUrl.clone();
    url.searchParams.delete("reset");
    const res = NextResponse.redirect(url);
    res.cookies.set(PLAN_COOKIE, "free", { path: "/", httpOnly: false, sameSite: "lax" });
    return res;
  }

  // ?plan=free|plus|pro|premium => preview a plan
  const planParam = searchParams.get("plan");
  if (planParam && VALID.has(planParam.toLowerCase() as any)) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("plan");
    const res = NextResponse.redirect(url);
    res.cookies.set(PLAN_COOKIE, planParam.toLowerCase(), { path: "/", httpOnly: false, sameSite: "lax" });
    return res;
  }

  // Passthrough (and normalize cookie)
  const res = NextResponse.next();
  if (current !== req.cookies.get(PLAN_COOKIE)?.value) {
    res.cookies.set(PLAN_COOKIE, current, { path: "/", httpOnly: false, sameSite: "lax" });
  }

  // Gating
  if (pathname.startsWith("/plus")) {
    if (!(current === "plus" || current === "pro" || current === "premium")) {
      const url = req.nextUrl.clone();
      url.pathname = "/upgrade";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/pro")) {
    if (!(current === "pro" || current === "premium")) {
      const url = req.nextUrl.clone();
      url.pathname = "/upgrade";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/premium")) {
    if (current !== "premium") {
      const url = req.nextUrl.clone();
      url.pathname = "/upgrade";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
