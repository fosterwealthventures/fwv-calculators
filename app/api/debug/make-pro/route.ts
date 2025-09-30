import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const backTo = url.searchParams.get("redirect") || "/pro";
  const res = NextResponse.redirect(new URL(backTo, url));
  res.cookies.set("fwv_plan", "pro", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });
  return res;
}
