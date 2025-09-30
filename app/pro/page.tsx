// app/pro/page.tsx
import type { Plan, ProChoice } from "@/lib/plan";
import { cookies } from "next/headers";
import NextDynamic from "next/dynamic"; // alias to avoid clashing with `export const dynamic`

export const dynamic = "force-dynamic";

// Load the WHOLE suite on the client (prevents hydration mismatch)
const FosterWealthCalculatorsClient = NextDynamic(
  () => import("@/components/foster_wealth_calculators_suites"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-dvh bg-white">
        <div className="mx-auto max-w-6xl p-8 text-sm opacity-70">
          Loading calculators…
        </div>
      </main>
    ),
  },
);

async function getUserFromCookies(): Promise<{
  plan: Plan;
  proChoice: ProChoice;
}> {
  const jar = await cookies();
  const plan = (jar.get("fwv_plan")?.value as Plan) ?? "free";
  const proChoice = (jar.get("fwv_pro_choice")?.value as ProChoice) ?? null;
  return { plan, proChoice };
}

export default async function ProPage() {
  const { plan: userPlan, proChoice } = await getUserFromCookies();

  // If Pro user hasn't picked yet, show chooser (NO default)
  if (userPlan === "pro" && !proChoice) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <div className="mx-auto max-w-6xl p-8 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Choose your Pro calculator
            </h1>
            <p className="text-sm text-gray-700">
              Your Pro plan includes <span className="font-medium">one</span> of
              the following. Pick the one you want to unlock now — you can
              switch later.
            </p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Employee Cost */}
            <a
              href={`/api/debug/set-pro-choice?choice=employee&redirect=${encodeURIComponent("/pro")}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Employee Cost Calculator
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                  Pro
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Calculate the all-in cost of a new hire (wages, taxes, benefits)
                and model scenarios.
              </p>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-gray-800">
                <li>Wages, employer taxes, benefits</li>
                <li>Scenario comparisons</li>
                <li>Downloadable summary</li>
              </ul>
              <span className="mt-4 inline-flex items-center gap-2 text-emerald-700 group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">Use this</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 7.414V16a1 1 0 11-2 0V7.414L6.707 9.707A1 1 0 015.293 8.293l5-5z" />
                </svg>
              </span>
            </a>

            {/* Expense Split Deluxe */}
            <a
              href={`/api/debug/set-pro-choice?choice=expenseSplitDeluxe&redirect=${encodeURIComponent("/pro")}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Expense Split Deluxe</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                  Pro
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Split shared expenses fairly (roommates, couples, travel). Add
                custom categories and rules.
              </p>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-gray-800">
                <li>Equal / percentage / income-weighted</li>
                <li>Child & travel add-ons</li>
                <li>Export report</li>
              </ul>
              <span className="mt-4 inline-flex items-center gap-2 text-emerald-700 group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">Use this</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 7.414V16a1 1 0 11-2 0V7.414L6.707 9.707A1 1 0 015.293 8.293l5-5z" />
                </svg>
              </span>
            </a>
          </div>

          <p className="text-xs text-gray-600">
            Having trouble?{" "}
            <a
              className="underline underline-offset-2"
              href={`/pro/choose-pro?redirect=${encodeURIComponent("/pro")}`}
            >
              Use the simple chooser
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  // Client-only suite prevents hydration mismatch & click issues
  return (
    <main className="min-h-dvh bg-white">
      <FosterWealthCalculatorsClient />
    </main>
  );
}
