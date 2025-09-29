// app/guides/page.tsx
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllGuides } from "@/lib/guides";
import GuideNav from "@/components/GuideNav";
import AdInSidebar from "@/components/ads/AdInSidebar";
import AdGateFreeOnly from "@/components/ads/AdGateFreeOnly";


export const revalidate = 60;

export default function GuideIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      {/* Main */}
      <div>
        <Breadcrumb trail={[{ href: "/guide", label: "Guides" }]} />

        <h1 className="text-3xl font-bold text-brand-green">Guides</h1>
        <p className="mt-2 text-gray-600">
          Short, practical reads that pair with our calculators.
        </p>

        <ul className="mt-8 divide-y divide-gray-200">
          {guides.map((g) => (
            <li key={g.slug} className="flex items-start justify-between gap-4 py-4">
              <div>
                <Link
                  href={`/guide/${g.slug}`}
                  className="text-lg font-semibold text-brand-green hover:underline"
                >
                  {g.title}
                </Link>
                {g.description ? (
                  <p className="mt-1 text-sm text-gray-600">{g.description}</p>
                ) : null}
              </div>
              {g.plan ? (
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    g.plan === "Free"
                      ? "bg-gray-100 text-gray-700"
                      : g.plan === "Plus"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                  title={g.plan === "Free" ? "Available on Free" : `Requires ${g.plan} plan`}
                >
                  {g.plan}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Right rail — Ads must show to Free only */}
      <aside className="sticky top-6 h-fit space-y-8">
        <GuideNav className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" />
        <AdGateFreeOnly>
          <AdInSidebar width={300} height={600} />
        </AdGateFreeOnly>
      </aside>
    </div>
  );
}
