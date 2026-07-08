"use client";
import { useEffect, useState } from "react";
import type { Row } from "@/lib/types";

// Dashboard panel: one checkbox per manual game to toggle whether it appears in
// the 📡 Live Update band. Every game always shows in Live Matka Result.
export function LiveUpdateToggles() {
  const [games, setGames] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/rows", { cache: "no-store" });
    if (res.ok) {
      const { rows } = await res.json();
      setGames(
        (rows as Row[]).filter(
          (r) => r.source !== "scraped" && (r.section === "live_result" || r.section === "live_update")
        )
      );
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(row: Row, checked: boolean) {
    setSavingId(row.id);
    const nextSection = checked ? "live_update" : "live_result";
    const res = await fetch(`/api/admin/rows/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: nextSection }),
    });
    if (res.ok) {
      setGames((gs) => gs.map((g) => (g.id === row.id ? { ...g, section: nextSection } : g)));
    }
    setSavingId(null);
  }

  async function saveResult(row: Row, value: string) {
    if (value === (row.resultValue ?? "")) return;
    setSavingId(row.id);
    const res = await fetch(`/api/admin/rows/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultValue: value }),
    });
    if (res.ok) {
      setGames((gs) => gs.map((g) => (g.id === row.id ? { ...g, resultValue: value } : g)));
    }
    setSavingId(null);
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg mb-1 text-center">📡 Show in Live Update</h2>
      <p className="text-xs text-gray-500 mb-4 text-center">
        Tick a game to show it in the Live Update list. Every game always shows in Live Matka Result.
      </p>
      {loading ? (
        <div className="text-gray-500 text-sm py-2 text-center">Loading…</div>
      ) : games.length === 0 ? (
        <div className="text-gray-500 text-sm italic py-2 text-center">No manual games yet.</div>
      ) : (
        <ul className="space-y-2.5">
          {games.map((g) => (
            <li key={g.id} className="flex flex-col items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0"
                  checked={g.section === "live_update"}
                  disabled={savingId === g.id}
                  onChange={(e) => toggle(g, e.target.checked)}
                />
                <span className="text-sm font-bold" style={{ color: g.color }}>{g.title}</span>
              </label>
              <input
                type="text"
                defaultValue={g.resultValue ?? ""}
                placeholder="000-00-000"
                disabled={savingId === g.id}
                className="w-40 border border-gray-300 rounded px-2 py-1 text-sm text-center font-bold tracking-wide"
                onBlur={(e) => saveResult(g, e.target.value.trim())}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
              />
              {savingId === g.id && <span className="text-[11px] text-gray-400">saving…</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
