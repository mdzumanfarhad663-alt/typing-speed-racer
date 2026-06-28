"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Row, Section } from "@/lib/types";
import { RowForm } from "./RowForm";

function SortableRow({ row, section, onEdit, onDelete }: { row: Row; section: Section; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-200">
      <td className="px-2 py-2 cursor-grab text-gray-400 select-none" {...attributes} {...listeners}>⋮⋮</td>
      <td className="px-2 py-2 font-semibold" style={{ color: row.color }}>{row.title}</td>
      <td className="px-2 py-2">{row.resultValue}</td>
      <td className="px-2 py-2 text-sm text-gray-600">{row.timeRange}</td>
      <td className="px-2 py-2 text-sm">{row.leftTag} / {row.rightTag}</td>
      <td className="px-2 py-2">
        <span className="inline-block w-4 h-4 rounded border border-gray-300 align-middle" style={{ background: row.color }} />
      </td>
      <td className="px-2 py-2 text-right whitespace-nowrap">
        {section === "live_result" && (
          <>
            <Link href={`/admin/jodi/${row.id}`} className="text-red-700 underline text-sm mr-3">Jodi chart</Link>
            <Link href={`/admin/panel/${row.id}`} className="text-purple-700 underline text-sm mr-3">Panel chart</Link>
          </>
        )}
        <button onClick={onEdit} className="text-blue-700 underline text-sm mr-3">Edit</button>
        <button onClick={onDelete} className="text-red-700 underline text-sm">Delete</button>
      </td>
    </tr>
  );
}

export function RowTable({ section }: { section: Section }) {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function reload() {
    setLoading(true);
    const res = await fetch(`/api/admin/rows?section=${section}`, { cache: "no-store" });
    if (res.ok) {
      const { rows } = await res.json();
      setItems(rows);
    }
    setLoading(false);
  }

  useEffect(() => { reload(); }, [section]);

  async function onDelete(id: string) {
    if (!confirm("Delete this row?")) return;
    const res = await fetch(`/api/admin/rows/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((r) => r.id !== id));
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    await fetch("/api/admin/rows/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((r, i) => ({ id: r.id, position: i })) }),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold capitalize">{section.replace("_", " ")} rows</h2>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className="bg-green-700 text-white px-4 py-2 rounded font-semibold">+ Add row</button>
        )}
      </div>
      {showForm && (
        <RowForm
          section={section}
          onCancel={() => setShowForm(false)}
          onSaved={(row) => { setItems([...items, row]); setShowForm(false); }}
        />
      )}
      {editing && (
        <RowForm
          section={section}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={(row) => { setItems(items.map((i) => (i.id === row.id ? row : i))); setEditing(null); }}
        />
      )}
      {loading ? (
        <div className="text-gray-500 py-6">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 py-6 italic">No rows yet. Click "Add row" to create one.</div>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-2 py-2"></th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Result</th>
              <th className="px-2 py-2">Time</th>
              <th className="px-2 py-2">Tags</th>
              <th className="px-2 py-2">Color</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((row) => (
                  <SortableRow key={row.id} row={row} section={section} onEdit={() => setEditing(row)} onDelete={() => onDelete(row.id)} />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      )}
    </div>
  );
}
