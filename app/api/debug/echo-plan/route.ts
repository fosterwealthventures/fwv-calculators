import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const v = jar.get("fwv_plan")?.value ?? "(none)";
  return new NextResponse(`fwv_plan=${v}`, { status: 200 });
}
