import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ChooseProPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const sp = await searchParams;
  const backTo = sp.redirect ?? "/pro";
  // read plan just to show context (optional)
  const jar = await cookies();
  const plan = jar.get("fwv_plan")?.value ?? "free";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-green">
        Choose Your Pro Feature
      </h1>
      <p className="mt-2 text-gray-700">
        Your plan: <b>{plan}</b>. Pick which Pro feature you want to unlock.
      </p>

      <div className="mt-6 space-y-3">
        <a
          href={`/api/debug/set-pro-choice?choice=employee&redirect=${encodeURIComponent(backTo)}`}
          className="inline-block rounded-lg bg-brand-green px-4 py-2 font-semibold text-white"
        >
          Unlock Employee Cost
        </a>

        <div>
          <a
            href={`/api/debug/set-pro-choice?choice=deluxe&redirect=${encodeURIComponent(backTo)}`}
            className="inline-block rounded-lg bg-brand-gold px-4 py-2 font-semibold text-white"
          >
            Unlock ExpenseSplit Deluxe
          </a>
        </div>
      </div>
    </main>
  );
}
