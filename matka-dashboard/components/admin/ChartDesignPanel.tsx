"use client";
import { useEffect, useState } from "react";
import type { StyleSlot } from "@/lib/schema";
import type { SectionConfigEntry } from "@/lib/sectionConfig";
import { SectionSettingsForm } from "./SectionSettingsForm";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

/** Collapsible per-page design editor for a dynamic chart section key (panel_chart_<rowId> / jodi_chart_<rowId>). */
export function ChartDesignPanel({ sectionKey }: { sectionKey: string }) {
  const [data, setData] = useState<SectionData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/section-settings/${sectionKey}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setData(j));
  }, [sectionKey]);

  if (!data) return null;

  const labelize = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

  const config: SectionConfigEntry = {
    key: data.sectionKey,
    label: data.label,
    styleSlots: Object.keys(data.styles).map((k) => ({ key: k, label: labelize(k), default: data.styles[k] })),
    contentFields: Object.keys(data.content).map((k) => ({
      key: k,
      label: labelize(k),
      type: data.content[k].length > 60 ? ("textarea" as const) : ("text" as const),
      default: data.content[k],
    })),
  };

  return (
    <div className="bg-white border border-gray-300 rounded mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
      >
        Page Design (colors, fonts, borders, text)
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <SectionSettingsForm
            config={config}
            data={data}
            onSaved={(next) => setData(next)}
          />
        </div>
      )}
    </div>
  );
}
