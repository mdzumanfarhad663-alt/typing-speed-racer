"use client";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MarketTiming } from "@/lib/schema";

type FormState = { marketName: string; openTime: string; closeTime: string; status: string };
const EMPTY_FORM: FormState = { marketName: "", openTime: "", closeTime: "", status: "Daily" };

function MarketTimingForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: MarketTiming | null;
  onCancel: () => void;
  onSaved: (m: MarketTiming) => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? { marketName: initial.marketName, openTime: initial.openTime, closeTime: initial.closeTime, status: initial.status }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = initial ? `/api/admin/market-timings/${initial.id}` : "/api/admin/market-timings";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const json = await res.json();
      onSaved(json.marketTiming);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <input
        required
        placeholder="Market name (e.g. Kalyan)"
        value={form.marketName}
        onChange={(e) => setForm({ ...form, marketName: e.target.value })}
        className="border rounded px-2 py-1 col-span-2 md:col-span-1"
      />
      <input
        placeholder="Open time (e.g. 3:45 PM)"
        value={form.openTime}
        onChange={(e) => setForm({ ...form, openTime: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        placeholder="Close time (e.g. 5:45 PM)"
        value={form.closeTime}
        onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        placeholder="Status (e.g. Mon–Sat, Daily)"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <div className="col-span-2 md:col-span-4 flex gap-3">
        <button type="submit" disabled={saving} className="bg-green-700 text-white px-4 py-1.5 rounded font-semibold disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="text-gray-600 underline">Cancel</button>
      </div>
    </form>
  );
}

function SortableTimingRow({
  m,
  onEdit,
  onDelete,
}: {
  m: MarketTiming;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-200">
      <td className="px-2 py-2 cursor-grab text-gray-400 select-none" {...attributes} {...listeners}>⋮⋮</td>
      <td className="px-2 py-2 font-semibold">{m.marketName}</td>
      <td className="px-2 py-2">{m.openTime}</td>
      <td className="px-2 py-2">{m.closeTime}</td>
      <td className="px-2 py-2 text-sm text-gray-600">{m.status}</td>
      <td className="px-2 py-2 text-right whitespace-nowrap">
        <button onClick={onEdit} className="text-blue-700 underline text-sm mr-3">Edit</button>
        <button onClick={onDelete} className="text-red-700 underline text-sm">Delete</button>
      </td>
    </tr>
  );
}

export function MarketTimingTable() {
  const [items, setItems] = useState<MarketTiming[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MarketTiming | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function reload() {
    setLoading(true);
    const res = await fetch("/api/admin/market-timings", { cache: "no-store" });
    if (res.ok) {
      const { marketTimings } = await res.json();
      setItems(marketTimings);
    }
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this market row?")) return;
    const res = await fetch(`/api/admin/market-timings/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((m) => m.id !== id));
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    await fetch("/api/admin/market-timings/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((m, i) => ({ id: m.id, position: i })) }),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold">All Matka Result — Market Timings</h2>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className="bg-green-700 text-white px-4 py-2 rounded font-semibold whitespace-nowrap">+ Add market</button>
        )}
      </div>
      {showForm && (
        <MarketTimingForm
          onCancel={() => setShowForm(false)}
          onSaved={(m) => { setItems([...items, m]); setShowForm(false); }}
        />
      )}
      {editing && (
        <MarketTimingForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={(m) => { setItems(items.map((i) => (i.id === m.id ? m : i))); setEditing(null); }}
        />
      )}
      {loading ? (
        <div className="text-gray-500 py-6">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 py-6 italic">No markets yet. Click "Add market" to create one.</div>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] bg-white border border-gray-200 rounded text-sm">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-2 py-2"></th>
              <th className="px-2 py-2">Market Name</th>
              <th className="px-2 py-2">Open Time</th>
              <th className="px-2 py-2">Close Time</th>
              <th className="px-2 py-2">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((m) => (
                  <SortableTimingRow key={m.id} m={m} onEdit={() => setEditing(m)} onDelete={() => onDelete(m.id)} />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
