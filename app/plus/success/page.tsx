"use client";
import { useEffect, useState } from "react";

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
    const [ok, setOk] = useState(false);

    useEffect(() => {
        (async () => {
            if (!searchParams.session_id) return;
            const res = await fetch(`/api/confirm?session_id=${encodeURIComponent(searchParams.session_id)}`, { method: "POST" });
            setOk(res.ok);
        })();
    }, [searchParams.session_id]);

    return (
        <main className="max-w-2xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold">You’re all set 🎉</h1>
            <p className="mt-3">Your subscription is active. Premium calculators will now open.</p>
            <div className="mt-6 flex gap-6">
                <a href="/pricing" className="underline">Manage plan</a>
                {ok ? <a href="/" className="underline">Go to calculators</a> : <span>Finalizing…</span>}
            </div>
        </main>
    );
}
