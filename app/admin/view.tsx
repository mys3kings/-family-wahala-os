"use client";

import { useEffect, useState } from "react";
import { Eye, ShieldCheck, RefreshCw } from "lucide-react";

export default function AdminDashboard({ adminKey }: { adminKey: string }) {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/stats?key=${encodeURIComponent(adminKey)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load visit statistics.");
      const data = await response.json();
      setTotal(Number(data.total_visits || 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return <main className="min-h-screen bg-[#0a1410] px-4 py-8 text-[#E8FFF0] sm:px-6">
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10b981]/15 text-[#10b981]"><ShieldCheck size={22}/></div>
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#6b9a85]">Private dashboard</p><h1 className="mt-1 text-2xl font-bold">Family Wahala OS Admin</h1></div>
      </header>
      <section className="rounded-[20px] border border-[#1f3d2b] bg-[#132a1f] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm text-[#8aa89a]"><Eye size={17}/> Total Visits</div><button onClick={() => void load()} disabled={loading} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#315642] px-3 text-sm font-semibold text-[#E8FFF0] disabled:opacity-60"><RefreshCw size={15} className={loading?"animate-spin":""}/>Refresh</button></div>
        <div className="mt-5 text-4xl font-black tracking-tight">{loading ? "…" : total?.toLocaleString("en-NG") ?? "—"}</div>
        <p className="mt-2 text-sm text-[#8aa89a]">Recorded daily device visits since the counter was enabled.</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
      </section>
    </div>
  </main>;
}
