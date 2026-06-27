"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuckyBand } from "@/components/public/LuckyBand";
import { LiveResultList } from "@/components/public/LiveResultList";
import { FreeZoneBlock } from "@/components/public/FreeZoneBlock";
import { RefreshIndicator } from "@/components/public/RefreshIndicator";
import type { PublicSectionsResponse } from "@/lib/types";

const EMPTY: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [] };

export default function Home() {
  const [data, setData] = useState<PublicSectionsResponse>(EMPTY);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/public/sections", { cache: "no-store" });
        const json = (await res.json()) as PublicSectionsResponse & { error?: string };
        if (!alive) return;
        setData({ lucky: json.lucky || [], live_result: json.live_result || [], free_zone: json.free_zone || [] });
        setLastUpdated(Date.now());
        setError(json.error ?? null);
      } catch (e) {
        if (alive) setError("network");
      }
    }
    load();
    const t = setInterval(load, 3000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 pb-12">
      <header className="bg-black text-white text-center py-2 text-xs flex justify-between px-4">
        <span>Matka Production System</span>
        <Link href="/admin" className="underline">Admin</Link>
      </header>
      {error && (
        <div className="bg-yellow-100 border-y border-yellow-400 text-center py-2 text-sm">
          {error === "db_unavailable" ? "Database not configured yet — admin will need to set POSTGRES_URL." : "Network error"}
        </div>
      )}
      <LuckyBand items={data.lucky} />
      <LiveResultList items={data.live_result} />
      <FreeZoneBlock items={data.free_zone} />
      <RefreshIndicator lastUpdated={lastUpdated} />
    </main>
  );
}
