"use client";
import { useEffect, useState } from "react";

export function RefreshIndicator({ lastUpdated }: { lastUpdated: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const secs = Math.max(0, Math.floor((now - lastUpdated) / 1000));
  return <div className="refresh-chip">Updated {secs}s ago • auto-refresh 3s</div>;
}
