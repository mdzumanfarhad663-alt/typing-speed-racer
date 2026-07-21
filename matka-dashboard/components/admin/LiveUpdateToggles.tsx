"use client";
import { useEffect, useState } from "react";
import type { Row } from "@/lib/types";
import { LoadingResult } from "@/components/public/LoadingResult";
import { normalizeResult } from "@/lib/pannaFix";

// Admin-only display: show the value with spaces around the dashes
// (e.g. "568 - 97 - 340"). The stored value / result box stays "568-97-340".
const spaced = (v: string) => v.split("-").map((s) => s.trim()).filter(Boolean).join(" - ");
const unspaced = (v: string) => v.replace(/\s+/g, "");

// Dashboard panel: one checkbox per manual game to toggle whether it appears in
// the 📡 Live Update band. Every game always shows in Live Matka Result.
export function LiveUpdateToggles() {
  const [games, setGames] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    const res = await fetch("/api/admin/rows", { cache: "no-store" });
    if (res.ok) {
      const { rows } = await res.json();
      setGames(
        (rows as Row[]).filter(
          (r) => r.source !== "scraped" && (r.section === "live_result" || r.section === "live_update")
        )
      );
    }
    if (!silent) setLoading(false);
  }

  useEffect(() => {
    load();
    // Poll (silently) so a scheduled auto-switch (see liveUpdateTime) shows
    // up here without needing a manual refresh.
    const t = setInterval(() => load(true), 20_000);
    return () => clearInterval(t);
  }, []);

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

  async function toggleLoading(row: Row, checked: boolean) {
    setSavingId(row.id);
    const res = await fetch(`/api/admin/rows/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultLoading: checked }),
    });
    if (res.ok) {
      setGames((gs) => gs.map((g) => (g.id === row.id ? { ...g, resultLoading: checked } : g)));
    }
    setSavingId(null);
  }

  async function toggleHighlight(row: Row, checked: boolean) {
    setSavingId(row.id);
    const res = await fetch(`/api/admin/rows/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlight: checked }),
    });
    if (res.ok) {
      setGames((gs) => gs.map((g) => (g.id === row.id ? { ...g, highlight: checked } : g)));
    }
    setSavingId(null);
  }

  async function saveSchedule(row: Row, value: string) {
    setSavingId(row.id);
    const res = await fetch(`/api/admin/rows/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liveUpdateTime: value || null }),
    });
    if (res.ok) {
      const { row: updated } = await res.json();
      setGames((gs) => gs.map((g) => (g.id === row.id ? { ...g, liveUpdateTime: updated.liveUpdateTime, section: updated.section, position: updated.position } : g)));
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

  function ScheduleRow({ game, busy, onSave }: { game: Row; busy: boolean; onSave: (v: string) => void }) {
    const [value, setValue] = useState(game.liveUpdateTime ?? "");
    return (
      <label className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-gray-600 shrink-0">⏰ Auto-on time (IST)</span>
        <input
          type="time"
          value={value}
          disabled={busy}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => onSave(e.target.value)}
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(""); onSave(""); }}
            className="text-gray-400 hover:text-red-600 font-bold"
            title="Clear schedule"
          >
            ✕
          </button>
        )}
      </label>
    );
  }

  function Switch({ on, busy, onToggle }: { on: boolean; busy: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        disabled={busy}
        role="switch"
        aria-checked={on}
        className={`relative w-12 h-7 rounded-full shrink-0 transition-colors duration-200 disabled:opacity-60 ${
          on ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200 ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 text-center" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
        <h2 className="font-bold text-base text-white">📡 Show in Live Update</h2>
        <p className="text-[11px] text-blue-100">
          Turn a game on to show it in the Live Update list. Every game always shows in Live Matka Result.
        </p>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="text-gray-500 text-sm py-4 text-center">Loading…</div>
        ) : games.length === 0 ? (
          <div className="text-gray-500 text-sm italic py-4 text-center">No manual games yet.</div>
        ) : (
          <ul className="space-y-3">
            {games.map((g) => {
              const on = g.section === "live_update";
              const busy = savingId === g.id;
              return (
                <li
                  key={g.id}
                  className={`rounded-xl border p-3 space-y-2.5 transition-colors ${
                    on ? "border-green-200 bg-green-50/60" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold truncate" style={{ color: g.color }}>{g.title}</div>
                      <div className={`text-[11px] font-medium ${on ? "text-green-600" : "text-gray-400"}`}>
                        {busy ? "Saving…" : on ? "Showing in Live Update" : "Only in Live Matka Result"}
                      </div>
                    </div>
                    <Switch on={on} busy={busy} onToggle={() => toggle(g, !on)} />
                  </div>
                  <ScheduleRow game={g} busy={busy} onSave={(v) => saveSchedule(g, v)} />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 accent-blue-600"
                        checked={g.resultLoading}
                        disabled={busy}
                        onChange={(e) => toggleLoading(g, e.target.checked)}
                      />
                      <LoadingResult />
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 accent-amber-500"
                        checked={g.highlight}
                        disabled={busy}
                        onChange={(e) => toggleHighlight(g, e.target.checked)}
                      />
                      <span className="text-xs font-semibold text-amber-700">Highlight (yellow band)</span>
                    </label>
                  </div>
                  {/* The dashboard always shows the editable real value, even when
                      Loading is on — only the public result cell shows the animation. */}
                  <input
                    type="text"
                    defaultValue={spaced(g.resultValue ?? "")}
                    placeholder="000 - 00 - 000"
                    disabled={busy}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-lg text-center font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    onBlur={(e) => {
                      // Panna auto-correction (matches the server): 321-00-871 → 123-66-178
                      const raw = normalizeResult(unspaced(e.target.value));
                      e.target.value = spaced(raw);
                      saveResult(g, raw);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
