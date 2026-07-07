"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const INTERVAL_SECS = 5; // auto-refresh every 5 seconds

export function ScrapeButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(INTERVAL_SECS);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Guard against overlapping requests — a scrape can take longer than the interval
  const inFlight = useRef(false);

  const handleScrape = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/scrape", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("done");
        setMessage(`✓ Updated ${data.upserted} of ${data.total} games`);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setStatus("error");
        setMessage(data.error === "unauthorized" ? "Session expired — please log in again" : data.error ?? "Scrape failed");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    } finally {
      inFlight.current = false;
    }
  }, []);

  // Single 1s ticker: fires a scrape whenever the countdown reaches 0.
  // If a scrape is still running, the countdown resets and it tries again next cycle.
  useEffect(() => {
    let secs = INTERVAL_SECS;
    setCountdown(secs);

    const tick = setInterval(() => {
      secs -= 1;
      if (secs <= 0) {
        secs = INTERVAL_SECS;
        handleScrape();
      }
      setCountdown(secs);
    }, 1000);

    return () => clearInterval(tick);
  }, [handleScrape]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleScrape}
        disabled={status === "loading"}
        className="group relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:scale-95 disabled:cursor-wait text-white pl-3 pr-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-900/30 ring-1 ring-white/20 transition-all duration-200"
      >
        <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform duration-500 ${status === "loading" ? "animate-spin" : "group-hover:rotate-180"}`}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </span>
        {status === "loading" ? "Fetching from source…" : "Refresh from Source"}
        {/* sheen sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
      <span className="text-xs text-gray-500">
        Auto-refresh in {countdown}s{lastUpdated ? ` · last updated ${lastUpdated}` : ""}
      </span>
      {message && (
        <span className={`text-sm font-medium ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
