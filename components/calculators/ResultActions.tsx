"use client";

import { useEffect, useRef, useState } from "react";

type ResultActionsProps = {
  getSummary: () => string;
  filenamePrefix: string;
  showPrint?: boolean;
  className?: string;
};

function toFilenameDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function ResultActions({ getSummary, filenamePrefix, showPrint = false, className }: ResultActionsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function showMessage(value: string) {
    setMessage(value);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setMessage(null), 2000);
  }

  async function copyResults() {
    try {
      await navigator.clipboard.writeText(getSummary());
      showMessage("Results copied.");
    } catch {
      showMessage("Copy failed.");
    }
  }

  function downloadSummary() {
    const summary = getSummary();
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filenamePrefix}-${toFilenameDate(new Date())}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function printSummary() {
    window.print();
  }

  return (
    <div className={`space-y-3 rounded-2xl border border-plum-200/60 bg-white/75 p-4 shadow-sm backdrop-blur ${className ?? ""}`.trim()}>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyResults} className="btn-ghost-regal">
          Copy Results
        </button>
        <button type="button" onClick={downloadSummary} className="btn-ghost-regal">
          Download Summary
        </button>
        {showPrint && (
          <button type="button" onClick={printSummary} className="btn-ghost-regal">
            Print / Save PDF
          </button>
        )}
      </div>
      <p aria-live="polite" className="min-h-5 text-xs font-medium text-emerald-700">
        {message ?? ""}
      </p>
    </div>
  );
}