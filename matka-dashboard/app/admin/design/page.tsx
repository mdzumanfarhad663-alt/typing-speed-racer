"use client";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { MatkaRatesEditor } from "@/components/admin/MatkaRatesEditor";
import { SECTION_CONFIG } from "@/lib/sectionConfig";
import type { StyleSlot } from "@/lib/schema";

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

// Hidden from this list but still resolved with their defaults on the public site.
const HIDDEN_KEYS = new Set(["free_zone_block", "satta_matka_info"]);

export default function DesignAdmin() {
  const [sections, setSections] = useState<SectionData[] | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/section-settings")
      .then((r) => r.json())
      .then((j) => setSections(j.sections));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <h1 className="text-xl font-bold mb-1">Design Settings</h1>
        <p className="text-sm text-gray-600 mb-6">
          Change the background color, text color, font, border and text content of every section on the public site.
          Changes apply live within a few seconds — no code changes or redeploy needed.
        </p>
        {!sections && <div className="text-gray-500">Loading…</div>}
        {sections?.map((section) => {
          if (HIDDEN_KEYS.has(section.sectionKey)) return null;
          const cfg = SECTION_CONFIG.find((c) => c.key === section.sectionKey);
          if (!cfg) return null;
          const isOpen = openKey === section.sectionKey;
          return (
            <div key={section.sectionKey} className="bg-white border border-gray-300 rounded mb-3">
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : section.sectionKey)}
                className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
              >
                {section.label}
                <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <SectionSettingsForm
                    config={cfg}
                    data={section}
                    onSaved={(next) => setSections((all) => all!.map((s) => (s.sectionKey === next.sectionKey ? next : s)))}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Rates for the homepage Matka Rates Chart section */}
        <div className="bg-white border border-gray-300 rounded mb-3">
          <button
            type="button"
            onClick={() => setOpenKey(openKey === "matka_rates" ? null : "matka_rates")}
            className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
          >
            Matka Rates Chart
            <span className="text-gray-400">{openKey === "matka_rates" ? "▲" : "▼"}</span>
          </button>
          {openKey === "matka_rates" && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-4">
              <MatkaRatesEditor />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
