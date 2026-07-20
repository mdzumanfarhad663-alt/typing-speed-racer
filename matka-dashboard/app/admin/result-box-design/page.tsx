"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ResultCellFields } from "@/components/admin/ResultCellFields";
import type { StyleSlot } from "@/lib/schema";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

type CellDef = { slotKey: string; label: string };

const SECTIONS: { key: string; title: string; cells: CellDef[] }[] = [
  {
    key: "live_update_band",
    title: "📡 LIVE UPDATE",
    cells: [
      { slotKey: "nameText", label: "Name" },
      { slotKey: "resultText", label: "Result" },
      { slotKey: "timeText", label: "Time" },
      { slotKey: "refreshButton", label: "Refresh Button" },
    ],
  },
  {
    key: "live_result_list",
    title: "❰❰❰ 📊 LIVE MATKA RESULT ❱❱❱",
    cells: [
      { slotKey: "nameText", label: "Name" },
      { slotKey: "resultText", label: "Result" },
      { slotKey: "timeText", label: "Time" },
    ],
  },
  {
    key: "lucky_band",
    title: "Today Satta Matka Lucky Number",
    cells: [
      { slotKey: "ankNameText", label: "Name" },
      { slotKey: "ankNumberText", label: "Number" },
    ],
  },
];

function SectionEditor({ sectionKey, title, cells }: { sectionKey: string; title: string; cells: CellDef[] }) {
  const [data, setData] = useState<SectionData | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/section-settings/${sectionKey}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [sectionKey]);

  if (!data) return <div className="text-gray-500">Loading…</div>;

  function updateSlot(slotKey: string, next: StyleSlot) {
    setData((d) => (d ? { ...d, styles: { ...d.styles, [slotKey]: next } } : d));
  }

  async function save() {
    if (!data) return;
    setBusy(true);
    await fetch(`/api/admin/section-settings/${sectionKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styles: data.styles, content: data.content }),
    });
    setBusy(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
      <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500">
        <h2 className="font-bold text-white">{title}</h2>
      </div>
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {cells.map((cell) => (
            <ResultCellFields
              key={cell.slotKey}
              label={cell.label}
              slot={data.styles[cell.slotKey] || {}}
              onChange={(s) => updateSlot(cell.slotKey, s)}
            />
          ))}
        </div>
        <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
          <button onClick={save} disabled={busy} className="px-5 py-2 rounded-lg bg-black text-white font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultBoxDesignAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Result Box Design</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the color, font, bold, italic, stroke, and text shadow for the text cells shown in the Live Update,
          Live Matka Result, and Lucky Number sections. Changes apply uniformly to every row.
        </p>
        {SECTIONS.map((s) => (
          <SectionEditor key={s.key} sectionKey={s.key} title={s.title} cells={s.cells} />
        ))}
      </div>
    </main>
  );
}
