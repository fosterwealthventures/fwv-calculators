// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const to = (url.searchParams.get("to") || "free").toLowerCase();
  const calc = url.searchParams.get("calc"); // "employee-cost" or "expense-split-deluxe"
  const redirect = url.searchParams.get("redirect") || "/dashboard";

  const plan = ["free", "plus", "pro", "premium"].includes(to)
    ? (to as "free" | "plus" | "pro" | "premium")
    : "free";

  const res = NextResponse.redirect(redirect);

  // plan cookie
  res.cookies.set("fwv_plan", plan, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  // Pro choice (if deep-link provided)
  if (plan === "pro" && calc) {
    const map: Record<string, "employee_cost" | "expense_split" | undefined> = {
      "employee-cost": "employee_cost",
      "expense-split-deluxe": "expense_split",
    };
    const choice = map[calc];
    if (choice) {
      // write a small JS to mirror to localStorage after redirect
      // (cookie alone is enough for ads; choice is client-only)
      res.headers.set(
        "Set-Cookie",
        // keep the existing cookie header intact; append is tricky in edge runtimes,
        // but for a single cookie it's fine to set it again:
        res.headers.get("Set-Cookie") || "",
      );
      // No server cookie for choice; calculators read localStorage.
      // The Upgrade UI also handles it on click.
    }
  }

  return res;
}
