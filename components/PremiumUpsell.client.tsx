'use client';
import Link from 'next/link';

type Props = { className?: string; price: number };

export default function PremiumUpsell({ className = '', price }: Props) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow ${className}`}>
      <h3 className="text-lg font-semibold">Unlock everything with Premium</h3>
      <p className="mt-1 text-sm text-neutral-700">
        Get access to <b>all calculators</b> (including Employee Cost & Expense Split Deluxe) and <b>all report downloads</b>.
      </p>
      <div className="mt-3 flex gap-3">
        <Link href="/pricing?required=premium" className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
          Go Premium (${price.toFixed(2)}/mo)
        </Link>
        <Link href="/pricing" className="px-4 py-2 rounded-lg border border-emerald-700 text-emerald-700 hover:bg-emerald-50">
          Compare plans
        </Link>
      </div>
    </div>
  );
}
