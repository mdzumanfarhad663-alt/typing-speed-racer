"use client";
import { useEffect, useState } from "react";

// Dashboard card: on/off switch that hides or shows the live chat bot
// on the public home page.
export function ChatBotToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/chatbot", { cache: "no-store" });
        if (res.ok) setEnabled((await res.json()).enabled);
      } catch { /* leave loading */ }
    })();
  }, []);

  async function toggle() {
    if (enabled === null || saving) return;
    const next = !enabled;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (res.ok) setEnabled(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg mb-1 text-center">💬 Live Chat Bot</h2>
      <p className="text-xs text-gray-500 mb-4 text-center">
        Show or hide the chat assistant on the home page.
      </p>
      {enabled === null ? (
        <div className="text-gray-500 text-sm py-2 text-center">Loading…</div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={toggle}
            disabled={saving}
            role="switch"
            aria-checked={enabled}
            className={`relative w-16 h-8 rounded-full transition-colors duration-200 disabled:opacity-60 ${
              enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-200 ${
                enabled ? "left-9" : "left-1"
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${enabled ? "text-green-600" : "text-gray-500"}`}>
            {saving ? "Saving…" : enabled ? "Visible on home page" : "Hidden from home page"}
          </span>
        </div>
      )}
    </div>
  );
}
