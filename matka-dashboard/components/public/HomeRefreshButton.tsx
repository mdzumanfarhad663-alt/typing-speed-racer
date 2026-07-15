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
    <button
      onClick={refresh}
      disabled={busy}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "5px",
        zIndex: 50,
        backgroundColor: "white",
        color: "blue",
        borderWidth: "4px",
        borderColor: "red",
        borderStyle: "inset",
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: "large",
        borderRadius: "10px",
        padding: "1px 10px",
        cursor: "pointer",
      }}
    >
      {busy ? "Refreshing…" : "Refresh"}
    </button>
  );
}
