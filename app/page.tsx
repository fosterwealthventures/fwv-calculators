export default function Home() {
  return (
    <div className="space-y-8">
      <p className="text-lg text-neutral-700">
        Professional Business & Financial Calculator Suites
      </p>

      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition">
          Business Calculator Suite
        </button>
        <button className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition">
          Financial Calculator Suite
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">ROI Calculator</h2>
        <p className="mt-2 text-neutral-600">
          Calculate business costs and returns to make informed decisions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700">Initial Investment</span>
            <input
              type="number"
              className="h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              defaultValue={10000}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700">Final Value</span>
            <input
              type="number"
              className="h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              defaultValue={15000}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700">Time Horizon (years)</span>
            <input
              type="number"
              className="h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              defaultValue={2}
            />
          </label>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-4 text-center text-neutral-500">
          Ad Placeholder (In-Content)
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Results</h3>
          <ul className="mt-2 text-neutral-700 list-disc ml-6">
            <li>Total ROI 50.00%</li>
            <li>Annualized ROI 22.47%</li>
          </ul>
        </div>
      </div>

      <aside className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-neutral-500">
        Ad Placeholder (Sidebar)
      </aside>
    </div>
  );
}
