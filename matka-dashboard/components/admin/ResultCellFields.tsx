"use client";
import type { ReactNode } from "react";
import type { StyleSlot } from "@/lib/schema";

const FONT_FAMILIES = ["System UI", "Arial, sans-serif", '"Open Sans", sans-serif', "Georgia, serif", '"Times New Roman", serif', "Verdana, sans-serif"];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safeColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : "#000000";
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <input type="color" value={safeColor} onChange={(e) => onChange(e.target.value)} className="h-9 w-11 border border-gray-300 rounded-md shrink-0 cursor-pointer" />
        <input className="flex-1 min-w-0 border border-gray-300 rounded-md px-2 py-1.5 text-sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
      </div>
    </label>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-1.5 rounded-md text-sm font-semibold border transition-colors ${
        active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );
}

/** Editor for one result-cell text role (Name / Result / Time): color, font, bold, italic, stroke, shadow on/off. */
export function ResultCellFields({
  label,
  slot,
  onChange,
}: {
  label: string;
  slot: StyleSlot;
  onChange: (next: StyleSlot) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">{label}</div>

      <div className="space-y-3">
        <ColorField label="Text color" value={slot.textColor || ""} onChange={(v) => onChange({ ...slot, textColor: v })} />

        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Font size</span>
          <input
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1"
            placeholder="e.g. 16px or 1.2rem"
            value={slot.fontSize || ""}
            onChange={(e) => onChange({ ...slot, fontSize: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Font family</span>
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1 bg-white"
            value={slot.fontFamily || ""}
            onChange={(e) => onChange({ ...slot, fontFamily: e.target.value })}
          >
            <option value="">(default)</option>
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Stroke width</span>
          <input
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm mt-1"
            placeholder="e.g. 1px"
            value={slot.textStrokeWidth || ""}
            onChange={(e) => onChange({ ...slot, textStrokeWidth: e.target.value })}
          />
        </label>

        <ColorField label="Stroke color" value={slot.textStrokeColor || ""} onChange={(v) => onChange({ ...slot, textStrokeColor: v })} />

        <div className="flex gap-2 pt-1">
          <ToggleButton active={slot.fontWeight === "700"} onClick={() => onChange({ ...slot, fontWeight: slot.fontWeight === "700" ? "400" : "700" })}>
            Bold
          </ToggleButton>
          <ToggleButton active={slot.fontStyle === "italic"} onClick={() => onChange({ ...slot, fontStyle: slot.fontStyle === "italic" ? "normal" : "italic" })}>
            Italic
          </ToggleButton>
        </div>

        <ToggleButton active={!!slot.textShadowOn} onClick={() => onChange({ ...slot, textShadowOn: !slot.textShadowOn })}>
          Text Shadow: {slot.textShadowOn ? "On" : "Off"}
        </ToggleButton>
      </div>
    </div>
  );
}
