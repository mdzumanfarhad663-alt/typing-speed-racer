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
