"use client";
import { useState } from "react";

/**
 * CSV format (one week per line, header row auto-skipped):
 * Week Ending Date,MON,TUE,WED,THU,FRI,SAT,SUN
 * - Week column: "DD/MM/YYYY to DD/MM/YYYY" (or "DD/MM/YYYY - DD/MM/YYYY").
 * - Panel day cells: "open-jodi-close" (e.g. "128-91-690"), or "Holiday/No data" / blank / "--" for no result.
 * - Jodi day cells: just the 2-digit value (e.g. "91"), or "Holiday/No data" / blank / "--" for no result.
 */

type ParsedRow = { weekStart: string; weekEnd: string; days: unknown[] };

function normalizeDate(raw: string): string | null {
  const s = raw.trim().replace(/^["']|["']$/g, "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return null;
}

/** Splits a "weekStart to weekEnd" cell into two normalized dates. */
function parseWeekRange(raw: string): { weekStart: string; weekEnd: string } | null {
  const parts = raw.split(/\s+to\s+|\s*-\s*(?=\d)/i).map((p) => p.trim());
  if (parts.length !== 2) return null;
  const weekStart = normalizeDate(parts[0]);
  const weekEnd = normalizeDate(parts[1]);
  if (!weekStart || !weekEnd) return null;
  return { weekStart, weekEnd };
}

function isBlank(raw: string): boolean {
  const s = raw.trim().toLowerCase();
  return s === "" || s === "--" || s === "holiday/no data" || s === "holiday" || s === "no data";
}

function parseRows(text: string, kind: "panel" | "jodi"): { rows: ParsedRow[]; skipped: number } {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  const rows: ParsedRow[] = [];
  let skipped = 0;
  for (const line of lines) {
    const cols = line.split(",").map((c) => c.trim());
    const week = parseWeekRange(cols[0] || "");
    if (!week) {
      skipped++;
      continue;
    }
    const dayCols = cols.slice(1);
    const days = Array.from({ length: 7 }, (_, i) => {
      const raw = (dayCols[i] || "").trim().replace(/^["']|["']$/g, "");
      if (kind === "panel") {
        if (isBlank(raw)) return { open: "", jodi: "", close: "", color: "#000000" };
        const [open = "", jodi = "", close = ""] = raw.split("-");
        return { open, jodi, close, color: "#000000" };
      }
      return { value: isBlank(raw) ? "" : raw, color: "#000000" };
    });
    rows.push({ weekStart: week.weekStart, weekEnd: week.weekEnd, days });
  }
  return { rows, skipped };
}

export function CsvImportButton({
  rowId,
  kind,
  onDone,
}: {
  rowId: string;
  kind: "panel" | "jodi";
  onDone: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ rows: ParsedRow[]; skipped: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(f: File | null) {
    setResult(null);
    setError(null);
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const text = await f.text();
    const parsed = parseRows(text, kind);
    setPreview(parsed);
    if (parsed.rows.length === 0) {
      setError(
        `Could not read any valid rows from this file. Each line should start with a week range like "07/07/2025 to 13/07/2025" followed by 7 day columns.`
      );
    }
  }

  async function handleImport() {
    if (!preview || preview.rows.length === 0) return;
    setBusy(true);
    setResult(null);
    setError(null);
    let ok = 0;
    let failed = 0;
    for (let i = 0; i < preview.rows.length; i++) {
      const row = preview.rows[i];
      setProgress(`Importing week ${i + 1} of ${preview.rows.length}…`);
      try {
        const res = await fetch(`/api/admin/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId, weekStart: row.weekStart, weekEnd: row.weekEnd, days: row.days }),
        });
        if (res.ok) ok++;
        else failed++;
      } catch {
        failed++;
      }
    }
    setBusy(false);
    setProgress(null);
    setResult(`Imported ${ok} week${ok === 1 ? "" : "s"}${failed ? `, ${failed} failed` : ""}.`);
    setFile(null);
    setPreview(null);
    onDone();
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept=".csv,text/csv"
        disabled={busy}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="text-xs sm:text-sm"
      />
      {preview && preview.rows.length > 0 && (
        <div className="text-xs text-gray-700">
          Found <strong>{preview.rows.length}</strong> valid week{preview.rows.length === 1 ? "" : "s"} to import
          {preview.skipped > 0 && `, skipped ${preview.skipped} row(s)`}.
        </div>
      )}
      {error && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
      {progress && <div className="text-xs text-gray-500">{progress}</div>}
      {result && <div className="text-xs text-green-700">{result}</div>}
      <button
        type="button"
        onClick={handleImport}
        disabled={busy || !file || !preview || preview.rows.length === 0}
        className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-1.5 rounded text-sm disabled:opacity-50"
      >
        {busy ? "Importing…" : "Import CSV"}
      </button>
    </div>
  );
}
