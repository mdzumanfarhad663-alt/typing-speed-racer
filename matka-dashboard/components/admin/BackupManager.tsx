"use client";
import { useCallback, useEffect, useState } from "react";
import type { BackupMeta } from "@/lib/backup";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", hour12: true });
}

export function BackupManager() {
  const [backups, setBackups] = useState<BackupMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/backups", { cache: "no-store" });
    if (res.ok) setBackups((await res.json()).backups ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function backupNow() {
    setBusy("new");
    const res = await fetch("/api/admin/backups", { method: "POST" });
    if (res.ok) setBackups((await res.json()).backups ?? []);
    setBusy(null);
  }

  async function remove(id: string, when: string) {
    if (!confirm(`Delete the backup taken on ${fmt(when)}? This cannot be undone.`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/backups/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      setBackups((bs) => bs.filter((b) => b.id !== id));
    } else {
      alert("Delete failed. Please try again.");
    }
  }

  async function restore(id: string, when: string) {
    if (!confirm(`Restore all data from the backup taken on ${fmt(when)}?\n\nThis replaces the current data. A safety backup of the current state is saved first, so you can undo this.`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/backups/${id}/restore`, { method: "POST" });
    setBusy(null);
    if (res.ok) {
      alert("✓ Data restored successfully.");
      load();
    } else {
      alert("Restore failed. Please try again.");
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded p-4 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="font-bold text-lg">Backups</h2>
          <p className="text-sm text-gray-600">Backs up your game pages (Silon Day, Silon Night) with their panel/jodi charts, plus all site design &amp; content. Auto-scraped results are not included (they re-sync on their own). Click “Backup now” to save a restore point; click Restore to recover.</p>
        </div>
        <button onClick={backupNow} disabled={busy === "new"} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white px-4 py-2 rounded font-semibold whitespace-nowrap">
          {busy === "new" ? "Backing up…" : "⛃ Backup now"}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 py-6">Loading…</div>
      ) : backups.length === 0 ? (
        <div className="text-gray-500 py-6 italic">No backups yet. Click “Backup now” to create one.</div>
      ) : (
        <ul className="space-y-2">
          {backups.map((b) => (
            <li key={b.id} className="border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{fmt(b.createdAt)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${b.kind === "manual" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {b.kind === "manual" ? "manual" : "auto"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{b.rows} games · {b.panel} panel / {b.jodi} jodi weeks</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => restore(b.id, b.createdAt)}
                  disabled={busy === b.id}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded text-sm whitespace-nowrap"
                >
                  {busy === b.id ? "Working…" : "↺ Restore"}
                </button>
                <button
                  onClick={() => remove(b.id, b.createdAt)}
                  disabled={busy === b.id}
                  className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded text-sm whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
