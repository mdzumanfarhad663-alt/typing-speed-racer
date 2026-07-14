"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-renders the server component tree on an interval so server-fetched data
// stays live, mirroring the home page's 5s polling. Also pings the scrape
// endpoint (throttled 5s server-side) so results keep syncing while open.
export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    async function tick() {
      try { await fetch("/api/public/refresh", { cache: "no-store" }); } catch { /* silent */ }
      if (alive) router.refresh();
    }
    const timer = setInterval(tick, intervalMs);
    return () => { alive = false; clearInterval(timer); };
  }, [router, intervalMs]);

  return null;
}
