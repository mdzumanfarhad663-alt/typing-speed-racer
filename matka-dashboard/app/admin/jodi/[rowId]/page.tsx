"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { JodiEntry, Row } from "@/lib/schema";
import { JodiEntryForm } from "@/components/admin/JodiEntryForm";
import { ChartDesignPanel } from "@/components/admin/ChartDesignPanel";
import { CsvImportButton } from "@/components/admin/CsvImportButton";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { chartSectionKey } from "@/lib/sectionConfig";
import { useChartHistory } from "@/lib/useChartHistory";
import { jodiColor } from "@/lib/redJodi";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function fmtDate(s: string) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

export default function AdminJodiPage({ params }: { params: { rowId: string } }) {
  const [game, setGame] = useState<Row | null>(null);
  const [entries, setEntries] = useState<JodiEntry[]>([]);
  const [editing, setEditing] = useState<JodiEntry | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [gameRes, entriesRes] = await Promise.all([
      fetch(`/api/public/jodi/${params.rowId}`, { cache: "no-store" }),
      fetch(`/api/admin/jodi?rowId=${params.rowId}`, { cache: "no-store" }),
    ]);
    const g = await gameRes.json();
    const e = await entriesRes.json();
    setGame(g.game ?? null);
    setEntries(e.entries ?? []);
    setLoading(false);
  }, [params.rowId]);

  useEffect(() => { load(); }, [load]);

  const restore = useCallback(async (snapshot: JodiEntry[]) => {
    await fetch("/api/admin/jodi", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowId: params.rowId, entries: snapshot }),
    });
    await load();
  }, [params.rowId, load]);

  const history = useChartHistory<JodiEntry>(restore);

  async function del(id: string) {
    if (!confirm("Delete this week?")) return;
    const res = await fetch(`/api/admin/jodi/${id}`, { method: "DELETE" });
    if (res.ok) history.remember(entries);
    load();
  }

  function startEditing(e: JodiEntry) {
    setEditing(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteAll() {
    const password = prompt("Delete ALL weeks of this chart?\nEnter admin password to confirm:");
    if (!password) return;
    const res = await fetch("/api/admin/jodi", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowId: params.rowId, password }),
    });
    if (res.ok) {
      history.remember(entries);
      alert("All weeks deleted. You can undo this with the Undo button.");
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error === "wrong_password" ? "Wrong password — nothing was deleted." : "Delete failed.");
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;
  if (!game) return <main className="p-6">Game not found. <Link href="/admin" className="underline">Back</Link></main>;

  return (
    <main className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <Link href="/admin" className="text-sm underline">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1">Jodi chart: <span style={{ color: game.color }}>{game.title}</span></h1>
          <Link href={`/jodi/${game.id}`} target="_blank" className="text-sm underline text-blue-600">View public jodi page ↗</Link>
        </div>
        {!adding && !editing && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => history.undo(entries)} disabled={!history.canUndo} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold">↶ Undo</button>
            <button onClick={() => history.redo(entries)} disabled={!history.canRedo} className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold">↷ Redo</button>
            <button onClick={deleteAll} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold">All Delete</button>
            <button onClick={() => setAdding(true)} className="bg-black text-white px-4 py-2 rounded">+ Add week</button>
          </div>
        )}
      </div>

      <ChartDesignPanel sectionKey={chartSectionKey("jodi", params.rowId)} />

      <div className="bg-white border border-gray-200 rounded p-4 mb-6 space-y-4">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Import weeks from CSV</div>
          <p className="text-xs text-gray-500 mb-2">
            Columns: Week Ending Date,MON,TUE,WED,THU,FRI,SAT,SUN — week as "DD/MM/YYYY to DD/MM/YYYY", each day as a 2-digit value (e.g. 91), or "Holiday/No data" / blank for no result.
          </p>
          <CsvImportButton rowId={params.rowId} kind="jodi" onDone={() => { history.remember(entries); load(); }} />
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Export weeks to CSV</div>
          <p className="text-xs text-gray-500 mb-2">
            Downloads all {entries.length} week{entries.length === 1 ? "" : "s"} of this chart in the same format used for import.
          </p>
          <CsvExportButton entries={entries} kind="jodi" fileName={`${game.title.toLowerCase().replace(/\s+/g, "-")}-jodi-chart.csv`} />
        </div>
      </div>

      {(adding || editing) && (
        <div className="mb-6">
          <JodiEntryForm
            rowId={params.rowId}
            initial={editing ?? undefined}
            onSaved={() => { history.remember(entries); setAdding(false); setEditing(null); load(); }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="bg-white p-1" style={{ border: "4px solid #893bff" }}>
        <table className="w-full table-fixed border-collapse bg-white text-sm">
          <thead>
            <tr>
              <th className="p-0.5 sm:p-1 text-[9px] sm:text-base italic font-bold" style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif" }}>Date</th>
              {DAY_LABELS.map((label) => (
                <th key={label} className="p-0.5 sm:p-1 text-[9px] sm:text-base italic font-bold" style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif" }}>{label}</th>
              ))}
              <th className="p-0.5 sm:p-1 text-[9px] sm:text-base italic font-bold" style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr><td colSpan={9} className="border p-6 text-center italic text-gray-500">No weeks yet</td></tr>
            )}
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="p-0.5 sm:p-1.5 bg-white text-black font-bold text-[7px] sm:text-[11px] text-center" style={{ border: "1px solid #ddd" }}>
                  <div>{fmtDate(e.weekStart)}</div>
                  <div>To</div>
                  <div>{fmtDate(e.weekEnd)}</div>
                </td>
                {e.days.map((d, i) => (
                  <td key={i} className="bg-white text-center align-middle p-0.5 sm:p-1.5" style={{ border: "1px solid #ddd" }}>
                    <span className="text-[11px] sm:text-lg font-bold italic" style={{ color: jodiColor(d.value, d.color || "#000"), fontFamily: "Georgia, serif" }}>
                      {d.value || "--"}
                    </span>
                  </td>
                ))}
                <td className="p-0.5 sm:p-1.5 align-middle text-center" style={{ border: "1px solid #ddd" }}>
                  <div className="flex flex-col sm:flex-row gap-1 items-center">
                    <button onClick={() => startEditing(e)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 py-1 rounded text-[8px] sm:text-xs whitespace-nowrap">Edit</button>
                    <button onClick={() => del(e.id)} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-2 py-1 rounded text-[8px] sm:text-xs whitespace-nowrap">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
