import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const choice = url.searchParams.get("choice"); // "employee" | "deluxe"
  const backTo = url.searchParams.get("redirect") || "/pro";

  if (choice !== "employee" && choice !== "deluxe") {
    return new NextResponse("Invalid choice", { status: 400 });
  }

  const res = NextResponse.redirect(new URL(backTo, url));
  // not httpOnly so the client can read it if you ever need to (fine for dev)
  res.cookies.set("fwv_pro_choice", choice, { path: "/", sameSite: "lax", httpOnly: false });
  return res;
}
