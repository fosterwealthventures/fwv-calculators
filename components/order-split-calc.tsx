/** Order Split Calculator component (client) */
"use client";
import { Calculator, Edit, Plus, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type Person = {
    id: string;
    name: string;
};

type Item = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    assignedTo: string[]; // Array of person IDs
};

export default function OrderSplitCalculator() {
    const [people, setPeople] = useLocalStorage<Person[]>("order-split.people", [
        { id: "1", name: "Person 1" },
        { id: "2", name: "Person 2" }
    ]);

    const [items, setItems] = useLocalStorage<Item[]>("order-split.items", []);

    const [taxRate, setTaxRate] = useLocalStorage<string>("order-split.tax", "8.5");
    const [tipRate, setTipRate] = useLocalStorage<string>("order-split.tip", "15");

    const [newPerson, setNewPerson] = useState("");
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        quantity: "1"
    });

    const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
    const [editingPersonName, setEditingPersonName] = useState("");

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState({
        name: "",
        price: "",
        quantity: "1"
    });

    const parsedTaxRate = useMemo(() => parseFloat(taxRate) || 0, [taxRate]);
    const parsedTipRate = useMemo(() => parseFloat(tipRate) || 0, [tipRate]);

    const { subtotal, taxAmount, tipAmount, total, personTotals } = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxAmount = subtotal * (parsedTaxRate / 100);
        const tipAmount = subtotal * (parsedTipRate / 100);
        const total = subtotal + taxAmount + tipAmount;

        // Calculate each person's share
        const personShares: Record<string, number> = {};

        // Initialize with 0 for each person
        people.forEach(person => {
            personShares[person.id] = 0;
        });

        // Calculate each person's share of items
        items.forEach(item => {
            if (item.assignedTo.length > 0) {
                const itemSharePerPerson = (item.price * item.quantity) / item.assignedTo.length;
                item.assignedTo.forEach(personId => {
                    if (personShares[personId] !== undefined) {
                        personShares[personId] += itemSharePerPerson;
                    }
                });
            }
        });

        // Add tax and tip shares
        const totalItemsShare = Object.values(personShares).reduce((sum, share) => sum + share, 0);
        if (totalItemsShare > 0) {
            people.forEach(person => {
                const personShareRatio = personShares[person.id] / totalItemsShare;
                personShares[person.id] += (taxAmount + tipAmount) * personShareRatio;
            });
        }

        return {
            subtotal,
            taxAmount,
            tipAmount,
            total,
            personTotals: personShares
        };
    }, [items, people, parsedTaxRate, parsedTipRate]);

    const addPerson = () => {
        if (!newPerson.trim()) return;

        const person: Person = {
            id: Date.now().toString(),
            name: newPerson.trim()
        };

        setPeople([...people, person]);
        setNewPerson("");
    };

    const startEditPerson = (person: Person) => {
        setEditingPersonId(person.id);
        setEditingPersonName(person.name);
    };

    const saveEditPerson = () => {
        if (!editingPersonId || !editingPersonName.trim()) return;

        setPeople(people.map(person =>
            person.id === editingPersonId
                ? { ...person, name: editingPersonName.trim() }
                : person
        ));

        // Also update any items assigned to this person
        setItems(items.map(item => ({
            ...item,
            assignedTo: item.assignedTo.map(id =>
                id === editingPersonId ? editingPersonId : id
            )
        })));

        cancelEditPerson();
    };

    const cancelEditPerson = () => {
        setEditingPersonId(null);
        setEditingPersonName("");
    };

    const deletePerson = (id: string) => {
        // Remove person
        setPeople(people.filter(person => person.id !== id));

        // Remove person from item assignments
        setItems(items.map(item => ({
            ...item,
            assignedTo: item.assignedTo.filter(personId => personId !== id)
        })));
    };

    const addItem = () => {
        if (!newItem.name.trim() ||
            isNaN(parseFloat(newItem.price)) || parseFloat(newItem.price) <= 0 ||
            isNaN(parseInt(newItem.quantity)) || parseInt(newItem.quantity) <= 0) {
            return;
        }

        const item: Item = {
            id: Date.now().toString(),
            name: newItem.name.trim(),
            price: parseFloat(newItem.price),
            quantity: parseInt(newItem.quantity),
            assignedTo: [] // Initially unassigned
        };

        setItems([...items, item]);

        // Reset form
        setNewItem({
            name: "",
            price: "",
            quantity: "1"
        });
    };

    const startEditItem = (item: Item) => {
        setEditingItemId(item.id);
        setEditingItem({
            name: item.name,
            price: item.price.toString(),
            quantity: item.quantity.toString()
        });
    };

    const saveEditItem = () => {
        if (!editingItemId ||
            !editingItem.name.trim() ||
            isNaN(parseFloat(editingItem.price)) || parseFloat(editingItem.price) <= 0 ||
            isNaN(parseInt(editingItem.quantity)) || parseInt(editingItem.quantity) <= 0) {
            return;
        }

        setItems(items.map(item =>
            item.id === editingItemId
                ? {
                    ...item,
                    name: editingItem.name.trim(),
                    price: parseFloat(editingItem.price),
                    quantity: parseInt(editingItem.quantity)
                }
                : item
        ));

        cancelEditItem();
    };

    const cancelEditItem = () => {
        setEditingItemId(null);
        setEditingItem({
            name: "",
            price: "",
            quantity: "1"
        });
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const toggleItemAssignment = (itemId: string, personId: string) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                const isAssigned = item.assignedTo.includes(personId);
                return {
                    ...item,
                    assignedTo: isAssigned
                        ? item.assignedTo.filter(id => id !== personId)
                        : [...item.assignedTo, personId]
                };
            }
            return item;
        }));
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <h1 className="text-2xl font-semibold">Order Split Calculator</h1>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {/* People Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">People</h2>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPerson}
                                onChange={(e) => setNewPerson(e.target.value)}
                                className="flex-1 rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="Add person"
                                onKeyDown={(e) => e.key === "Enter" && addPerson()}
                            />
                            <button
                                onClick={addPerson}
                                className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {people.map((person) => (
                                <div key={person.id} className="flex items-center justify-between rounded-lg border p-2 dark:border-neutral-800">
                                    {editingPersonId === person.id ? (
                                        <input
                                            type="text"
                                            value={editingPersonName}
                                            onChange={(e) => setEditingPersonName(e.target.value)}
                                            className="flex-1 rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            <span>{person.name}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-1">
                                        {editingPersonId === person.id ? (
                                            <>
                                                <button
                                                    onClick={saveEditPerson}
                                                    className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditPerson}
                                                    className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditPerson(person)}
                                                    className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                {people.length > 2 && (
                                                    <button
                                                        onClick={() => deletePerson(person.id)}
                                                        className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Items Section */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Items</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="col-span-2 rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="Item name"
                                onKeyDown={(e) => e.key === "Enter" && addItem()}
                            />
                            <input
                                type="number"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                className="rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="Price"
                                onKeyDown={(e) => e.key === "Enter" && addItem()}
                            />
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                className="w-20 rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="Qty"
                                onKeyDown={(e) => e.key === "Enter" && addItem()}
                            />
                            <button
                                onClick={addItem}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            >
                                <Plus className="h-4 w-4" /> Add Item
                            </button>
                        </div>

                        {items.length > 0 && (
                            <div className="max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="mb-2 rounded-lg border p-2 dark:border-neutral-800">
                                        {editingItemId === item.id ? (
                                            <div className="mb-2 grid grid-cols-3 gap-2">
                                                <input
                                                    type="text"
                                                    value={editingItem.name}
                                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                                    className="col-span-2 rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                                                    autoFocus
                                                />
                                                <input
                                                    type="number"
                                                    value={editingItem.price}
                                                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                                                    className="rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-2 flex justify-between">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                        {item.quantity} × {currency.format(item.price)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => startEditItem(item)}
                                                        className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-sm">
                                            <span className="text-neutral-600 dark:text-neutral-400">Assigned to:</span>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {people.map((person) => (
                                                    <button
                                                        key={person.id}
                                                        onClick={() => toggleItemAssignment(item.id, person.id)}
                                                        className={`rounded-full px-2 py-1 text-xs ${item.assignedTo.includes(person.id)
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                            : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                                                            }`}
                                                    >
                                                        {person.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {editingItemId === item.id && (
                                            <div className="mt-2 flex justify-end gap-2">
                                                <button
                                                    onClick={saveEditItem}
                                                    className="rounded px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditItem}
                                                    className="rounded px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Tax & Tip Section */}
            <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Tax & Tip</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                            Tax Rate (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="8.5"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">%</span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-300">
                            Tip Rate (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={tipRate}
                                onChange={(e) => setTipRate(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                                placeholder="15"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary Section */}
            {items.length > 0 && (
                <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-200">Summary</h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</p>
                            <p className="font-medium">{currency.format(subtotal)}</p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Tax ({parsedTaxRate}%)</p>
                            <p className="font-medium">{currency.format(taxAmount)}</p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Tip ({parsedTipRate}%)</p>
                            <p className="font-medium">{currency.format(tipAmount)}</p>
                        </div>

                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                            <p className="text-sm text-emerald-800 dark:text-emerald-300">Total</p>
                            <p className="font-medium text-emerald-800 dark:text-emerald-300">{currency.format(total)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 font-medium text-neutral-700 dark:text-neutral-200">Each Person Owes:</h3>
                        <div className="space-y-2">
                            {people.map((person) => (
                                <div key={person.id} className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
                                    <span>{person.name}</span>
                                    <span className="font-medium">{currency.format(personTotals[person.id] || 0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
