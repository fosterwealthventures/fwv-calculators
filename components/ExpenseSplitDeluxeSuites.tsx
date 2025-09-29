"use client"

import React, { useState, useMemo } from 'react';

// Types
type Person = {
  id: string;
  name: string;
  weight: number;
  tripDays?: number;
  isParent?: boolean;
};

type Expense = {
  id: string;
  label: string;
  amount: number;
  currency: string;
  category: string;
  payerId: string;
  method: 'even' | 'weight' | 'usage' | 'agreement' | 'custody';
  participants: { personId: string; usage?: number }[];
  childId?: string;
  reimbursable?: boolean;
  dueDate?: string;
  receiptUrl?: string;
  preDiscount?: number;
  postDiscount?: number;
  date?: string;
  notes?: string;
};

type Mode = 'standard' | 'travel' | 'family';

const DEFAULT_CATEGORY_GROUPS = {
  Housing: ['Rent'],
  Utilities: ['Utilities', 'Internet'],
  Household: ['Groceries', 'Misc'],
  Travel: ['Lodging', 'Transport', 'Activities', 'Food', 'Fees'],
  Family: ['Medical', 'Dental', 'Vision', 'School', 'Extracurricular', 'Childcare', 'Clothing'],
};

// CSV Download function
function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => 
    r.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`)
     .join(",")
  ).join("\n");
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Settlement logic
function settle(balances: Record<string, number>) {
  const debtors: { id: string; amt: number }[] = [];
  const creditors: { id: string; amt: number }[] = [];
  
  for (const [id, v] of Object.entries(balances)) {
    const r = Math.round(v * 100) / 100;
    if (r < -0.005) debtors.push({ id, amt: -r });
    if (r > 0.005) creditors.push({ id, amt: r });
  }
  
  debtors.sort((a, b) => b.amt - a.amt);
  creditors.sort((a, b) => b.amt - a.amt);

  const transfers: { from: string; to: string; amount: number }[] = [];
  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    transfers.push({ 
      from: debtors[i].id, 
      to: creditors[j].id, 
      amount: Math.round(pay * 100) / 100 
    });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt < 0.005) i++;
    if (creditors[j].amt < 0.005) j++;
  }
  return transfers;
}

// Scripture Banner Component
function ScriptureBanner({ mode }: { mode: Mode }) {
  const verses: Record<Mode, { ref: string; text: string }> = {
    standard: {
      ref: "Proverbs 21:5",
      text: "The plans of the diligent lead surely to abundance…",
    },
    family: {
      ref: "Proverbs 22:6", 
      text: "Train up a child in the way he should go; even when he is old he will not depart from it.",
    },
    travel: {
      ref: "Psalm 121:8",
      text: "The Lord will watch over your coming and going both now and forevermore.",
    },
  };
  const v = verses[mode];
  return (
    <div className="mb-4 rounded-xl border bg-blue-50 p-3">
      <div className="text-xs font-semibold text-blue-600">{v.ref}</div>
      <blockquote className="mt-1 text-sm text-gray-700 italic">"{v.text}"</blockquote>
    </div>
  );
}

export default function ExpenseSplitDeluxeSuites() {
  // State
  const [mode, setMode] = useState<Mode>('family');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [roundTo, setRoundTo] = useState<0.01 | 0.05 | 1>(0.01);
  const [categoryGroups, setCategoryGroups] = useState(DEFAULT_CATEGORY_GROUPS);
  
  const [people, setPeople] = useState<Person[]>([
    { id: 'p1', name: 'Parent A', weight: 1, tripDays: 5, isParent: true },
    { id: 'p2', name: 'Parent B', weight: 1, tripDays: 5, isParent: true },
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 'e1',
      label: 'School supplies',
      amount: 120,
      currency: 'USD',
      category: 'School',
      payerId: 'p1',
      method: 'agreement',
      participants: [{ personId: 'p1' }, { personId: 'p2' }],
      reimbursable: true,
      dueDate: '2025-10-15',
    },
    {
      id: 'e2',
      label: 'Groceries',
      amount: 85.50,
      currency: 'USD', 
      category: 'Groceries',
      payerId: 'p2',
      method: 'even',
      participants: [{ personId: 'p1' }, { personId: 'p2' }],
    }
  ]);

  const [agreementSplit, setAgreementSplit] = useState<Record<string, number>>({
    p1: 60,
    p2: 40,
  });

  const [fxRates, setFxRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 1.08,
    GBP: 1.27,
    JPY: 0.0065,
  });

  const [perDiemRate, setPerDiemRate] = useState(0);

  // Helpers
  const currencyList = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const parents = people.filter(p => p.isParent);
  
  const toBase = (amount: number, currency: string) => {
    const rate = fxRates[currency] ?? 1;
    return rate * amount;
  };

  // Core calculation logic
  const result = useMemo(() => {
    const perPersonTotal: Record<string, number> = {};
    const paidBy: Record<string, number> = {};
    people.forEach((p) => { 
      perPersonTotal[p.id] = 0; 
      paidBy[p.id] = 0; 
    });

    for (const e of expenses) {
      if (!e.amount || e.amount <= 0) continue;
      
      const participants = e.participants.filter((pp) => 
        people.some((p) => p.id === pp.personId)
      );
      const ids = participants.map((pp) => pp.personId);
      if (ids.length === 0) continue;

      const base = toBase(e.amount, e.currency);
      let shares: Record<string, number> = {};

      if (e.method === 'even') {
        const share = base / ids.length;
        ids.forEach((id) => (shares[id] = share));
      } else if (e.method === 'weight') {
        const weights = ids.map((id) => people.find((p) => p.id === id)?.weight || 1);
        const sumW = weights.reduce((a, b) => a + b, 0) || 1;
        ids.forEach((id, idx) => (shares[id] = base * (weights[idx] / sumW)));
      } else if (e.method === 'usage') {
        const sumU = participants.reduce((a, b) => a + (b.usage || 0), 0) || 1;
        participants.forEach((pp) => (shares[pp.personId] = base * ((pp.usage || 0) / sumU)));
      } else if (e.method === 'agreement' && mode === 'family') {
        const parentsHere = ids.filter((id) => parents.some(p => p.id === id));
        const sumPct = parentsHere.reduce((a, id) => a + (agreementSplit[id] ?? 0), 0) || 100;
        parentsHere.forEach((id) => (shares[id] = base * ((agreementSplit[id] ?? 0) / sumPct)));
      } else {
        const share = base / ids.length;
        ids.forEach((id) => (shares[id] = share));
      }

      for (const id of Object.keys(shares)) {
        perPersonTotal[id] += shares[id];
      }
      if (e.payerId) {
        paidBy[e.payerId] += base;
      }
    }

    // Travel per-diem
    if (mode === 'travel' && perDiemRate > 0) {
      for (const p of people) {
        perPersonTotal[p.id] += perDiemRate * Math.max(0, p.tripDays ?? 0);
      }
    }

    const balances: Record<string, number> = {};
    for (const p of people) {
      const due = perPersonTotal[p.id];
      const paid = paidBy[p.id];
      balances[p.id] = Math.round((paid - due) * 100) / 100;
    }

    const transfers = settle(balances);

    const round = (v: number) => {
      const m = 1 / roundTo;
      return Math.round(v * m) / m;
    };
    
    const roundedTotals: Record<string, number> = {};
    for (const p of people) {
      roundedTotals[p.id] = round(perPersonTotal[p.id]);
    }

    return { perPersonTotal: roundedTotals, balances, transfers };
  }, [people, expenses, agreementSplit, mode, perDiemRate, roundTo, fxRates, baseCurrency]);

  // Add functions
  const addCustomCategory = () => {
    const groupName = prompt('Which group should this category belong to? (Housing, Utilities, Household, Travel, Family)') || 'Misc';
    const categoryName = prompt('New category name?');
    if (!categoryName) return;
    
    setCategoryGroups(prev => {
      const newGroups = { ...prev };
      if (!newGroups[groupName]) {
        newGroups[groupName] = [];
      }
      if (!newGroups[groupName].includes(categoryName)) {
        newGroups[groupName] = [...newGroups[groupName], categoryName];
      }
      return newGroups;
    });
  };

  const addPerson = () => {
    const name = prompt('Name?');
    if (!name) return;
    const id = 'p' + (people.length + 1);
    const isParent = mode === 'family' ? confirm('Is this person a Parent/Guardian?') : false;
    const tripDays = mode === 'travel' ? Number(prompt('Trip days? (e.g., 5)') || '5') : undefined;
    
    const newPerson: Person = { id, name, weight: 1, tripDays, isParent };
    setPeople([...people, newPerson]);
    
    // Add to all expenses
    setExpenses(expenses.map(e => ({
      ...e,
      participants: [...e.participants, { personId: id }]
    })));
    
    if (isParent) {
      setAgreementSplit({ ...agreementSplit, [id]: 0 });
    }
  };

  const addExpense = () => {
    const label = prompt('Expense label?');
    if (!label) return;
    const amount = Number(prompt('Amount?') || '0');
    if (!amount) return;
    
    const id = 'e' + (expenses.length + 1);
    const newExpense: Expense = {
      id,
      label,
      amount,
      currency: baseCurrency,
      category: mode === 'family' ? 'Childcare' : (mode === 'travel' ? 'Activities' : 'Misc'),
      payerId: people[0]?.id || '',
      method: mode === 'family' ? 'agreement' : 'even',
      participants: (mode === 'family' ? parents : people).map(p => ({ personId: p.id })),
      reimbursable: mode === 'family',
    };
    
    setExpenses([...expenses, newExpense]);
  };

  // Download report function
  const downloadReport = () => {
    const rows: string[][] = [];
    const today = new Date().toLocaleDateString();
    
    // Header
    rows.push([`Expense Split Report - ${today}`]);
    rows.push([`Mode: ${mode.toUpperCase()}`, `Base Currency: ${baseCurrency}`]);
    rows.push([]);

    // People section
    rows.push(['PEOPLE']);
    rows.push(['Name', 'Parent', 'Weight', 'Trip Days']);
    people.forEach(p => {
      rows.push([
        p.name,
        p.isParent ? 'Yes' : 'No',
        String(p.weight),
        String(p.tripDays ?? '')
      ]);
    });
    rows.push([]);

    // Agreement split (family mode)
    if (mode === 'family') {
      rows.push(['AGREEMENT SPLIT (Parents)']);
      rows.push(['Parent', 'Percentage']);
      parents.forEach(p => {
        rows.push([p.name, `${agreementSplit[p.id] ?? 0}%`]);
      });
      rows.push([]);
    }

    // Travel settings
    if (mode === 'travel' && perDiemRate > 0) {
      rows.push(['TRAVEL SETTINGS']);
      rows.push(['Per-diem Rate', `${baseCurrency} ${perDiemRate.toFixed(2)}`]);
      rows.push([]);
    }

    // Expenses section
    rows.push(['EXPENSES']);
    rows.push([
      'Description', 'Amount', 'Currency', 'Category', 'Paid By', 
      'Split Method', 'Participants', 'Reimbursable', 'Due Date'
    ]);
    
    expenses.forEach(e => {
      const payer = people.find(p => p.id === e.payerId)?.name || 'Unknown';
      const participantNames = e.participants
        .map(p => people.find(person => person.id === p.personId)?.name)
        .filter(Boolean)
        .join('; ');
      
      rows.push([
        e.label,
        String(e.amount),
        e.currency,
        e.category,
        payer,
        e.method,
        participantNames,
        e.reimbursable ? 'Yes' : 'No',
        e.dueDate || ''
      ]);
    });
    rows.push([]);

    // Calculations section
    rows.push(['CALCULATIONS']);
    rows.push(['Person', `Total Owed (${baseCurrency})`, `Amount Paid (${baseCurrency})`, `Balance (${baseCurrency})`]);
    
    people.forEach(p => {
      const totalOwed = result.perPersonTotal[p.id] || 0;
      const totalPaid = expenses
        .filter(e => e.payerId === p.id)
        .reduce((sum, e) => sum + toBase(e.amount, e.currency), 0);
      const balance = result.balances[p.id] || 0;
      
      rows.push([
        p.name,
        totalOwed.toFixed(2),
        totalPaid.toFixed(2),
        balance.toFixed(2)
      ]);
    });
    rows.push([]);

    // Settlement section
    rows.push(['SETTLEMENT']);
    if (result.transfers.length === 0) {
      rows.push(['Status', 'All settled up!']);
    } else {
      rows.push(['From', 'To', `Amount (${baseCurrency})`]);
      result.transfers.forEach(t => {
        const fromName = people.find(p => p.id === t.from)?.name || 'Unknown';
        const toName = people.find(p => p.id === t.to)?.name || 'Unknown';
        rows.push([fromName, toName, t.amount.toFixed(2)]);
      });
    }
    rows.push([]);

    // Summary
    const totalExpenses = expenses.reduce((sum, e) => sum + toBase(e.amount, e.currency), 0);
    rows.push(['SUMMARY']);
    rows.push(['Total Expenses', `${baseCurrency} ${totalExpenses.toFixed(2)}`]);
    rows.push(['Number of People', String(people.length)]);
    rows.push(['Number of Expenses', String(expenses.length)]);
    rows.push(['Report Generated', today]);

    // Generate filename
    const filename = `expense-split-${mode}-${new Date().toISOString().slice(0, 10)}.csv`;
    
    downloadCSV(filename, rows);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <ScriptureBanner mode={mode} />
      
      {/* Header Controls */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-blue-600">Expense Split Calculator</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium">Mode:</label>
            <select 
              className="rounded-md border px-3 py-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="family">Family</option>
              <option value="standard">Standard</option>
              <option value="travel">Travel</option>
            </select>
            
            <label className="text-sm font-medium">Base Currency:</label>
            <select 
              className="rounded-md border px-3 py-1"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {currencyList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            
            <button 
              onClick={addPerson}
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
            >
              + Person
            </button>
            
            <button 
              onClick={addCustomCategory}
              className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600"
            >
              + Category
            </button>
            
            <button 
              onClick={addExpense}
              className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
            >
              + Expense
            </button>
          </div>
        </div>
      </div>

      {/* Family Mode: Agreement Split */}
      {mode === 'family' && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Agreement Split (Parents)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parents.map(p => (
              <label key={p.id} className="flex items-center gap-2">
                <span className="min-w-20">{p.name}:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-20 px-2 py-1 border rounded-md"
                  value={agreementSplit[p.id] || 0}
                  onChange={(e) => setAgreementSplit({
                    ...agreementSplit,
                    [p.id]: Number(e.target.value) || 0
                  })}
                />
                <span>%</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Travel Mode: Per-diem */}
      {mode === 'travel' && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Travel Settings</h3>
          <label className="flex items-center gap-2">
            <span>Per-diem rate ({baseCurrency}):</span>
            <input
              type="number"
              step="0.01"
              className="w-24 px-2 py-1 border rounded-md"
              value={perDiemRate}
              onChange={(e) => setPerDiemRate(Number(e.target.value) || 0)}
            />
          </label>
        </div>
      )}

      {/* People Table */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-3">People</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Parent?</th>
                <th className="text-left py-2">Weight</th>
                {mode === 'travel' && <th className="text-left py-2">Trip Days</th>}
              </tr>
            </thead>
            <tbody>
              {people.map((person, idx) => (
                <tr key={person.id} className="border-b">
                  <td className="py-2">
                    <input
                      className="px-2 py-1 border rounded-md"
                      value={person.name}
                      onChange={(e) => {
                        const updated = [...people];
                        updated[idx].name = e.target.value;
                        setPeople(updated);
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={!!person.isParent}
                      onChange={(e) => {
                        const updated = [...people];
                        updated[idx].isParent = e.target.checked;
                        setPeople(updated);
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      className="w-20 px-2 py-1 border rounded-md"
                      value={person.weight}
                      onChange={(e) => {
                        const updated = [...people];
                        updated[idx].weight = Number(e.target.value) || 1;
                        setPeople(updated);
                      }}
                    />
                  </td>
                  {mode === 'travel' && (
                    <td className="py-2">
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 border rounded-md"
                        value={person.tripDays || 0}
                        onChange={(e) => {
                          const updated = [...people];
                          updated[idx].tripDays = Number(e.target.value) || 0;
                          setPeople(updated);
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-3">Expenses</h3>
        <div className="space-y-4">
          {expenses.map((expense, idx) => (
            <div key={expense.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
                <input
                  placeholder="Description"
                  className="px-2 py-1 border rounded-md"
                  value={expense.label}
                  onChange={(e) => {
                    const updated = [...expenses];
                    updated[idx].label = e.target.value;
                    setExpenses(updated);
                  }}
                />
                
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    className="w-24 px-2 py-1 border rounded-md"
                    value={expense.amount}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[idx].amount = Number(e.target.value) || 0;
                      setExpenses(updated);
                    }}
                  />
                  <select
                    className="px-2 py-1 border rounded-md"
                    value={expense.currency}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[idx].currency = e.target.value;
                      setExpenses(updated);
                    }}
                  >
                    {currencyList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <select
                    className="px-2 py-1 border rounded-md"
                    value={expense.category}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[idx].category = e.target.value;
                      setExpenses(updated);
                    }}
                  >
                    {Object.entries(categoryGroups).map(([group, categories]) => (
                      <optgroup key={group} label={group}>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button
                    onClick={addCustomCategory}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                    title="Add new category"
                  >
                    +
                  </button>
                </div>

                <select
                  className="px-2 py-1 border rounded-md"
                  value={expense.payerId}
                  onChange={(e) => {
                    const updated = [...expenses];
                    updated[idx].payerId = e.target.value;
                    setExpenses(updated);
                  }}
                >
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <select
                  className="px-2 py-1 border rounded-md"
                  value={expense.method}
                  onChange={(e) => {
                    const updated = [...expenses];
                    updated[idx].method = e.target.value as any;
                    setExpenses(updated);
                  }}
                >
                  <option value="even">Even Split</option>
                  <option value="weight">By Weight</option>
                  <option value="usage">By Usage</option>
                  {mode === 'family' && <option value="agreement">By Agreement %</option>}
                  {mode === 'family' && <option value="custody">By Custody Days</option>}
                </select>
              </div>

              {mode === 'family' && (
                <div className="mt-2 flex gap-3 items-center text-sm">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!expense.reimbursable}
                      onChange={(e) => {
                        const updated = [...expenses];
                        updated[idx].reimbursable = e.target.checked;
                        setExpenses(updated);
                      }}
                    />
                    Reimbursable
                  </label>
                  <input
                    type="date"
                    className="px-2 py-1 border rounded-md text-xs"
                    value={expense.dueDate || ''}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[idx].dueDate = e.target.value;
                      setExpenses(updated);
                    }}
                  />
                </div>
              )}

              {/* Participants Selection */}
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-600 mb-1">Participants:</div>
                <div className="flex flex-wrap gap-2">
                  {people.map(person => {
                    const isParticipant = expense.participants.some(p => p.personId === person.id);
                    const participant = expense.participants.find(p => p.personId === person.id);
                    
                    return (
                      <label key={person.id} className="flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={isParticipant}
                          onChange={(e) => {
                            const updated = [...expenses];
                            if (e.target.checked) {
                              updated[idx].participants.push({ 
                                personId: person.id, 
                                usage: expense.method === 'usage' ? 1 : undefined 
                              });
                            } else {
                              updated[idx].participants = updated[idx].participants.filter(
                                p => p.personId !== person.id
                              );
                            }
                            setExpenses(updated);
                          }}
                        />
                        <span>{person.name}</span>
                        {expense.method === 'usage' && isParticipant && (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-12 px-1 py-0.5 border rounded text-xs ml-1"
                            value={participant?.usage || 0}
                            onChange={(e) => {
                              const updated = [...expenses];
                              const partIdx = updated[idx].participants.findIndex(p => p.personId === person.id);
                              if (partIdx >= 0) {
                                updated[idx].participants[partIdx].usage = Number(e.target.value) || 0;
                                setExpenses(updated);
                              }
                            }}
                            title="Usage amount (e.g., 0.5 = 50%)"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-person totals */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            Per-person Totals ({baseCurrency})
          </h3>
          <div className="space-y-2">
            {Object.entries(result.perPersonTotal).map(([id, amount]) => {
              const person = people.find(p => p.id === id);
              return (
                <div key={id} className="flex justify-between items-center">
                  <span>{person?.name || id}</span>
                  <span className="font-mono">{baseCurrency} {amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settlement */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            Settlement ({baseCurrency})
          </h3>
          {result.transfers.length === 0 ? (
            <p className="text-gray-600">All settled up!</p>
          ) : (
            <div className="space-y-2">
              {result.transfers.map((transfer, idx) => {
                const fromPerson = people.find(p => p.id === transfer.from);
                const toPerson = people.find(p => p.id === transfer.to);
                return (
                  <div key={idx} className="flex justify-between items-center">
                    <span>
                      {fromPerson?.name} → {toPerson?.name}
                    </span>
                    <span className="font-mono font-semibold text-red-600">
                      {baseCurrency} {transfer.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}