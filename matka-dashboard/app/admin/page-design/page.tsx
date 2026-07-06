"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ResultCellFields } from "@/components/admin/ResultCellFields";
import { chartSectionKey, type ChartKind } from "@/lib/sectionConfig";
import type { StyleSlot } from "@/lib/schema";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

const PAGES: { kind: ChartKind; rowId: string }[] = [
  { kind: "jodi", rowId: "2f93afa3-b612-4658-a0b4-7c1f8774d287" },
  { kind: "jodi", rowId: "7582ed5f-d61f-45d7-ab1f-8a30143037ad" },
  { kind: "panel", rowId: "2f93afa3-b612-4658-a0b4-7c1f8774d287" },
  { kind: "panel", rowId: "7582ed5f-d61f-45d7-ab1f-8a30143037ad" },
];

const CELLS = [
  { slotKey: "headingText", label: "Heading" },
  { slotKey: "subtitleHeadingText", label: "Subtitle Heading" },
  { slotKey: "subtitleBodyText", label: "Subtitle Text" },
];

function PageEditor({ kind, rowId }: { kind: ChartKind; rowId: string }) {
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<SectionData | null>(null);
  const [busy, setBusy] = useState(false);
  const sectionKey = chartSectionKey(kind, rowId);

  useEffect(() => {
    fetch(`/api/public/${kind}/${rowId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setTitle(j.game?.title || rowId));
    fetch(`/api/admin/section-settings/${sectionKey}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [kind, rowId, sectionKey]);

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
        <h2 className="font-bold text-white">
          {title} — {kind === "jodi" ? "Jodi Chart" : "Panel Chart"}
        </h2>
      </div>
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {CELLS.map((cell) => (
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

export default function PageDesignAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Page Design</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the Heading, Subtitle Heading, and Subtitle Text styling for each jodi/panel chart page below.
        </p>
        {PAGES.map((p) => (
          <PageEditor key={`${p.kind}-${p.rowId}`} kind={p.kind} rowId={p.rowId} />
        ))}
      </div>
    </main>
  );
}
