"use client";
import type { PanelEntry, JodiEntry } from "@/lib/schema";

// Mirrors CsvImportButton's format exactly, so an exported file can be
// re-imported without changes:
// Week Ending Date,MON,TUE,WED,THU,FRI,SAT,SUN
// - Week column: "DD/MM/YYYY to DD/MM/YYYY"
// - Panel day cells: "open-jodi-close" (e.g. "128-91-690"), or blank for no result.
// - Jodi day cells: just the 2-digit value (e.g. "91"), or blank for no result.

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function toCsv(entries: (PanelEntry | JodiEntry)[], kind: "panel" | "jodi"): string {
  const header = "Week Ending Date,MON,TUE,WED,THU,FRI,SAT,SUN";
  const lines = entries.map((e) => {
    const week = `${fmtDate(e.weekStart)} to ${fmtDate(e.weekEnd)}`;
    const days = e.days.map((d) => {
      if (kind === "panel") {
        const p = d as PanelEntry["days"][number];
        if (!p.open && !p.jodi && !p.close) return "";
        return `${p.open}-${p.jodi}-${p.close}`;
      }
      const j = d as JodiEntry["days"][number];
      return j.value || "";
    });
    return [week, ...days].join(",");
  });
  return [header, ...lines].join("\r\n");
}

export function CsvExportButton({
  entries,
  kind,
  fileName,
}: {
  entries: (PanelEntry | JodiEntry)[];
  kind: "panel" | "jodi";
  fileName: string;
}) {
  function download() {
    const csv = toCsv(entries, kind);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={entries.length === 0}
      className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-1.5 rounded text-sm whitespace-nowrap"
    >
      ⬇ Download CSV
    </button>
  );
}
