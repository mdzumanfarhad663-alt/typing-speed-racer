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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Backup time</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2 hidden sm:table-cell">Games</th>
                <th className="px-3 py-2 hidden sm:table-cell">Panel / Jodi weeks</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">{fmt(b.createdAt)}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${b.kind === "manual" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {b.kind === "manual" ? "manual" : "auto"}
                    </span>
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">{b.rows}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{b.panel} / {b.jodi}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1.5 sm:gap-2">
                      <button
                        onClick={() => restore(b.id, b.createdAt)}
                        disabled={busy === b.id}
                        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap"
                      >
                        {busy === b.id ? "Working…" : "↺ Restore"}
                      </button>
                      <button
                        onClick={() => remove(b.id, b.createdAt)}
                        disabled={busy === b.id}
                        className="bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
