import { cookies } from "next/headers";
import ProClient from "./pro-client";

export const dynamic = "force-dynamic";

type Plan = "free" | "plus" | "pro" | "premium";
type ProChoice = "expense-split-deluxe" | "employee-cost" | null;

async function getUserFromCookies(): Promise<{ plan: Plan; proChoice: ProChoice }> {
  // Using await handles both sync/async cookie typings across Next versions
  const jar = await cookies();
  const plan = (jar.get("fwv_plan")?.value ?? "free") as Plan;
  const proChoice = (jar.get("fwv_pro_choice")?.value ?? null) as ProChoice;
  return { plan, proChoice };
}

export default async function ProPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const backTo = searchParams?.redirect ?? "/pro";
  const { plan, proChoice } = await getUserFromCookies();

  return (
    <main className="min-h-dvh bg-white">
      <ProClient plan={plan} proChoice={proChoice} backTo={backTo} />
    </main>
  );
}
