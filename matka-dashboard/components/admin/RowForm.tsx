"use client";
import { useState } from "react";
import type { Row, Section } from "@/lib/types";

type Props = {
  section: Section;
  initial?: Partial<Row>;
  onSaved: (row: Row) => void;
  onCancel: () => void;
};

export function RowForm({ section, initial, onSaved, onCancel }: Props) {
  const isFreeZone = section === "free_zone";
  // Live Result and Live Update are the same kind of "game" row — a game always
  // shows in Live Matka Result, and the checkbox controls whether it also appears
  // in the 📡 Live Update band (which the section value drives).
  const isGame = section === "live_result" || section === "live_update";
  const [title, setTitle] = useState(initial?.title || "");
  const [resultValue, setResultValue] = useState(initial?.resultValue || "");
  const [timeRange, setTimeRange] = useState(initial?.timeRange || "");
  const [leftTag, setLeftTag] = useState(initial?.leftTag || "");
  const [rightTag, setRightTag] = useState(initial?.rightTag || "");
  const [color, setColor] = useState(initial?.color || "#0066cc");
  const [highlight, setHighlight] = useState(Boolean(initial?.highlight));
  const [showInLiveUpdate, setShowInLiveUpdate] = useState((initial?.section ?? section) === "live_update");
  const [dateLabel, setDateLabel] = useState(initial?.dateLabel || "");
  const [extraLines, setExtraLines] = useState<string[]>(initial?.extraLines || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    const effectiveSection = isGame ? (showInLiveUpdate ? "live_update" : "live_result") : section;
    const payload = {
      section: effectiveSection,
      title,
      resultValue,
      timeRange: timeRange || null,
      leftTag: leftTag || null,
      rightTag: rightTag || null,
      color,
      highlight,
      dateLabel: isFreeZone ? dateLabel || null : null,
      extraLines: isFreeZone ? extraLines.filter(Boolean) : null,
    };
    const url = initial?.id ? `/api/admin/rows/${initial.id}` : "/api/admin/rows";
    const method = initial?.id ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    const { row } = await res.json();
    // Editing keeps the form open (the parent re-passes the row), so show a
    // brief confirmation; the server may have auto-corrected the result value.
    if (initial?.id) {
      setResultValue(row.resultValue ?? "");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    onSaved(row);
  }

  return (
    <form onSubmit={save} className="bg-gray-50 border border-gray-300 rounded p-4 my-3 space-y-3">
      {error && <div className="bg-red-100 text-red-800 p-2 rounded text-sm">{error}</div>}
      {saved && <div className="bg-green-100 text-green-800 p-2 rounded text-sm font-semibold">✓ Saved</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Title *</span>
          <input className="w-full border border-gray-300 rounded px-2 py-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Result Value</span>
          <input className="w-full border border-gray-300 rounded px-2 py-1" value={resultValue} onChange={(e) => setResultValue(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Time Range</span>
          <input className="w-full border border-gray-300 rounded px-2 py-1" placeholder="(09:40 - 10:40)" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Color (title)</span>
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 shrink-0 border border-gray-300 rounded" />
            <input className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-sm" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
        </label>
        {!isFreeZone && (
          <>
            <label className="block">
              <span className="text-xs font-semibold text-gray-700">Left Tag</span>
              <input className="w-full border border-gray-300 rounded px-2 py-1" placeholder="Jodi" value={leftTag} onChange={(e) => setLeftTag(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-700">Right Tag</span>
              <input className="w-full border border-gray-300 rounded px-2 py-1" placeholder="Panel" value={rightTag} onChange={(e) => setRightTag(e.target.value)} />
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
              <span className="text-sm">Highlight row ( yellow band )</span>
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={showInLiveUpdate} onChange={(e) => setShowInLiveUpdate(e.target.checked)} />
              <span className="text-sm">Show in 📡 Live Update list (always shows in Live Matka Result)</span>
            </label>
          </>
        )}
        {isFreeZone && (
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-gray-700">Date Label (shows once at top of section if set)</span>
            <input className="w-full border border-gray-300 rounded px-2 py-1" placeholder="Date : 27-06-2026" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} />
          </label>
        )}
      </div>
      {isFreeZone && (
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-1">Extra Lines (one per line)</div>
          {extraLines.map((line, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                className="flex-1 border border-gray-300 rounded px-2 py-1"
                value={line}
                onChange={(e) => setExtraLines(extraLines.map((l, j) => (j === i ? e.target.value : l)))}
              />
              <button type="button" onClick={() => setExtraLines(extraLines.filter((_, j) => j !== i))} className="px-2 bg-red-100 text-red-700 rounded">×</button>
            </div>
          ))}
          <button type="button" onClick={() => setExtraLines([...extraLines, ""])} className="text-sm text-blue-700 underline">+ Add line</button>
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
        <button type="submit" disabled={busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {busy ? "Saving…" : initial?.id ? "Save changes" : "Add row"}
        </button>
      </div>
    </form>
  );
}
