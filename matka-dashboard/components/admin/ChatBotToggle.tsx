"use client";
import { useEffect, useState } from "react";

// Dashboard card: on/off switches that hide or show the live chat bot and
// the Refresh button on the public home page.
export function ChatBotToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [refreshEnabled, setRefreshEnabled] = useState<boolean>(true);
  const [matkaPlayEnabled, setMatkaPlayEnabled] = useState<boolean>(true);
  const [saving, setSaving] = useState<"chat" | "refresh" | "matkaPlay" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/chatbot", { cache: "no-store" });
        if (res.ok) {
          const j = await res.json();
          setEnabled(j.enabled);
          setRefreshEnabled(j.refreshEnabled);
          setMatkaPlayEnabled(j.matkaPlayEnabled);
        }
      } catch { /* leave loading */ }
    })();
  }, []);

  async function save(patch: { enabled?: boolean; refreshEnabled?: boolean; matkaPlayEnabled?: boolean }, which: "chat" | "refresh" | "matkaPlay") {
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
        setMatkaPlayEnabled(j.matkaPlayEnabled);
      }
    } finally {
      setSaving(null);
    }
  }

  function ToggleRow({
    icon,
    title,
    desc,
    on,
    busy,
    onToggle,
  }: {
    icon: string;
    title: string;
    desc: string;
    on: boolean;
    busy: boolean;
    onToggle: () => void;
  }) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
          on ? "border-green-200 bg-green-50/60" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
            on ? "bg-green-100" : "bg-gray-200"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-800">{title}</div>
          <div className={`text-[11px] font-medium ${on ? "text-green-600" : "text-gray-400"}`}>
            {busy ? "Saving…" : on ? "Visible on home page" : desc}
          </div>
        </div>
        <button
          onClick={onToggle}
          disabled={busy}
          role="switch"
          aria-checked={on}
          className={`relative w-12 h-7 rounded-full shrink-0 transition-colors duration-200 disabled:opacity-60 ${
            on ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200 ${
              on ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 text-center" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
        <h2 className="font-bold text-base text-white">🏠 Home Page Widgets</h2>
        <p className="text-[11px] text-blue-100">Show or hide widgets on the public home page</p>
      </div>
      <div className="p-4">
        {enabled === null ? (
          <div className="text-gray-500 text-sm py-4 text-center">Loading…</div>
        ) : (
          <div className="space-y-3">
            <ToggleRow
              icon="🔄"
              title="Refresh Button"
              desc="Hidden from home page"
              on={refreshEnabled}
              busy={saving === "refresh"}
              onToggle={() => save({ refreshEnabled: !refreshEnabled }, "refresh")}
            />
            <ToggleRow
              icon="💬"
              title="Live Chat Bot"
              desc="Hidden from home page"
              on={enabled}
              busy={saving === "chat"}
              onToggle={() => {
                const next = !enabled;
                // Live Chat and Matka Play share the same bottom-left spot —
                // turning one on always turns the other off.
                save({ enabled: next, ...(next ? { matkaPlayEnabled: false } : {}) }, "chat");
              }}
            />
            <ToggleRow
              icon="🎲"
              title="Matka Play Button"
              desc="Hidden from home page"
              on={matkaPlayEnabled}
              busy={saving === "matkaPlay"}
              onToggle={() => {
                const next = !matkaPlayEnabled;
                save({ matkaPlayEnabled: next, ...(next ? { enabled: false } : {}) }, "matkaPlay");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
