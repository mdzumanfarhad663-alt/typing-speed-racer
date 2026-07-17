"use client";
import { useEffect, useState } from "react";
import type { MatkaRateRow } from "@/lib/matkaRates";

// Home Page Design editor: edit, add and delete the rows shown in the
// homepage Matka Rates Chart.
export function MatkaRatesEditor() {
  const [rows, setRows] = useState<MatkaRateRow[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/matka-rates", { cache: "no-store" });
        if (res.ok) setRows((await res.json()).rows);
      } catch { /* leave loading */ }
    })();
  }, []);

  function update(i: number, patch: Partial<MatkaRateRow>) {
    setRows((rs) => rs!.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  async function save() {
    if (!rows || saving) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/matka-rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setRows(j.rows);
        setMsg({ ok: true, text: "✓ Saved — home page updates within a few seconds" });
      } else {
        setMsg({ ok: false, text: j.error || "Save failed" });
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  if (rows === null) return <div className="text-gray-500 text-sm py-4 text-center">Loading…</div>;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-[11px] font-bold text-gray-500 uppercase px-1">
        <span className="flex-1">Game name</span>
        <span className="w-24 text-center">Rate</span>
        <span className="w-8" />
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={r.game}
            onChange={(e) => update(i, { game: e.target.value })}
            placeholder="Game name"
            className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 font-bold text-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            value={r.rate}
            onChange={(e) => update(i, { rate: e.target.value })}
            placeholder="1:90"
            className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-center font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="button"
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
            disabled={rows.length === 1}
            title="Delete row"
            className="w-8 h-8 shrink-0 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white font-bold"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows([...rows, { game: "", rate: "1:" }])}
        className="w-full border-2 border-dashed border-indigo-300 text-indigo-700 font-semibold rounded-lg py-1.5 hover:bg-indigo-50"
      >
        + Add new row
      </button>
      {msg && (
        <div className={`text-xs font-semibold text-center py-1 ${msg.ok ? "text-green-600" : "text-red-600"}`}>
          {msg.text}
        </div>
      )}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-black text-white font-semibold rounded-lg py-2 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save rates"}
      </button>
      <p className="text-[10px] text-gray-400 text-center">Rate format: 1:number (e.g. 1:90)</p>
    </div>
  );
}
