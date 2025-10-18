// app/guide/page.tsx
import { getAllGuides } from "@/lib/guides"; // <-- exact path/casing to match lib/guides.ts
import Link from "next/link";

export const metadata = {
  title: "Guides | Foster Wealth Ventures",
  description: "All calculator walkthroughs and best-practice tips.",
};

type Plan = "Free" | "Plus" | "Pro";
type GuideItem = { slug: string; title: string; description?: string; plan?: Plan };

export default function GuideIndex() {
  const guides = getAllGuides() as GuideItem[]; // sync call

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">Guides</h1>

      {!guides?.length ? (
        <p className="mt-6 text-sm text-neutral-600">No guides found yet. Check back soon.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {guides.map((g) => {
            const plan = (g.plan ?? "Free") as Plan;
            return (
              <li
                key={g.slug}
                className="rounded-xl border p-4 hover:shadow flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/guide/${g.slug}`}
                    className="underline hover:no-underline font-medium"
                  >
                    {g.title}
                  </Link>
                  {g.description ? (
                    <p className="mt-1 text-sm text-neutral-600">{g.description}</p>
                  ) : null}
                </div>

                {plan !== "Free" && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border shrink-0">
                    {plan}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
