"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import type { StyleSlot } from "@/lib/schema";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safeColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : "#000000";
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={safeColor} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 border border-gray-300 rounded" />
        <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </label>
  );
}

export default function LuckyAdmin() {
  const [data, setData] = useState<SectionData | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/section-settings/lucky_band", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setData(j));
  }, []);

  function setContent(key: string, value: string) {
    setData((d) => (d ? { ...d, content: { ...d.content, [key]: value } } : d));
  }

  function setSlotColor(slot: string, field: "textColor" | "borderColor" | "borderWidth" | "backgroundColor" | "fontSize", value: string) {
    setData((d) =>
      d ? { ...d, styles: { ...d.styles, [slot]: { ...d.styles[slot], [field]: value } } } : d
    );
  }

  async function save() {
    if (!data) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/section-settings/lucky_band", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styles: data.styles, content: data.content }),
    });
    setBusy(false);
    setMessage(res.ok ? { type: "ok", text: "✓ Saved — live on the public site" } : { type: "error", text: "Save failed" });
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
        <h1
          className="text-2xl font-bold text-center uppercase"
          style={{ color: "blue", paddingTop: "30px", paddingBottom: "10px" }}
        >
          Lucky Number
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Left and right box of the lucky number band. Leave a result value empty to use the auto value from the source site.
        </p>

        {!data ? (
          <div className="text-gray-500 py-6 text-center">Loading…</div>
        ) : (
          <div className="space-y-6">
            {/* Title band */}
            <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
              <div className="font-bold text-gray-700">Section title (top band)</div>
              <label className="block">
                <span className="text-xs font-semibold text-gray-700">Title text</span>
                <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={data.content.heading || ""} onChange={(e) => setContent("heading", e.target.value)} />
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <ColorField label="Text color" value={data.styles.titleBand?.textColor || ""} onChange={(v) => setSlotColor("titleBand", "textColor", v)} />
                <ColorField label="Background color" value={data.styles.titleBand?.backgroundColor || ""} onChange={(v) => setSlotColor("titleBand", "backgroundColor", v)} />
                <ColorField label="Border color" value={data.styles.titleBand?.borderColor || ""} onChange={(v) => setSlotColor("titleBand", "borderColor", v)} />
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Border width</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 3px" value={data.styles.titleBand?.borderWidth || ""} onChange={(e) => setSlotColor("titleBand", "borderWidth", e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Font size</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 18px" value={data.styles.titleBand?.fontSize || ""} onChange={(e) => setSlotColor("titleBand", "fontSize", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Left side */}
              <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
                <div className="font-bold text-gray-700">Left side</div>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Title</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={data.content.ankLabel || ""} onChange={(e) => setContent("ankLabel", e.target.value)} />
                </label>
                <ColorField label="Title color" value={data.styles.ankLeftTitle?.textColor || ""} onChange={(v) => setSlotColor("ankLeftTitle", "textColor", v)} />
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Result value</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="empty = auto from source" value={data.content.ankValue || ""} onChange={(e) => setContent("ankValue", e.target.value)} />
                </label>
                <ColorField label="Result value color" value={data.styles.ankLeftValue?.textColor || ""} onChange={(v) => setSlotColor("ankLeftValue", "textColor", v)} />
              </div>

              {/* Right side */}
              <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
                <div className="font-bold text-gray-700">Right side</div>
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Title</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={data.content.finalAnkLabel || ""} onChange={(e) => setContent("finalAnkLabel", e.target.value)} />
                </label>
                <ColorField label="Title color" value={data.styles.ankRightTitle?.textColor || ""} onChange={(v) => setSlotColor("ankRightTitle", "textColor", v)} />
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Result value</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="empty = auto from source" value={data.content.finalAnkValue || ""} onChange={(e) => setContent("finalAnkValue", e.target.value)} />
                </label>
                <ColorField label="Result value color" value={data.styles.ankRightValue?.textColor || ""} onChange={(v) => setSlotColor("ankRightValue", "textColor", v)} />
              </div>
            </div>

            {/* Section border */}
            <div className="bg-white border border-gray-300 rounded p-4">
              <div className="font-bold text-gray-700 mb-3">Section border</div>
              <div className="grid md:grid-cols-2 gap-4">
                <ColorField label="Border color" value={data.styles.ankBox?.borderColor || ""} onChange={(v) => setSlotColor("ankBox", "borderColor", v)} />
                <label className="block">
                  <span className="text-xs font-semibold text-gray-700">Border width</span>
                  <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 3px" value={data.styles.ankBox?.borderWidth || ""} onChange={(e) => setSlotColor("ankBox", "borderWidth", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {message && (
                <span className={`text-sm font-medium ${message.type === "error" ? "text-red-600" : "text-green-700"}`}>{message.text}</span>
              )}
              <button onClick={save} disabled={busy} className="bg-black text-white px-6 py-2 rounded font-semibold disabled:opacity-50">
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
