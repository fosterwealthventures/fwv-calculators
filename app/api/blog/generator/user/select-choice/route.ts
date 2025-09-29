// app/api/user/select-choice/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { selectChoice } = await req.json(); // "expense_split" | "employee_cost"
  // TODO: persist to your user/session store
  // e.g., await db.user.update({ where: { id }, data: { selectChoice } });
  // For now, fake it with a cookie so the UI can reflect immediately:
  const res = NextResponse.json({ ok: true });
  res.cookies.set("selectChoice", selectChoice, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
