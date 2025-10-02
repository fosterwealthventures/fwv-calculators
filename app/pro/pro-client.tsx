"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Plan = "free" | "plus" | "pro" | "premium";
type ProChoice = "expense-split-deluxe" | "employee-cost" | null;

const COOKIE_PLAN = "fwv_plan";
const COOKIE_PRO_CHOICE = "fwv_pro_choice";

// Simple cookie setter for client components
function setCookie(name: string, value: string, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

export default function ProClient({
  plan,
  proChoice,
  backTo,
}: {
  plan: Plan;
  proChoice: ProChoice;
  backTo?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<ProChoice>(proChoice);

  useEffect(() => {
    setSelected(proChoice);
  }, [proChoice]);

  // If user isn't Pro, nudge to pricing
  if (plan !== "pro") {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-2">Pro membership required</h1>
        <p className="text-neutral-700 mb-4">
          This page is for Pro members. Upgrade to select your Pro calculator.
        </p>
        <Link
          href="/pricing?required=pro"
          className="inline-flex rounded-xl bg-brand-green text-white px-4 py-2 font-semibold hover:opacity-90"
        >
          See Pro plans
        </Link>
      </div>
    );
  }

  // If Pro and no choice yet → show chooser
  if (!selected) {
    const choose = (choice: Exclude<ProChoice, null>) => {
      // Persist selection (locked)
      setCookie(COOKIE_PLAN, "pro");
      setCookie(COOKIE_PRO_CHOICE, choice);
      try {
        localStorage.setItem(COOKIE_PRO_CHOICE, choice);
      } catch {
        /* ignore */
      }
      // Redirect (caller controls via backTo)
      router.push(backTo || `/guide/${choice}`);
    };

    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold mb-2">Choose your Pro calculator</h1>
        <p className="text-neutral-700 mb-6">
          Your Pro plan unlocks <span className="font-semibold">one</span>{" "}
          advanced calculator. Pick below. This selection is locked for your
          billing period.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Split Deluxe */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Expense Split Deluxe</h2>
            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1 mb-4">
              <li>Unlimited expenses & custom categories</li>
              <li>Equal, income %, or custom weights</li>
              <li>Trip mode, notes, downloadable report</li>
            </ul>
            <button
              onClick={() => choose("expense-split-deluxe")}
              className="inline-flex rounded-xl bg-brand-green text-white px-4 py-2 font-semibold hover:opacity-90"
            >
              Unlock Expense Split Deluxe
            </button>
            <Link
              href="/guide/expense-split-deluxe"
              className="ml-3 text-sm underline"
            >
              View guide
            </Link>
          </div>

          {/* Employee Cost */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Employee Cost</h2>
            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1 mb-4">
              <li>Fully-burdened cost (taxes, benefits)</li>
              <li>Scenario comparison & export</li>
              <li>Budget-ready insights for hiring</li>
            </ul>
            <button
              onClick={() => choose("employee-cost")}
              className="inline-flex rounded-xl bg-brand-green text-white px-4 py-2 font-semibold hover:opacity-90"
            >
              Unlock Employee Cost
            </button>
            <Link href="/guide/employee-cost" className="ml-3 text-sm underline">
              View guide
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-neutral-600">
          Need both?{" "}
          <Link
            href="/pricing?required=premium"
            className="underline font-medium"
          >
            Go Premium
          </Link>{" "}
          ($59.99/mo) for access to all calculators.
        </p>
      </div>
    );
  }

  // Selected already (locked)
  const title =
    selected === "expense-split-deluxe" ? "Expense Split Deluxe" : "Employee Cost";
  const guideHref = `/guide/${selected}`;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-2">Pro access set</h1>
      <p className="text-neutral-700 mb-6">
        Your Pro plan is locked to{" "}
        <span className="font-semibold">{title}</span>. You can use all Free and
        Plus calculators, and download reports for your Pro choice.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={guideHref}
          className="inline-flex rounded-xl bg-brand-green text-white px-4 py-2 font-semibold hover:opacity-90"
        >
          Open {title} Guide
        </Link>
        <Link
          href="/calculators"
          className="inline-flex rounded-xl border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-50"
        >
          All Calculators
        </Link>
        <span className="text-sm text-neutral-600">
          Need both?{" "}
          <Link
            href="/pricing?required=premium"
            className="underline font-medium"
          >
            Go Premium
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
