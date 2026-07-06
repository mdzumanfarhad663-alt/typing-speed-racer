"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, unknown>;
  content: Record<string, string>;
};

export default function RecordAdmin() {
  const [data, setData] = useState<SectionData | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/section-settings/chart_records", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-100">
        <AdminNav />
        <div className="max-w-4xl mx-auto p-3 sm:p-8 text-gray-500">Loading…</div>
      </main>
    );
  }

  function update(key: string, value: string) {
    setData((d) => (d ? { ...d, content: { ...d.content, [key]: value } } : d));
  }

  async function save() {
    if (!data) return;
    setBusy(true);
    await fetch("/api/admin/section-settings/chart_records", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styles: data.styles, content: data.content }),
    });
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Record</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the chart records section headings shown on the homepage.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-gray-500">Jodi chart records heading</span>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1"
                value={data.content.jodiHeading || ""}
                onChange={(e) => update("jodiHeading", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-500">Panel chart records heading</span>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1"
                value={data.content.panelHeading || ""}
                onChange={(e) => update("panelHeading", e.target.value)}
              />
            </label>
          </div>
          <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
            <button onClick={save} disabled={busy} className="px-5 py-2 rounded-lg bg-black text-white font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors">
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
