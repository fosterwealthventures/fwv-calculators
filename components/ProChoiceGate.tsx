// components/ProChoiceGate.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ProChoice } from "@/lib/plan";

type Props = {
  want: "employee" | "expense_split"; // Updated to match plan.ts
  redirect?: string;
  children: React.ReactNode;
};

function getProChoice(): ProChoice {
  try {
    if (typeof window === "undefined") return null;

    // localStorage
    const lsChoice = localStorage.getItem("fwv-pro-choice") as ProChoice;
    if (lsChoice && ["employee", "expense_split"].includes(lsChoice))
      return lsChoice;

    // cookie
    const cookieMatch = document.cookie.match(/(?:^|; )fwv_pro_choice=([^;]*)/);
    const cookieChoice = cookieMatch
      ? (decodeURIComponent(cookieMatch[1]) as ProChoice)
      : null;
    if (cookieChoice && ["employee", "expense_split"].includes(cookieChoice))
      return cookieChoice;
  } catch {}
  return null;
}

function setProChoice(choice: "employee" | "expense_split") {
  try {
    localStorage.setItem("fwv-pro-choice", choice);
    document.cookie = `fwv_pro_choice=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  } catch {}
}

export default function ProChoiceGate({ want, redirect, children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<ProChoice>(null);

  useEffect(() => {
    setMounted(true);
    setChoice(getProChoice());
  }, []);

  const label = want === "employee" ? "Employee Cost" : "Expense Split Deluxe";

  if (!mounted) return <div className="p-4 text-center">Loading...</div>;

  // If no choice made yet, show selection UI
  if (choice === null) {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Choose Your Pro Calculator
        </h3>
        <p className="text-blue-700 mb-4">
          Your Pro plan includes one advanced calculator. Choose{" "}
          <strong>{label}</strong> as your permanent selection.
        </p>
        <button
          onClick={() => {
            setProChoice(want);
            setChoice(want);
            if (redirect) {
              window.location.href = redirect;
            } else {
              window.location.reload();
            }
          }}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Select {label}
        </button>
      </div>
    );
  }

  // If choice doesn't match what this component wants
  if (choice !== want) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-900">
              This calculator requires: <strong>{label}</strong>
            </p>
            <p className="text-xs text-amber-800">
              Your Pro plan is currently set to:{" "}
              <strong>
                {choice === "employee"
                  ? "Employee Cost"
                  : "Expense Split Deluxe"}
              </strong>
            </p>
          </div>
          <button
            onClick={() => {
              setProChoice(want);
              setChoice(want);
              window.location.reload();
            }}
            className="inline-flex items-center rounded-md border border-amber-600 px-3 py-1.5 text-sm font-medium text-amber-900 bg-amber-100 hover:bg-amber-200"
          >
            Switch to {label}
          </button>
        </div>
      </div>
    );
  }

  // Choice matches - render children
  return <>{children}</>;
}
