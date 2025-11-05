/** Shopping Budget Calculator component (client) */
"use client";
import { Check, Edit3, PlusCircle, ShoppingCart, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type LineItem = { id: number; name: string; price: number; quantity: number };
const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

export default function ShoppingBudget() {
    const [budget, setBudget] = useLocalStorage<string>("shop.budget", "150.00");
    const [taxRate, setTaxRate] = useLocalStorage<string>("shop.tax", "8.5");
    const [items, setItems] = useLocalStorage<LineItem[]>("shop.items", []);
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [qty, setQty] = useState<string>("1");
    // Weight-based pricing states
    const [weightName, setWeightName] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [pricePerPound, setPricePerPound] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>("");
    const [editQty, setEditQty] = useState<string>("");

    const parsedBudget = useMemo(() => parseFloat(budget) || 0, [budget]);
    const parsedTax = useMemo(() => parseFloat(taxRate) || 0, [taxRate]);
    const subtotal = useMemo(() => items.reduce((s: number, it: LineItem) => s + (it.price || 0) * (it.quantity || 0), 0), [items]);
    const taxAmount = useMemo(() => subtotal * (parsedTax > 0 ? parsedTax : 0) / 100, [subtotal, parsedTax]);
    const totalSpent = subtotal + taxAmount;
    const remaining = parsedBudget - totalSpent;
    const percentUsed = parsedBudget > 0 ? Math.min(100, (totalSpent / parsedBudget) * 100) : 0;

    function addItem() {
        const p = parseFloat(price); const q = parseInt(qty, 10);
        if (!name.trim() || isNaN(p) || p < 0 || isNaN(q) || q <= 0) return;
        setItems((prev: LineItem[]) => [...prev, { id: Date.now(), name: name.trim(), price: p, quantity: q }]);
        setName(""); setPrice(""); setQty("1");
    }

    function addWeightItem() {
        const w = parseFloat(weight); const ppp = parseFloat(pricePerPound);
        if (!weightName.trim() || isNaN(w) || w <= 0 || isNaN(ppp) || ppp < 0) return;
        const totalPrice = w * ppp;
        setItems((prev: LineItem[]) => [...prev, {
            id: Date.now(),
            name: `${weightName.trim()} (${w} lbs @ ${currency.format(ppp)}/lb)`,
            price: totalPrice,
            quantity: 1
        }]);
        setWeightName(""); setWeight(""); setPricePerPound("");
    }
    function startEdit(id: number) {
        const it = items.find((i: LineItem) => i.id === id);
        if (!it) return;
        setEditingId(id);
        setEditPrice(String(it.price));
        setEditQty(String(it.quantity));
    }
    function cancelEdit() { setEditingId(null); setEditPrice(""); setEditQty(""); }
    function saveEdit(id: number) {
        const p = parseFloat(editPrice); const q = parseInt(editQty, 10);
        if (isNaN(p) || p < 0 || isNaN(q) || q <= 0) return;
        setItems((prev: LineItem[]) => prev.map((it: LineItem) => (it.id === id ? { ...it, price: p, quantity: q } : it)));
        cancelEdit();
    }
    function removeItem(id: number) {
        setItems((prev: LineItem[]) => prev.filter((it: LineItem) => it.id !== id));
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <header className="mb-6 flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <h1 className="text-2xl font-semibold">Shopping Budget Calculator</h1>
            </header>

            <section className="mb-6 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block">
                        <span className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">Budget</span>
                        <input type="number" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" placeholder="150.00" />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">Tax (%)</span>
                        <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" placeholder="8.5" />
                    </label>
                    <div className="self-end">
                        <button onClick={() => setItems([])} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" aria-label="Clear all items">
                            <Trash2 className="h-4 w-4" /> Clear All
                        </button>
                    </div>
                </div>
            </section>

            <section className="mb-6 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" onKeyDown={(e) => e.key === "Enter" && addItem()} aria-label="Item name" />
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" onKeyDown={(e) => e.key === "Enter" && addItem()} aria-label="Item price" />
                    <input type="number" step="1" min="1" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Qty" className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" onKeyDown={(e) => e.key === "Enter" && addItem()} aria-label="Item quantity" />
                    <button onClick={addItem} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600" aria-label="Add item">
                        <PlusCircle className="h-4 w-4" /> Add
                    </button>
                </div>
            </section>

            <section className="mb-6 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-3 text-lg font-medium text-neutral-700 dark:text-neutral-200">Price by Weight</h3>
                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">For items sold by the pound (produce, meat, deli, etc.)</p>
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                    <input
                        value={weightName}
                        onChange={(e) => setWeightName(e.target.value)}
                        placeholder="Item name (e.g., Apples)"
                        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                        onKeyDown={(e) => e.key === "Enter" && addWeightItem()}
                        aria-label="Weight item name"
                    />
                    <input
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight (lbs)"
                        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                        onKeyDown={(e) => e.key === "Enter" && addWeightItem()}
                        aria-label="Weight in pounds"
                    />
                    <input
                        type="number"
                        step="0.01"
                        value={pricePerPound}
                        onChange={(e) => setPricePerPound(e.target.value)}
                        placeholder="$/lb"
                        className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                        onKeyDown={(e) => e.key === "Enter" && addWeightItem()}
                        aria-label="Price per pound"
                    />
                    <button
                        onClick={addWeightItem}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                        aria-label="Add weight-based item"
                    >
                        <PlusCircle className="h-4 w-4" /> Add by Weight
                    </button>
                </div>
                {weight && pricePerPound && (
                    <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        Total: {currency.format(parseFloat(weight || "0") * parseFloat(pricePerPound || "0"))}
                    </div>
                )}
            </section>

            <section className="mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Item</th>
                            <th className="px-4 py-3 text-right font-medium">Price</th>
                            <th className="px-4 py-3 text-right font-medium">Qty</th>
                            <th className="px-4 py-3 text-right font-medium">Total</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400" colSpan={5}>No items yet. Add your first above.</td></tr>
                        ) : items.map((it: LineItem) => {
                            const isEditing = it.id === editingId;
                            return (
                                <tr key={it.id} className="border-t dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                                    <td className="px-4 py-3">{it.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        {isEditing ? (
                                            <input autoFocus type="number" step="0.01" className="w-24 rounded border px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-950" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(it.id)} />
                                        ) : (
                                            <button className="inline-flex items-center gap-1 underline-offset-2 hover:underline" onClick={() => startEdit(it.id)} aria-label={`Edit price for ${it.name}`}>
                                                {currency.format(it.price)} <Edit3 className="h-3.5 w-3.5 opacity-70" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {isEditing ? (
                                            <input type="number" step="1" min="1" className="w-16 rounded border px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-950" value={editQty} onChange={(e) => setEditQty(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(it.id)} />
                                        ) : (
                                            <button className="inline-flex items-center gap-1 underline-offset-2 hover:underline" onClick={() => startEdit(it.id)} aria-label={`Edit quantity for ${it.name}`}>
                                                {it.quantity} <Edit3 className="h-3.5 w-3.5 opacity-70" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">{currency.format(it.price * it.quantity)}</td>
                                    <td className="px-2 py-3 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => saveEdit(it.id)} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" aria-label="Save"><Check className="h-4 w-4" /></button>
                                                <button onClick={cancelEdit} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" aria-label="Cancel"><X className="h-4 w-4" /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => removeItem(it.id)} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" aria-label={`Remove ${it.name}`}><Trash2 className="h-4 w-4" /></button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <div className={`h-2 rounded-full ${percentUsed < 90 ? "bg-emerald-600" : (remaining >= 0 ? "bg-amber-500" : "bg-rose-600")}`} style={{ width: `${percentUsed}%` }} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div><dt className="text-neutral-500 dark:text-neutral-400">Subtotal</dt><dd className="font-medium">{currency.format(subtotal)}</dd></div>
                    <div><dt className="text-neutral-500 dark:text-neutral-400">Tax</dt><dd className="font-medium">{currency.format(taxAmount)}</dd></div>
                    <div><dt className="text-neutral-500 dark:text-neutral-400">Total</dt><dd className="font-semibold">{currency.format(totalSpent)}</dd></div>
                    <div><dt className="text-neutral-500 dark:text-neutral-400">Remaining</dt><dd className={`font-semibold ${remaining < 0 ? "text-rose-600 dark:text-rose-400" : remaining < parsedBudget * 0.1 ? "text-amber-600 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>{currency.format(remaining)}</dd></div>
                </dl>
            </section>
        </div>
    );
}
