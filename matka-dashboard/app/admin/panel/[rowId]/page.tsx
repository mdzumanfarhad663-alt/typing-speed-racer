"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PanelEntry, Row } from "@/lib/schema";
import { PanelEntryForm } from "@/components/admin/PanelEntryForm";
import { ChartDesignPanel } from "@/components/admin/ChartDesignPanel";
import { chartSectionKey } from "@/lib/sectionConfig";

export default function AdminPanelPage({ params }: { params: { rowId: string } }) {
  const [game, setGame] = useState<Row | null>(null);
  const [entries, setEntries] = useState<PanelEntry[]>([]);
  const [editing, setEditing] = useState<PanelEntry | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [gameRes, entriesRes] = await Promise.all([
      fetch(`/api/public/panel/${params.rowId}`, { cache: "no-store" }),
      fetch(`/api/admin/panel?rowId=${params.rowId}`, { cache: "no-store" }),
    ]);
    const g = await gameRes.json();
    const e = await entriesRes.json();
    setGame(g.game ?? null);
    setEntries(e.entries ?? []);
    setLoading(false);
  }, [params.rowId]);

  useEffect(() => { load(); }, [load]);

  async function del(id: string) {
    if (!confirm("Delete this week?")) return;
    await fetch(`/api/admin/panel/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <main className="p-6">Loading…</main>;
  if (!game) return <main className="p-6">Game not found. <Link href="/admin" className="underline">Back</Link></main>;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href="/admin" className="text-sm underline">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1">Panel chart: <span style={{ color: game.color }}>{game.title}</span></h1>
          <Link href={`/panel/${game.id}`} target="_blank" className="text-sm underline text-blue-600">View public panel page ↗</Link>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="bg-black text-white px-4 py-2 rounded">+ Add week</button>
        )}
      </div>

      <ChartDesignPanel sectionKey={chartSectionKey("panel", params.rowId)} />

      {(adding || editing) && (
        <div className="mb-6">
          <PanelEntryForm
            rowId={params.rowId}
            initial={editing ?? undefined}
            onSaved={() => { setAdding(false); setEditing(null); load(); }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </div>
      )}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Week</th>
            <th className="border p-2 text-left">Days summary</th>
            <th className="border p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && (
            <tr><td colSpan={3} className="border p-6 text-center italic text-gray-500">No weeks yet</td></tr>
          )}
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="border p-2 align-top">{e.weekStart} → {e.weekEnd}</td>
              <td className="border p-2 align-top font-mono text-xs">
                {e.days.map((d, i) => (
                  <span key={i} className="inline-block mr-3">
                    {d.open || "---"}-{d.jodi || "--"}-{d.close || "---"}
                  </span>
                ))}
              </td>
              <td className="border p-2 align-top">
                <button onClick={() => setEditing(e)} className="text-blue-600 underline mr-3">Edit</button>
                <button onClick={() => del(e.id)} className="text-red-600 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
