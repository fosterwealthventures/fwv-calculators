// app/pro/page.tsx
import type { Plan, ProChoice } from "@/lib/plan";
import { cookies } from "next/headers";
import ProClient from "./pro-client";

export const dynamic = "force-dynamic";

async function getUserFromCookies(): Promise<{ plan: Plan; proChoice: ProChoice }> {
  const jar = await cookies(); // if your Next types say it's sync, await is harmless
  const plan = (jar.get("fwv_plan")?.value as Plan) ?? "free";
  const proChoice = (jar.get("fwv_pro_choice")?.value as ProChoice) ?? null;
  return { plan, proChoice };
}

export default async function ProPage() {
  const { plan: userPlan, proChoice } = await getUserFromCookies();

  if (userPlan === "pro" && !proChoice) {
    return (
      <main className="min-h-dvh bg-gray-50">
        {/* your chooser UI exactly as you had it */}
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white">
      <ProClient />
    </main>
  );
}
