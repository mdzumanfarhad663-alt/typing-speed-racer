"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { getSectionConfig } from "@/lib/sectionConfig";
import type { StyleSlot } from "@/lib/schema";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

const KEYS = ["live_update_band", "live_result_list"] as const;

export default function ResultBoxDesignAdmin() {
  const [sections, setSections] = useState<Record<string, SectionData> | null>(null);

  useEffect(() => {
    Promise.all(KEYS.map((k) => fetch(`/api/admin/section-settings/${k}`).then((r) => r.json()))).then((results) => {
      const map: Record<string, SectionData> = {};
      results.forEach((r) => { map[r.sectionKey] = r; });
      setSections(map);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <h1 className="text-xl font-bold mb-1">Result Box Design</h1>
        <p className="text-sm text-gray-600 mb-6">
          Edit the color, border, font style, bold, italic, shadow, blur, and padding for the result cells shown in
          "📡 Live Update" and "❰❰❰ Live Matka Result ❱❱❱" — market name, result number, and time range together.
        </p>
        {!sections && <div className="text-gray-500">Loading…</div>}
        {sections && KEYS.map((key) => {
          const data = sections[key];
          const cfg = getSectionConfig(key);
          if (!data || !cfg) return null;
          return (
            <div key={key} className="bg-white border border-gray-300 rounded mb-6 p-4">
              <h2 className="font-semibold mb-3">{cfg.label}</h2>
              <SectionSettingsForm
                config={cfg}
                data={data}
                onSaved={(next) => setSections((s) => ({ ...s!, [key]: next }))}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
