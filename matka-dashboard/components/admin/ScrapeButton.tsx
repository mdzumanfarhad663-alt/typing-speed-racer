"use client";
import { useState } from "react";

export function ScrapeButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleScrape() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/scrape", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("done");
        setMessage(`✓ Updated ${data.upserted} of ${data.total} games`);
      } else {
        setStatus("error");
        setMessage(data.error ?? "Scrape failed — check server logs");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
    setTimeout(() => { setStatus("idle"); setMessage(""); }, 6000);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleScrape}
        disabled={status === "loading"}
        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white px-4 py-2 rounded font-semibold text-sm flex items-center gap-2"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Fetching from source…
          </>
        ) : (
          "↻ Refresh from Source"
        )}
      </button>
      {message && (
        <span className={`text-sm font-medium ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
