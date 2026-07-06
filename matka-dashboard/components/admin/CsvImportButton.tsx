"use client";
import { useRef, useState } from "react";

/**
 * CSV format (one week per line, header row optional):
 * weekStart,weekEnd,mon,tue,wed,thu,fri,sat,sun
 * - Dates as YYYY-MM-DD.
 * - Panel day cells: "open-jodi-close" (e.g. "128-91-690"), or blank/"--" for no result.
 * - Jodi day cells: just the 2-digit value (e.g. "91"), or blank/"--" for no result.
 */
export function CsvImportButton({
  rowId,
  kind,
  onDone,
}: {
  rowId: string;
  kind: "panel" | "jodi";
  onDone: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function parseRows(text: string): { weekStart: string; weekEnd: string; days: unknown[] }[] {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
    const rows: { weekStart: string; weekEnd: string; days: unknown[] }[] = [];
    for (const line of lines) {
      const cols = line.split(",").map((c) => c.trim());
      const [weekStart, weekEnd, ...dayCols] = cols;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart || "")) continue; // skip header/invalid rows
      const days = Array.from({ length: 7 }, (_, i) => {
        const raw = (dayCols[i] || "").trim();
        if (kind === "panel") {
          if (!raw || raw === "--") return { open: "", jodi: "", close: "", color: "#000000" };
          const [open = "", jodi = "", close = ""] = raw.split("-");
          return { open, jodi, close, color: "#000000" };
        }
        return { value: raw === "--" ? "" : raw, color: "#000000" };
      });
      rows.push({ weekStart, weekEnd, days });
    }
    return rows;
  }

  async function handleFile(file: File) {
    setBusy(true);
    setResult(null);
    try {
      const text = await file.text();
      const rows = parseRows(text);
      let ok = 0;
      let failed = 0;
      for (const row of rows) {
        const res = await fetch(`/api/admin/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId, weekStart: row.weekStart, weekEnd: row.weekEnd, days: row.days }),
        });
        if (res.ok) ok++;
        else failed++;
      }
      setResult(`Imported ${ok} week${ok === 1 ? "" : "s"}${failed ? `, ${failed} failed` : ""}.`);
      onDone();
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="text-xs sm:text-sm"
      />
      {busy && <span className="text-xs text-gray-500">Importing…</span>}
      {result && <span className="text-xs text-green-700">{result}</span>}
    </div>
  );
}
