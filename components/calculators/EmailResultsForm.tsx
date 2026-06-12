"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type EmailResultsFormProps = {
  calculatorName: string;
  calculatorType: "credit" | "real-estate" | "utility";
  summaryText: string;
  summaryHtml?: string;
  ctaLabel: string;
  ctaUrl: string;
  disclaimer: string;
  userName?: string;
  userEmail?: string;
};

export default function EmailResultsForm({
  calculatorName,
  calculatorType,
  summaryText,
  summaryHtml,
  ctaLabel,
  ctaUrl,
  disclaimer,
  userName = "",
  userEmail = "",
}: EmailResultsFormProps) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const payload = useMemo(
    () => ({
      calculatorName,
      calculatorType,
      userName: name.trim() || undefined,
      userEmail: email.trim(),
      summaryText,
      summaryHtml,
      ctaLabel,
      ctaUrl,
      disclaimer,
    }),
    [calculatorName, calculatorType, ctaLabel, ctaUrl, disclaimer, email, name, summaryHtml, summaryText],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!payload.userEmail) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/email-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">Email me my results</h3>
        <p className="text-sm text-slate-600">Send a clean Foster Wealth Ventures summary of this calculator to your inbox.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Name, optional</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Email, required</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <p className="text-xs text-slate-500">
        We&apos;ll use your email to send this calculator summary. You may also receive helpful FWV resources related to this topic. {" "}
        <Link href="/privacy" className="underline text-brand-green">
          Privacy Policy
        </Link>
      </p>

      {status === "success" && <p className="text-sm font-medium text-emerald-700">Your results have been sent.</p>}
      {status === "error" && <p className="text-sm font-medium text-red-600">We couldn&apos;t send the email. Please try again.</p>}

      <button type="submit" disabled={status === "sending"} className="btn-regal disabled:cursor-not-allowed disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send My Results"}
      </button>
    </form>
  );
}