"use client";
import type { StyleSlot } from "@/lib/schema";

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

/** Simplified editor for one result-cell text role (Name / Result / Time): color, bold, italic, stroke, shadow on/off. */
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
    <div className="bg-white border border-gray-200 rounded p-3">
      <div className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Text color" value={slot.textColor || ""} onChange={(v) => onChange({ ...slot, textColor: v })} />
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Stroke (e.g. 1px black)</span>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="e.g. 1px #000"
            value={slot.textStroke || ""}
            onChange={(e) => onChange({ ...slot, textStroke: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={slot.fontWeight === "700"}
            onChange={(e) => onChange({ ...slot, fontWeight: e.target.checked ? "700" : "400" })}
          />
          <span className="text-xs font-semibold text-gray-700">Bold</span>
        </label>
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={slot.fontStyle === "italic"}
            onChange={(e) => onChange({ ...slot, fontStyle: e.target.checked ? "italic" : "normal" })}
          />
          <span className="text-xs font-semibold text-gray-700">Italic</span>
        </label>
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...slot, textShadowOn: !slot.textShadowOn })}
        className={`mt-3 px-3 py-1.5 rounded text-sm font-semibold ${slot.textShadowOn ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
      >
        Text Shadow: {slot.textShadowOn ? "On" : "Off"}
      </button>
    </div>
  );
}
