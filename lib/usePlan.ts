// lib/usePlan.ts
"use client";

import { type Plan, rank } from "@/lib/planConfig";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function usePlan() {
  const { data: session, status } = useSession();

  const plan = useMemo(() => {
    // If session is loading, return "free" as default
    if (status === "loading") return "free" as Plan;

    // If user is authenticated and has a plan in session, use that
    if (session?.user?.plan) {
      // Convert from database format (FREE, PLUS, etc.) to lowercase
      const dbPlan = session.user.plan.toLowerCase();
      if (["free", "plus", "pro", "premium"].includes(dbPlan)) {
        return dbPlan as Plan;
      }
    }

    // Otherwise, check local storage for backward compatibility
    if (typeof window !== "undefined") {
      try {
        const lsPlan = localStorage.getItem("fwv-plan");
        if (lsPlan && ["free", "plus", "pro", "premium"].includes(lsPlan)) {
          return lsPlan as Plan;
        }
      } catch {
        // Ignore errors accessing localStorage
      }
    }

    // Default to "free"
    return "free" as Plan;
  }, [session, status]);

  const proChoice = useMemo(() => {
    // If session is loading, return undefined
    if (status === "loading") return undefined;

    // If user is authenticated and has a proChoice in session, use that
    if (session?.user?.proChoice) {
      // Convert from database format (EMPLOYEE, EXPENSE_SPLIT_DELUXE) to lowercase
      const dbProChoice = session.user.proChoice.toLowerCase();
      if (dbProChoice === "employee") {
        return "employee";
      } else if (dbProChoice === "expense_split_deluxe") {
        return "expense-split-deluxe";
      }
    }

    // Otherwise, return undefined
    return undefined;
  }, [session, status]);

  const helpers = useMemo(() => {
    const gte = (min: Plan) => rank[plan] >= rank[min];
    return { gte };
  }, [plan]);

  return {
    plan,
    proChoice,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    ...helpers
  };
}
