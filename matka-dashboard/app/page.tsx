"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroHeader } from "@/components/public/HeroHeader";
import { LuckyBand } from "@/components/public/LuckyBand";
import { LiveResultList } from "@/components/public/LiveResultList";
import { FreeZoneBlock } from "@/components/public/FreeZoneBlock";
import { Footer } from "@/components/public/Footer";
import { RefreshIndicator } from "@/components/public/RefreshIndicator";
import { LiveUpdateBand } from "@/components/public/LiveUpdateBand";
import type { PublicSectionsResponse } from "@/lib/types";

const EMPTY: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [] };

type Menu2Game = { gameTitle: string; resultValue: string; sourceKey: string };

export default function Home() {
  const [data, setData] = useState<PublicSectionsResponse>(EMPTY);
  const [menu2, setMenu2] = useState<Menu2Game[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const [sectionsRes, menu2Res] = await Promise.all([
          fetch("/api/public/sections", { cache: "no-store" }),
          fetch("/api/public/menu2", { cache: "no-store" }),
        ]);
        const json = (await sectionsRes.json()) as PublicSectionsResponse & { error?: string };
        const menu2Json = await menu2Res.json().catch(() => ({ games: [] }));
        if (!alive) return;
        setData({ lucky: json.lucky || [], live_result: json.live_result || [], free_zone: json.free_zone || [] });
        setMenu2(menu2Json.games || []);
        setLastUpdated(Date.now());
        setError(json.error ?? null);
      } catch {
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
      <HeroHeader />
      <LuckyBand items={data.lucky} />
      <LiveUpdateBand games={menu2} />
      <LiveResultList items={data.live_result} />
      <FreeZoneBlock items={data.free_zone} />
      <Footer />
      <RefreshIndicator lastUpdated={lastUpdated} />
    </main>
  );
}
