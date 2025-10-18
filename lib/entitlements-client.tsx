"use client";

import { Plan, ProChoice, canDownload, planAllows } from "@/lib/plan";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** Calculator ids used by the GATE (not your UI keys). */
export type CalcId =
  | "roi"
  | "break-even"
  | "mortgage"
  | "interest"
  | "freelancer-rate"
  | "tip-split"
  | "savings" // Plus
  | "debt-payoff" // Plus
  | "employee-cost" // Pro A
  | "expense-split-deluxe"; // Pro B

type EntitlementsState = {
  planId: Plan;
  /** Which Pro calculator the user initially picked. Once set, it is locked. */
  proChoice: ProChoice;
  /** Persisted "last opened" calc id for convenience */
  activeCalc: CalcId;
  setPlanId: (p: Plan) => void;
  /** Only sets if not chosen yet. Does NOTHING once a choice exists. */
  pickProChoiceOnce: (c: Exclude<ProChoice, null>) => void;
  setActiveCalc: (c: CalcId) => void;
  hydrated: boolean;
  /** Check if user can access a specific calculator */
  canAccessCalculator: (calcId: CalcId) => boolean;
  /** Check if user can download reports for a calculator */
  canDownloadReport: (calcId: CalcId) => boolean;
};

/* ------------------------------------------------------------------------------------------------
   Persistence helpers (client-only; never read during SSR)
------------------------------------------------------------------------------------------------ */
function usePersistentState<T>(key: string, initial: T) {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw != null) setValue(JSON.parse(raw));
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // no-op (intentionally ignoring errors in upgrade flow)
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

/* ------------------------------------------------------------------------------------------------
    Dev plan override helpers
 ------------------------------------------------------------------------------------------------ */
function getDevPlanOverride(): Plan | null {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);
  const planParam = searchParams.get("plan");

  if (planParam && ["free", "plus", "pro", "premium"].includes(planParam)) {
    return planParam as Plan;
  }

  return null;
}

const EntitlementsCtx = createContext<EntitlementsState | null>(null);

export function EntitlementsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [planId, setPlanId, h1] = usePersistentState<Plan>(
    "fwv.planId",
    "free",
  );
  const [proChoice, _setProChoice, h2] = usePersistentState<ProChoice>(
    "fwv.proChoice",
    null,
  );
  const [activeCalc, setActiveCalc, h3] = usePersistentState<CalcId>(
    "fwv.activeCalc",
    "roi",
  );

  const pickProChoiceOnce = (c: Exclude<ProChoice, null>) => {
    _setProChoice((prev: ProChoice) => (prev == null ? c : prev)); // lock after first pick
  };

  const hydrated = h1 && h2 && h3;

  // Dev plan override with memoization
  const devPlanOverride = useMemo(() => {
    const override = getDevPlanOverride();
    if (override) {
      // Set up global for debugging
      if (typeof window !== "undefined") {
        (window as any).__FWV_PLAN = override;
      }
      return override;
    }
    return null;
  }, []);

  // Use override if available, otherwise use persisted planId
  const effectivePlanId = useMemo(() => {
    return devPlanOverride || planId;
  }, [devPlanOverride, planId]);

  // Helper functions using your new plan.ts logic
  const canAccessCalculator = (calcId: CalcId): boolean => {
    return planAllows(calcId, effectivePlanId, proChoice);
  };

  const canDownloadReport = (calcId: CalcId): boolean => {
    return canDownload(effectivePlanId, calcId);
  };

  const value = useMemo(
    () => ({
      planId: effectivePlanId,
      proChoice,
      activeCalc,
      setPlanId,
      pickProChoiceOnce,
      setActiveCalc,
      hydrated,
      canAccessCalculator,
      canDownloadReport,
    }),
    [
      effectivePlanId,
      proChoice,
      activeCalc,
      setPlanId,
      pickProChoiceOnce,
      setActiveCalc,
      hydrated,
      canAccessCalculator,
      canDownloadReport,
    ],
  );

  return (
    <EntitlementsCtx.Provider value={value}>
      {children}
    </EntitlementsCtx.Provider>
  );
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsCtx);
  if (!ctx)
    throw new Error("useEntitlements must be used within EntitlementsProvider");
  return ctx;
}

/* ------------------------------------------------------------------------------------------------
   Gate Component
   - Locks on first pick
   - If user clicks the other Pro calc later, silently redirects to the chosen one
   - Shows upgrade card when plan is too low
------------------------------------------------------------------------------------------------ */
export function Gate({
  calc,
  children,
}: {
  calc: CalcId;
  children: React.ReactNode;
}) {
  const {
    planId,
    proChoice,
    hydrated,
    pickProChoiceOnce,
    canAccessCalculator,
  } = useEntitlements();
  const router = useRouter();
  const _pathname = usePathname();

  if (!hydrated) return <div className="p-4 text-center">Loading...</div>;

  const hasAccess = canAccessCalculator(calc);

  if (hasAccess) return <>{children}</>;

  // Special handling for Pro plan choice
  if (
    planId === "pro" &&
    !proChoice &&
    (calc === "employee-cost" || calc === "expense-split-deluxe")
  ) {
    // First time a Pro clicks a Pro calculator: this click becomes their permanent choice.
    const label =
      calc === "employee-cost"
        ? "Make Employee Cost my Pro calculator"
        : "Make Expense Split Deluxe my Pro calculator";

    const displayName =
      calc === "employee-cost" ? "Employee Cost" : "Expense Split Deluxe";

    return (
      <div className="rounded-2xl border p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Choose Your Pro Calculator
        </h3>
        <p className="text-blue-700 mb-4">
          Your Pro plan includes one advanced calculator. Choose{" "}
          <span className="font-semibold">{displayName}</span> as your permanent
          selection. This choice cannot be changed later.
        </p>
        <button
          className="rounded-xl px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
          onClick={() => {
            const choice: Exclude<ProChoice, null> =
              calc === "employee-cost" ? "employee" : "expense_split";
            pickProChoiceOnce(choice);
            // Optionally redirect to refresh the UI
            router.refresh();
          }}
        >
          {label}
        </button>
      </div>
    );
  }

  // Upgrade required
  return (
    <div className="rounded-2xl border p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <h3 className="text-lg font-semibold text-amber-800 mb-2">
        Upgrade Required
      </h3>
      <p className="text-amber-700 mb-4">
        This calculator requires a{" "}
        {calc === "savings" || calc === "debt-payoff"
          ? "Plus"
          : "Pro or Premium"}{" "}
        plan.
      </p>
      <a
        href="/pricing"
        className="inline-flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold transition-colors"
      >
        View Plans & Pricing
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
   Hook for download capability
------------------------------------------------------------------------------------------------ */
export function useDownloadPermission(calculatorKey?: CalcId) {
  const { canDownloadReport, planId } = useEntitlements();

  const canDownload = calculatorKey
    ? canDownloadReport(calculatorKey)
    : planId === "pro" || planId === "premium";

  return { canDownload };
}

