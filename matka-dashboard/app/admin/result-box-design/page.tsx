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

const SECTIONS = [
  { key: "live_update_band", title: "📡 LIVE UPDATE" },
  { key: "live_result_list", title: "❰❰❰ 📊 LIVE MATKA RESULT ❱❱❱" },
] as const;

function SectionEditor({ sectionKey, title }: { sectionKey: string; title: string }) {
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
    <div className="bg-white border border-gray-300 rounded mb-6 p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <ResultCellFields label="Name" slot={data.styles.nameText || {}} onChange={(s) => updateSlot("nameText", s)} />
        <ResultCellFields label="Result" slot={data.styles.resultText || {}} onChange={(s) => updateSlot("resultText", s)} />
        <ResultCellFields label="Time" slot={data.styles.timeText || {}} onChange={(s) => updateSlot("timeText", s)} />
      </div>
      <div className="flex justify-end pt-3 mt-3 border-t">
        <button onClick={save} disabled={busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default function ResultBoxDesignAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-xl font-bold mb-1">Result Box Design</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the color, bold, italic, stroke, and text shadow for the Name, Result, and Time cells shown in the
          Live Update and Live Matka Result sections. Changes apply uniformly to every row.
        </p>
        {SECTIONS.map((s) => (
          <SectionEditor key={s.key} sectionKey={s.key} title={s.title} />
        ))}
      </div>
    </main>
  );
}
