"use client";
import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { StyleSlot } from "@/lib/schema";
import type { SectionConfigEntry } from "@/lib/sectionConfig";

type FaqItem = { q: string; a: string };

type SectionData = {
  sectionKey: string;
  label: string;
  styles: Record<string, StyleSlot>;
  content: Record<string, string>;
};

// Shared style for editor section headings (TOP HEADER, SUBTITLE BOX, …)
export function EditorHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-lg sm:text-2xl font-bold text-left uppercase break-words pt-5 sm:pt-[30px] pb-2.5"
      style={{ color: "blue" }}
    >
      {children}
    </div>
  );
}

const FONT_FAMILIES = ["System UI", "Arial, sans-serif", '"Open Sans", sans-serif', "Georgia, serif", '"Times New Roman", serif', "Verdana, sans-serif"];
const BORDER_STYLES = ["solid", "dashed", "dotted", "double", "groove", "inset", "none"];
const TEXT_ALIGNS = ["left", "center", "right"] as const;

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

function StyleSlotFields({ slot, onChange }: { slot: StyleSlot; onChange: (next: StyleSlot) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 rounded p-3">
      <ColorField label="Background color" value={slot.backgroundColor || ""} onChange={(v) => onChange({ ...slot, backgroundColor: v })} />
      <ColorField label="Text color" value={slot.textColor || ""} onChange={(v) => onChange({ ...slot, textColor: v })} />
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Font size</span>
        <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 16px or 1.2rem" value={slot.fontSize || ""} onChange={(e) => onChange({ ...slot, fontSize: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Font family</span>
        <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={slot.fontFamily || ""} onChange={(e) => onChange({ ...slot, fontFamily: e.target.value })}>
          <option value="">(default)</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>
      <ColorField label="Border color" value={slot.borderColor || ""} onChange={(v) => onChange({ ...slot, borderColor: v })} />
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Border width</span>
        <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 2px" value={slot.borderWidth || ""} onChange={(e) => onChange({ ...slot, borderWidth: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Border style</span>
        <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={slot.borderStyle || ""} onChange={(e) => onChange({ ...slot, borderStyle: e.target.value })}>
          <option value="">(default)</option>
          {BORDER_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Text align</span>
        <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={slot.textAlign || ""} onChange={(e) => onChange({ ...slot, textAlign: e.target.value as StyleSlot["textAlign"] })}>
          <option value="">(default)</option>
          {TEXT_ALIGNS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-gray-700">Padding</span>
        <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 1rem" value={slot.padding || ""} onChange={(e) => onChange({ ...slot, padding: e.target.value })} />
      </label>
      <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
        <EditorHeading>Text Shadow</EditorHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ColorField label="Shadow color" value={slot.textShadowColor || ""} onChange={(v) => onChange({ ...slot, textShadowColor: v })} />
          <label className="block">
            <span className="text-xs font-semibold text-gray-700">Shadow blur (px)</span>
            <input className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="e.g. 0 or 3" value={slot.textShadowBlur || ""} onChange={(e) => onChange({ ...slot, textShadowBlur: e.target.value })} />
          </label>
        </div>
      </div>
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
  );
}

function FaqListField({ items, onChange }: { items: FaqItem[]; onChange: (items: FaqItem[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded p-2 space-y-1">
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Question"
            value={item.q}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, q: e.target.value } : it)))}
          />
          <textarea
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Answer"
            rows={2}
            value={item.a}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? { ...it, a: e.target.value } : it)))}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs text-red-700">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { q: "", a: "" }])} className="text-sm text-blue-700 underline">+ Add Q/A</button>
    </div>
  );
}

type ChartLinkItem = { label: string; href: string };

function SortableChartLinkRow({
  id,
  item,
  onUpdate,
  onRemove,
}: {
  id: string;
  item: ChartLinkItem;
  onUpdate: (next: ChartLinkItem) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row gap-2 sm:items-start border border-gray-200 rounded p-2 bg-white">
      <span className="hidden sm:inline cursor-grab text-gray-400 select-none mt-2 shrink-0" {...attributes} {...listeners}>⋮⋮</span>
      <input
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
        placeholder="Link name"
        value={item.label}
        onChange={(e) => onUpdate({ ...item, label: e.target.value })}
      />
      <input
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
        placeholder="https://..."
        value={item.href}
        onChange={(e) => onUpdate({ ...item, href: e.target.value })}
      />
      <button type="button" onClick={onRemove} className="text-xs text-red-700 shrink-0 mt-2">Remove</button>
    </div>
  );
}

export function ChartLinkListField({ items, onChange }: { items: ChartLinkItem[]; onChange: (items: ChartLinkItem[]) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const ids = items.map((_, i) => String(i));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onChange(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SortableChartLinkRow
              key={ids[i]}
              id={ids[i]}
              item={item}
              onUpdate={(next) => onChange(items.map((it, j) => (j === i ? next : it)))}
              onRemove={() => onChange(items.filter((_, j) => j !== i))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" onClick={() => onChange([...items, { label: "", href: "" }])} className="text-sm text-blue-700 underline">+ Add new line</button>
    </div>
  );
}

export function SectionSettingsForm({ config, data, onSaved }: { config: SectionConfigEntry; data: SectionData; onSaved: (d: SectionData) => void }) {
  const [styles, setStyles] = useState<Record<string, StyleSlot>>(data.styles);
  const [content, setContent] = useState<Record<string, string>>(data.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/section-settings/${config.key}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styles, content }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    onSaved({ ...data, styles, content });
  }

  async function reset() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/section-settings/${config.key}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setError("Reset failed");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-100 text-red-800 p-2 rounded text-sm">{error}</div>}

      {config.styleSlots.map((slotDef) => (
        <div key={slotDef.key}>
          <EditorHeading>{slotDef.label}</EditorHeading>
          <StyleSlotFields
            slot={styles[slotDef.key] || {}}
            onChange={(next) => setStyles((s) => ({ ...s, [slotDef.key]: next }))}
          />
        </div>
      ))}

      {config.contentFields.map((fieldDef) => (
        <div key={fieldDef.key}>
          <EditorHeading>{fieldDef.label}</EditorHeading>
          {fieldDef.type === "text" && (
            <input
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={content[fieldDef.key] || ""}
              onChange={(e) => setContent((c) => ({ ...c, [fieldDef.key]: e.target.value }))}
            />
          )}
          {fieldDef.type === "textarea" && (
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              rows={4}
              value={content[fieldDef.key] || ""}
              onChange={(e) => setContent((c) => ({ ...c, [fieldDef.key]: e.target.value }))}
            />
          )}
          {fieldDef.type === "list" && (
            <FaqListField
              items={(() => {
                try {
                  const parsed = JSON.parse(content[fieldDef.key] || "[]");
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })()}
              onChange={(items) => setContent((c) => ({ ...c, [fieldDef.key]: JSON.stringify(items) }))}
            />
          )}
          {fieldDef.type === "linklist" && (
            <ChartLinkListField
              items={(() => {
                try {
                  const parsed = JSON.parse(content[fieldDef.key] || "[]");
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })()}
              onChange={(items) => setContent((c) => ({ ...c, [fieldDef.key]: JSON.stringify(items) }))}
            />
          )}
        </div>
      ))}

      <div className="sticky bottom-0 bg-gray-50 flex flex-wrap gap-2 justify-end pt-2 pb-1 border-t">
        <button type="button" onClick={reset} disabled={busy} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Reset to default</button>
        <button type="button" onClick={save} disabled={busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
