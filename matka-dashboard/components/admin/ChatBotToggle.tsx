"use client";
import { useEffect, useState } from "react";

// Dashboard card: on/off switches that hide or show the live chat bot and
// the Refresh button on the public home page.
export function ChatBotToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [refreshEnabled, setRefreshEnabled] = useState<boolean>(true);
  const [saving, setSaving] = useState<"chat" | "refresh" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/chatbot", { cache: "no-store" });
        if (res.ok) {
          const j = await res.json();
          setEnabled(j.enabled);
          setRefreshEnabled(j.refreshEnabled);
        }
      } catch { /* leave loading */ }
    })();
  }, []);

  async function save(patch: { enabled?: boolean; refreshEnabled?: boolean }, which: "chat" | "refresh") {
    setSaving(which);
    try {
      const res = await fetch("/api/admin/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const j = await res.json();
        setEnabled(j.enabled);
        setRefreshEnabled(j.refreshEnabled);
      }
    } finally {
      setSaving(null);
    }
  }

  function Switch({ on, busy, onToggle }: { on: boolean; busy: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        disabled={busy}
        role="switch"
        aria-checked={on}
        className={`relative w-16 h-8 rounded-full transition-colors duration-200 disabled:opacity-60 ${
          on ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-200 ${
            on ? "left-9" : "left-1"
          }`}
        />
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg mb-1 text-center">💬 Live Chat Bot</h2>
      <p className="text-xs text-gray-500 mb-4 text-center">
        Show or hide home page widgets.
      </p>
      {enabled === null ? (
        <div className="text-gray-500 text-sm py-2 text-center">Loading…</div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-gray-700">💬 Live Chat</span>
            <Switch on={enabled} busy={saving === "chat"} onToggle={() => save({ enabled: !enabled }, "chat")} />
            <span className={`text-sm font-semibold ${enabled ? "text-green-600" : "text-gray-500"}`}>
              {saving === "chat" ? "Saving…" : enabled ? "Visible on home page" : "Hidden from home page"}
            </span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-gray-700">🔄 Refresh Button</span>
            <Switch on={refreshEnabled} busy={saving === "refresh"} onToggle={() => save({ refreshEnabled: !refreshEnabled }, "refresh")} />
            <span className={`text-sm font-semibold ${refreshEnabled ? "text-green-600" : "text-gray-500"}`}>
              {saving === "refresh" ? "Saving…" : refreshEnabled ? "Visible on home page" : "Hidden from home page"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
