"use client";
import { useState } from "react";
import type { JodiDay, JodiEntry } from "@/lib/schema";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emptyDays(): JodiDay[] {
  return Array.from({ length: 7 }, () => ({ value: "", color: "#000000" }));
}

export function JodiEntryForm({
  rowId,
  initial,
  onSaved,
  onCancel,
}: {
  rowId: string;
  initial?: JodiEntry;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [weekStart, setWeekStart] = useState(initial?.weekStart ?? "");
  const [weekEnd, setWeekEnd] = useState(initial?.weekEnd ?? "");
  const initialDays = initial?.days ?? emptyDays();
  const [days, setDays] = useState<JodiDay[]>(initialDays);
  const [busy, setBusy] = useState(false);

  // Undo/redo history for the day-cell grid: a stack of snapshots plus a pointer into it.
  const [history, setHistory] = useState<JodiDay[][]>([initialDays]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  function update(i: number, k: keyof JodiDay, v: string) {
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
      const url = initial ? `/api/admin/jodi/${initial.id}` : "/api/admin/jodi";
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
      <div className="flex gap-3 mb-4">
        <label className="text-sm">
          Week start
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="block border px-2 py-1 rounded" />
        </label>
        <label className="text-sm">
          Week end
          <input type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className="block border px-2 py-1 rounded" />
        </label>
      </div>
      <table className="text-sm border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-gray-100">Day</th>
            <th className="border px-2 py-1 bg-gray-100">Jodi value</th>
            <th className="border px-2 py-1 bg-gray-100">Color</th>
            <th className="border px-2 py-1 bg-gray-100">Preview</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <tr key={i}>
              <td className="border px-2 py-1 font-bold">{DAY_LABELS[i]}</td>
              <td className="border px-2 py-1">
                <input value={d.value} onChange={(e) => update(i, "value", e.target.value)} className="w-20 border rounded px-1 text-lg font-bold" placeholder="91" maxLength={4} />
              </td>
              <td className="border px-2 py-1">
                <input type="color" value={d.color || "#000000"} onChange={(e) => update(i, "color", e.target.value)} className="w-12 h-8" />
                <button type="button" onClick={() => update(i, "color", "#000000")} className="text-xs font-semibold text-white bg-black rounded px-2 py-1 ml-1">black</button>
                <button type="button" onClick={() => update(i, "color", "#d00000")} className="text-xs font-semibold text-white rounded px-2 py-1 ml-1" style={{ background: "#d00000" }}>red</button>
              </td>
              <td className="border px-2 py-1 text-center bg-white">
                <span className="text-xl font-bold italic" style={{ color: d.color || "#000" }}>{d.value || "--"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-4">
        <button onClick={save} disabled={busy} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
        <button type="button" onClick={undo} disabled={!canUndo} className="border px-4 py-2 rounded disabled:opacity-40">↶ Undo</button>
        <button type="button" onClick={redo} disabled={!canRedo} className="border px-4 py-2 rounded disabled:opacity-40">↷ Redo</button>
      </div>
    </div>
  );
}
