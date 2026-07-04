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
      <td className="px-1 sm:px-2 py-2 cursor-grab text-gray-400 select-none" {...attributes} {...listeners}>⋮⋮</td>
      <td className="px-1 sm:px-2 py-2 font-semibold text-xs sm:text-sm" style={{ color: row.color }}>
        {row.title}
        {row.source === "scraped" && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-normal align-middle">auto</span>
        )}
      </td>
      <td className="px-1 sm:px-2 py-2 text-xs sm:text-sm">{row.resultValue}</td>
      <td className="hidden sm:table-cell px-1 sm:px-2 py-2 text-xs sm:text-sm text-gray-600">{row.timeRange}</td>
      <td className="hidden sm:table-cell px-1 sm:px-2 py-2 text-xs sm:text-sm">{row.leftTag} / {row.rightTag}</td>
      <td className="px-1 sm:px-2 py-2">
        <span className="inline-block w-4 h-4 rounded border border-gray-300 align-middle" style={{ background: row.color }} />
      </td>
      <td className="px-1 sm:px-2 py-2 text-right">
        <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
          {(section === "live_result" || section === "live_update") && (
            <>
              <Link href={`/admin/jodi/${row.id}`} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-2.5 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Jodi chart</Link>
              <Link href={`/admin/panel/${row.id}`} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Panel chart</Link>
            </>
          )}
          <button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Edit</button>
          <button onClick={onDelete} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-2.5 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap">Delete</button>
        </div>
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
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded">
            <thead className="bg-gray-100 text-left text-xs sm:text-sm">
              <tr>
                <th className="px-1 sm:px-2 py-2"></th>
                <th className="px-1 sm:px-2 py-2">Title</th>
                <th className="px-1 sm:px-2 py-2">Result</th>
                <th className="hidden sm:table-cell px-1 sm:px-2 py-2">Time</th>
                <th className="hidden sm:table-cell px-1 sm:px-2 py-2">Tags</th>
                <th className="px-1 sm:px-2 py-2">Color</th>
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
        </div>
      )}
    </div>
  );
}
