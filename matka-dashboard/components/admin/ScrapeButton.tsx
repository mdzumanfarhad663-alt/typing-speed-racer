"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const AUTO_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

export function ScrapeButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(AUTO_INTERVAL_MS / 1000);
  const statusRef = useRef(status);
  statusRef.current = status;

  const handleScrape = useCallback(async () => {
    if (statusRef.current === "loading") return;
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
  }, []);

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleScrape();
      setCountdown(AUTO_INTERVAL_MS / 1000);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [handleScrape]);

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? AUTO_INTERVAL_MS / 1000 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = String(countdown % 60).padStart(2, "0");

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
      <span className="text-xs text-gray-500">
        Auto-refresh in {mins}:{secs}
      </span>
      {message && (
        <span className={`text-sm font-medium ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
