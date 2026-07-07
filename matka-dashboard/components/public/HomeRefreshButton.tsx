"use client";
import { useState } from "react";

// Fixed refresh button shown at the bottom of the homepage on all devices.
// Pulls the latest results from the source site, then reloads the page.
export function HomeRefreshButton() {
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/public/refresh", { cache: "no-store" });
    } catch { /* ignore — reload anyway */ }
    window.location.reload();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-end pointer-events-none pb-3 pr-3">
      <button
        onClick={refresh}
        disabled={busy}
        className="pointer-events-auto group relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:scale-95 disabled:cursor-wait text-white pl-3 pr-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2.5 shadow-xl shadow-black/40 ring-1 ring-white/20 transition-all duration-200"
      >
        <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform duration-500 ${busy ? "animate-spin" : "group-hover:rotate-180"}`}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </span>
        {busy ? "Refreshing…" : "Refresh"}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </div>
  );
}
