"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ChartLinkListField } from "@/components/admin/SectionSettingsForm";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, unknown>;
  content: Record<string, string>;
};

type ChartLinkItem = { label: string; href: string };

function parseLinks(json: string | undefined): ChartLinkItem[] {
  try {
    const parsed = JSON.parse(json || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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

  function updateLinks(key: string, items: ChartLinkItem[]) {
    update(key, JSON.stringify(items));
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

  const LISTS: { headingKey: string; linksKey: string; headingLabel: string }[] = [
    { headingKey: "jodiHeading", linksKey: "jodiLinks", headingLabel: "Jodi chart records heading" },
    { headingKey: "panelHeading", linksKey: "panelLinks", headingLabel: "Panel chart records heading" },
    { headingKey: "otherJodiHeading", linksKey: "otherJodiLinks", headingLabel: "Other jodi chart heading" },
    { headingKey: "otherPanelHeading", linksKey: "otherPanelLinks", headingLabel: "Other panel chart heading" },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Record</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the chart records headings and add, edit, or remove chart record links shown on the homepage.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
          <div className="text-xs font-bold text-gray-500 uppercase mb-3">Headings</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {LISTS.map((l) => (
              <label key={l.headingKey} className="block">
                <span className="text-xs font-semibold text-gray-500">{l.headingLabel}</span>
                <input
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1"
                  value={data.content[l.headingKey] || ""}
                  onChange={(e) => update(l.headingKey, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        {LISTS.map((l) => (
          <div key={l.linksKey} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
            <div className="text-xs font-bold text-gray-500 uppercase mb-3">{data.content[l.headingKey]}</div>
            <ChartLinkListField
              items={parseLinks(data.content[l.linksKey])}
              onChange={(items) => updateLinks(l.linksKey, items)}
            />
          </div>
        ))}

        <div className="flex justify-end sticky bottom-4">
          <button onClick={save} disabled={busy} className="px-5 py-2 rounded-lg bg-black text-white font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors shadow-lg">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
