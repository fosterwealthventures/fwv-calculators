"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  Baby,
  Receipt,
  Plus,
  Trash2,
  Settings2,
  Download,
  Calculator,
  Scale,
  Info,
} from "lucide-react";
import { useDownloadPermission } from "@/hooks/useDownloadPermission";

type Person = {
  id: string;
  name: string;
  weight: number; // general split weight
  tripDays?: number; // optional: used for trip-related expenses
  isParent?: boolean;
};

type Child = {
  id: string;
  name: string;
  custodyDays?: number; // optional metadata, not strictly required by the calc
};

type ExpenseCategory = "general" | "child" | "trip";

type Expense = {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  notes?: string;
};

type Props = {
  initialPeople?: Person[];
  initialChildren?: Child[];
  initialExpenses?: Expense[];
  /**
   * Optional: called when user clicks download without sufficient permission.
   * Use this to open your upgrade modal/flow.
   */
  onUpgrade?: () => void;
};

export default function ExpenseSplitDeluxe({
  initialPeople = [
    { id: "p1", name: "You", weight: 1, tripDays: 5, isParent: true },
    { id: "p2", name: "Co-Parent / Roommate", weight: 1, tripDays: 5, isParent: true },
  ],
  initialChildren = [{ id: "c1", name: "Child", custodyDays: 15 }],
  initialExpenses = [
    { id: "e1", name: "Groceries", amount: 300, category: "general" as const },
    { id: "e2", name: "Child Care", amount: 200, category: "child" as const },
    { id: "e3", name: "Trip Hotel", amount: 480, category: "trip" as const },
  ],
  onUpgrade,
}: Props) {
  // === PERMISSIONS: app-wide gate for Expense Split Deluxe ===
  const { canDownload: hasDownloadPermission = false } = useDownloadPermission("expense-split-deluxe");

  // === STATE ===
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  // Split modes
  const [generalMode, setGeneralMode] = useState<"equal" | "weighted">("weighted");
  const [childMode, setChildMode] = useState<"equalParents" | "weightedParents">("equalParents");
  const [tripMode, setTripMode] = useState<"byDaysWeighted" | "equal">("byDaysWeighted");

  // New rows
  const [newPerson, setNewPerson] = useState({ name: "", weight: "1", tripDays: "0", isParent: false });
  const [newChild, setNewChild] = useState({ name: "", custodyDays: "0" });
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "general" as ExpenseCategory });

  // === HELPERS ===
  const currency = (n: number, min = 2) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: min }).format(n);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  // Normalize safe weights
  const safeWeights = (arr: number[]) => {
    const total = sum(arr);
    if (total <= 0) {
      // If weights are all zero/negative, default to equal distribution
      return arr.map(() => 1 / arr.length);
    }
    return arr.map((v) => v / total);
  };

  // Compute allocations per expense per person
  const allocations = useMemo(() => {
    const result: Record<string, number> = {}; // personId -> total owed
    people.forEach((p) => (result[p.id] = 0));

    const parents = people.filter((p) => p.isParent);
    const nonParents = people.filter((p) => !p.isParent);

    const peopleWeights = people.map((p) => Math.max(0, p.weight));
    const peopleWeightShares = generalMode === "equal" ? people.map(() => 1 / people.length) : safeWeights(peopleWeights);

    // Trip weights (weight * tripDays)
    const tripWeights = people.map((p) => Math.max(0, (p.tripDays ?? 0) * Math.max(0, p.weight)));
    const tripWeightShares = tripMode === "equal" ? people.map(() => 1 / people.length) : safeWeights(tripWeights);

    const parentWeights = parents.map((p) => Math.max(0, p.weight || 0));
    const parentShares =
      childMode === "equalParents"
        ? parents.map(() => (parents.length ? 1 / parents.length : 0))
        : parents.length
        ? safeWeights(parentWeights)
        : [];

    const pushAllocation = (personId: string, amount: number) => {
      result[personId] += amount;
    };

    // walk each expense
    for (const exp of expenses) {
      if (exp.amount <= 0) continue;

      if (exp.category === "general") {
        // Split across everyone by mode
        people.forEach((p, idx) => pushAllocation(p.id, exp.amount * peopleWeightShares[idx]));
      } else if (exp.category === "trip") {
        people.forEach((p, idx) => pushAllocation(p.id, exp.amount * tripWeightShares[idx]));
      } else if (exp.category === "child") {
        if (parents.length === 0) {
          // No parents flagged; fall back to everyone equal.
          const share = exp.amount / people.length;
          people.forEach((p) => pushAllocation(p.id, share));
        } else {
          // Parents only, by chosen mode
          parents.forEach((p, idx) => pushAllocation(p.id, exp.amount * parentShares[idx]));
          // Non-parents receive none of the child-related expense
          nonParents.forEach(() => null);
        }
      }
    }

    return result;
  }, [people, expenses, generalMode, tripMode, childMode]);

  const totals = useMemo(() => {
    const totalsArr = people.map((p) => ({
      person: p,
      owed: allocations[p.id] ?? 0,
    }));
    return {
      byPerson: totalsArr,
      grandTotal: sum(totalsArr.map((t) => t.owed)),
      averagePerPerson: totalsArr.length ? sum(totalsArr.map((t) => t.owed)) / totalsArr.length : 0,
    };
  }, [people, allocations]);

  // === MUTATIONS ===
  const addPerson = () => {
    if (!newPerson.name.trim()) return;
    const id = "p" + Date.now().toString(36);
    setPeople((prev) => [
      ...prev,
      {
        id,
        name: newPerson.name.trim(),
        weight: Number(newPerson.weight) || 0,
        tripDays: Number(newPerson.tripDays) || 0,
        isParent: newPerson.isParent,
      },
    ]);
    setNewPerson({ name: "", weight: "1", tripDays: "0", isParent: false });
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, patch: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addChild = () => {
    if (!newChild.name.trim()) return;
    const id = "c" + Date.now().toString(36);
    setChildren((prev) => [
      ...prev,
      { id, name: newChild.name.trim(), custodyDays: Number(newChild.custodyDays) || 0 },
    ]);
    setNewChild({ name: "", custodyDays: "0" });
  };

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  const addExpense = () => {
    if (!newExpense.name.trim() || newExpense.amount === "") return;
    const id = "e" + Date.now().toString(36);
    setExpenses((prev) => [
      ...prev,
      {
        id,
        name: newExpense.name.trim(),
        amount: Number(newExpense.amount) || 0,
        category: newExpense.category,
      },
    ]);
    setNewExpense({ name: "", amount: "", category: "general" });
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, patch: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  // === DOWNLOAD (GATED) ===
  const handleDownload = () => {
    if (!hasDownloadPermission) {
      // Trigger the upgrade flow if provided; else show an alert fallback
      if (onUpgrade) return onUpgrade();
      alert("Download capability requires Pro or Premium plan for this calculator");
      return;
    }

    // Build CSV
    const header = ["Person", "Owed"];
    const rows = totals.byPerson.map((t) => [t.person.name, t.owed.toFixed(2)]);
    const body = [header, ...rows, ["Grand Total", totals.grandTotal.toFixed(2)]];

    const csv = body.map((r) => r.map((s) => `"${String(s).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `expense-split-deluxe-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Calculator className="h-7 w-7 md:h-8 md:w-8" />
              Expense Split Deluxe
            </h1>
            <p className="text-emerald-100 mt-2">
              Fairly divide household, child-related, and trip costs—supporting equal or weighted rules.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              hasDownloadPermission
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-200"
            }`}
            disabled={!hasDownloadPermission}
            title={hasDownloadPermission ? "Download Report" : "Upgrade to download reports"}
          >
            <Download className="h-4 w-4" />
            {hasDownloadPermission ? "Download Report (CSV)" : "Upgrade to Download"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Controls */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* People */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-emerald-800">People</h3>
            </div>

            <div className="space-y-3">
              {people.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white border rounded-lg p-3">
                  <input
                    className="flex-1 rounded border px-2 py-1"
                    value={p.name}
                    onChange={(e) => updatePerson(p.id, { name: e.target.value })}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <label className="whitespace-nowrap">Weight</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-20 rounded border px-2 py-1"
                      value={p.weight}
                      onChange={(e) => updatePerson(p.id, { weight: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <label className="whitespace-nowrap">Trip Days</label>
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1"
                      value={p.tripDays ?? 0}
                      onChange={(e) => updatePerson(p.id, { tripDays: Number(e.target.value) })}
                    />
                  </div>
                  <label className="flex items-center gap-1 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={!!p.isParent}
                      onChange={(e) => updatePerson(p.id, { isParent: e.target.checked })}
                    />
                    Parent
                  </label>
                  <button
                    className="ml-auto text-red-600 hover:text-red-700"
                    onClick={() => removePerson(p.id)}
                    title="Remove person"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Name"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson((s) => ({ ...s, name: e.target.value }))}
                />
                <input
                  className="w-24 rounded border px-3 py-2"
                  placeholder="Weight"
                  type="number"
                  step="0.1"
                  value={newPerson.weight}
                  onChange={(e) => setNewPerson((s) => ({ ...s, weight: e.target.value }))}
                />
                <input
                  className="w-28 rounded border px-3 py-2"
                  placeholder="Trip Days"
                  type="number"
                  value={newPerson.tripDays}
                  onChange={(e) => setNewPerson((s) => ({ ...s, tripDays: e.target.value }))}
                />
                <label className="flex items-center gap-2 bg-white border rounded-lg px-3">
                  <input
                    type="checkbox"
                    checked={newPerson.isParent}
                    onChange={(e) => setNewPerson((s) => ({ ...s, isParent: e.target.checked }))}
                  />
                  <span className="text-sm">Parent</span>
                </label>
                <button
                  onClick={addPerson}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3"
                  title="Add person"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Children */}
          <section className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="h-5 w-5 text-cyan-700" />
              <h3 className="font-semibold text-cyan-800">Children (for child-related costs)</h3>
            </div>

            <div className="space-y-3">
              {children.map((c) => (
                <div key={c.id} className="flex items-center gap-2 bg-white border rounded-lg p-3">
                  <input
                    className="flex-1 rounded border px-2 py-1"
                    value={c.name}
                    onChange={(e) =>
                      setChildren((prev) => prev.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))
                    }
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <label>Custody Days</label>
                    <input
                      type="number"
                      className="w-24 rounded border px-2 py-1"
                      value={c.custodyDays ?? 0}
                      onChange={(e) =>
                        setChildren((prev) =>
                          prev.map((x) => (x.id === c.id ? { ...x, custodyDays: Number(e.target.value) } : x)),
                        )
                      }
                    />
                  </div>
                  <button
                    className="ml-auto text-red-600 hover:text-red-700"
                    onClick={() => removeChild(c.id)}
                    title="Remove child"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Name"
                  value={newChild.name}
                  onChange={(e) => setNewChild((s) => ({ ...s, name: e.target.value }))}
                />
                <input
                  className="w-36 rounded border px-3 py-2"
                  placeholder="Custody Days"
                  type="number"
                  value={newChild.custodyDays}
                  onChange={(e) => setNewChild((s) => ({ ...s, custodyDays: e.target.value }))}
                />
                <button
                  onClick={addChild}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-3"
                  title="Add child"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-cyan-700 flex items-start gap-2 mt-1">
                <Info className="h-4 w-4 mt-0.5" />
                Child metadata is optional. Child expenses split between people marked as parents, either equally or by
                parent weights (toggle below).
              </p>
            </div>
          </section>

          {/* Expenses */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-5 w-5 text-amber-700" />
              <h3 className="font-semibold text-amber-800">Expenses</h3>
            </div>

            <div className="space-y-3">
              {expenses.map((e) => (
                <div key={e.id} className="bg-white border rounded-lg p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-8 gap-2 items-center">
                    <input
                      className="sm:col-span-3 rounded border px-2 py-1"
                      value={e.name}
                      onChange={(ev) => updateExpense(e.id, { name: ev.target.value })}
                    />
                    <input
                      type="number"
                      className="sm:col-span-2 rounded border px-2 py-1"
                      value={e.amount}
                      onChange={(ev) => updateExpense(e.id, { amount: Number(ev.target.value) })}
                    />
                    <select
                      className="sm:col-span-2 rounded border px-2 py-1 bg-white"
                      value={e.category}
                      onChange={(ev) => updateExpense(e.id, { category: ev.target.value as ExpenseCategory })}
                    >
                      <option value="general">General</option>
                      <option value="child">Child-Related</option>
                      <option value="trip">Trip</option>
                    </select>
                    <button
                      className="sm:col-span-1 justify-self-end text-red-600 hover:text-red-700"
                      onClick={() => removeExpense(e.id)}
                      title="Remove expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    className="mt-2 w-full rounded border px-2 py-1 text-sm"
                    placeholder="Notes (optional)"
                    value={e.notes ?? ""}
                    onChange={(ev) => updateExpense(e.id, { notes: ev.target.value })}
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-8 gap-2 items-center pt-2">
                <input
                  className="sm:col-span-3 rounded border px-3 py-2"
                  placeholder="Expense name"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense((s) => ({ ...s, name: e.target.value }))}
                />
                <input
                  className="sm:col-span-2 rounded border px-3 py-2"
                  placeholder="Amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((s) => ({ ...s, amount: e.target.value }))}
                />
                <select
                  className="sm:col-span-2 rounded border px-3 py-2 bg-white"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense((s) => ({ ...s, category: e.target.value as ExpenseCategory }))}
                >
                  <option value="general">General</option>
                  <option value="child">Child-Related</option>
                  <option value="trip">Trip</option>
                </select>
                <button
                  onClick={addExpense}
                  className="sm:col-span-1 justify-self-end bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3"
                  title="Add expense"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Settings */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-800">Split Settings</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Scale className="h-4 w-4" />
                General Expenses
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="generalMode"
                    checked={generalMode === "equal"}
                    onChange={() => setGeneralMode("equal")}
                  />
                  Equal
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="generalMode"
                    checked={generalMode === "weighted"}
                    onChange={() => setGeneralMode("weighted")}
                  />
                  Weighted (by Person Weight)
                </label>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Scale className="h-4 w-4" />
                Child-Related Expenses
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="childMode"
                    checked={childMode === "equalParents"}
                    onChange={() => setChildMode("equalParents")}
                  />
                  Equal (Parents Only)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="childMode"
                    checked={childMode === "weightedParents"}
                    onChange={() => setChildMode("weightedParents")}
                  />
                  Weighted (by Parent Weight)
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only people marked as <span className="font-medium">Parent</span> share child expenses.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Scale className="h-4 w-4" />
                Trip Expenses
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tripMode"
                    checked={tripMode === "byDaysWeighted"}
                    onChange={() => setTripMode("byDaysWeighted")}
                  />
                  Weighted (Weight × Trip Days)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tripMode"
                    checked={tripMode === "equal"}
                    onChange={() => setTripMode("equal")}
                  />
                  Equal
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <h3 className="font-semibold text-teal-800 mb-3">Totals</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg p-3">
                <div className="text-sm text-gray-500">Grand Total</div>
                <div className="text-2xl font-bold text-gray-800">{currency(totals.grandTotal)}</div>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <div className="text-sm text-gray-500">Average / Person</div>
                <div className="text-2xl font-bold text-gray-800">{currency(totals.averagePerPerson)}</div>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <div className="text-sm text-gray-500">People</div>
                <div className="text-2xl font-bold text-gray-800">{people.length}</div>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <div className="text-sm text-gray-500">Expenses</div>
                <div className="text-2xl font-bold text-gray-800">{expenses.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 font-medium text-gray-700">What Each Person Owes</div>
            <div className="divide-y">
              {totals.byPerson.map(({ person, owed }) => (
                <div key={person.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{person.name}</span>
                    {person.isParent && (
                      <span className="text-xs rounded bg-teal-100 text-teal-700 px-2 py-0.5">Parent</span>
                    )}
                  </div>
                  <div className="text-lg font-semibold">{currency(owed)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}