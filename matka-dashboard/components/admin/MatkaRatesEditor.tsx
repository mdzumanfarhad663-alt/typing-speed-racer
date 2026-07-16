"use client";
import { useEffect, useState } from "react";
import { DEFAULT_MATKA_RATES, MATKA_RATE_GAMES } from "@/lib/matkaRates";

// Dashboard card: edit the rates shown in the homepage Matka Rates Chart.
export function MatkaRatesEditor() {
  const [rates, setRates] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/matka-rates", { cache: "no-store" });
        if (res.ok) setRates((await res.json()).rates);
      } catch { /* leave loading */ }
    })();
  }, []);

  async function save() {
    if (!rates || saving) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/matka-rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rates }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setRates(j.rates);
        setMsg({ ok: true, text: "✓ Saved — home page updates within a few seconds" });
      } else {
        setMsg({ ok: false, text: j.error || "Save failed" });
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 text-center" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
        <h2 className="font-bold text-base text-white">💰 Matka Rates Chart</h2>
        <p className="text-[11px] text-blue-100">Edit the rates shown on the home page</p>
      </div>
      <div className="p-4">
        {rates === null ? (
          <div className="text-gray-500 text-sm py-4 text-center">Loading…</div>
        ) : (
          <div className="space-y-2">
            {MATKA_RATE_GAMES.map((game, i) => (
              <label key={game} className="flex items-center gap-2">
                <span className="flex-1 text-sm font-bold text-blue-800 truncate">{game}</span>
                <input
                  value={rates[i]}
                  onChange={(e) => setRates(rates.map((r, j) => (j === i ? e.target.value : r)))}
                  placeholder={DEFAULT_MATKA_RATES[i]}
                  className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-center font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>
            ))}
            {msg && (
              <div className={`text-xs font-semibold text-center py-1 ${msg.ok ? "text-green-600" : "text-red-600"}`}>
                {msg.text}
              </div>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="w-full mt-1 bg-black text-white font-semibold rounded-lg py-2 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save rates"}
            </button>
            <p className="text-[10px] text-gray-400 text-center">Format: 1:number (e.g. 1:90)</p>
          </div>
        )}
      </div>
    </div>
  );
}
