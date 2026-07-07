"use client";
import { useState } from "react";
import type { PanelDay, PanelEntry } from "@/lib/schema";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emptyDays(): PanelDay[] {
  return Array.from({ length: 7 }, () => ({ open: "", jodi: "", close: "", color: "#000000" }));
}

export function PanelEntryForm({
  rowId,
  initial,
  onSaved,
  onCancel,
}: {
  rowId: string;
  initial?: PanelEntry;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [weekStart, setWeekStart] = useState(initial?.weekStart ?? "");
  const [weekEnd, setWeekEnd] = useState(initial?.weekEnd ?? "");
  const initialDays =
    initial?.days?.map((d) => ({ open: d.open, jodi: d.jodi, close: d.close, color: d.color || "#000000" })) ?? emptyDays();
  const [days, setDays] = useState<PanelDay[]>(initialDays);
  const [busy, setBusy] = useState(false);

  // Undo/redo history for the day-cell grid: a stack of snapshots plus a pointer into it.
  const [history, setHistory] = useState<PanelDay[][]>([initialDays]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  function update(i: number, k: keyof PanelDay, v: string) {
    setDays((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [k]: v };
      setHistory((h) => [...h.slice(0, historyIndex + 1), copy]);
      setHistoryIndex((idx) => idx + 1);
      return copy;
    });
  }

  function undo() {
    if (!canUndo) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setDays(history[idx]);
  }

  function redo() {
    if (!canRedo) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setDays(history[idx]);
  }

  async function save() {
    if (!weekStart || !weekEnd) {
      alert("Set week start and end dates");
      return;
    }
    setBusy(true);
    try {
      const url = initial ? `/api/admin/panel/${initial.id}` : "/api/admin/panel";
      const method = initial ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId, weekStart, weekEnd, days }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Save failed");
        return;
      }
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <h3 className="font-bold mb-3">{initial ? "Edit week" : "Add week"}</h3>
      <div className="flex gap-3 mb-4 flex-wrap">
        <label className="text-sm">
          Week start
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="block border px-2 py-1 rounded" />
        </label>
        <label className="text-sm">
          Week end
          <input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className="block border px-2 py-1 rounded" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100">Day</th>
              <th className="border px-2 py-1 bg-gray-100">Open Pana</th>
              <th className="border px-2 py-1 bg-gray-100">Jodi</th>
              <th className="border px-2 py-1 bg-gray-100">Close Pana</th>
              <th className="border px-2 py-1 bg-gray-100">Jodi color</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 font-bold">{DAY_LABELS[i]}</td>
                <td className="border px-2 py-1"><input value={d.open} onChange={(e) => update(i, "open", e.target.value)} className="w-20 border rounded px-1" placeholder="128" maxLength={6} /></td>
                <td className="border px-2 py-1">
                  <input value={d.jodi} onChange={(e) => update(i, "jodi", e.target.value)} className="w-16 border rounded px-1 font-bold" placeholder="91" maxLength={4} style={{ color: d.color || "#000" }} />
                </td>
                <td className="border px-2 py-1"><input value={d.close} onChange={(e) => update(i, "close", e.target.value)} className="w-20 border rounded px-1" placeholder="690" maxLength={6} /></td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  <input type="color" value={d.color || "#000000"} onChange={(e) => update(i, "color", e.target.value)} className="w-10 h-7 align-middle" />
                  <button type="button" onClick={() => update(i, "color", "#000000")} className="text-xs font-semibold text-white bg-black rounded px-2 py-1 ml-1">black</button>
                  <button type="button" onClick={() => update(i, "color", "#d00000")} className="text-xs font-semibold text-white rounded px-2 py-1 ml-1" style={{ background: "#d00000" }}>red</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={save} disabled={busy} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
        <button type="button" onClick={undo} disabled={!canUndo} className="border px-4 py-2 rounded disabled:opacity-40">↶ Undo</button>
        <button type="button" onClick={redo} disabled={!canRedo} className="border px-4 py-2 rounded disabled:opacity-40">↷ Redo</button>
      </div>
    </div>
  );
}
