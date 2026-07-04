"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroHeader } from "@/components/public/HeroHeader";
import { LuckyBand } from "@/components/public/LuckyBand";
import { LiveUpdateBand } from "@/components/public/LiveUpdateBand";
import { PromoBlock } from "@/components/public/PromoBlock";
import { ContactForumSection } from "@/components/public/ContactForumSection";
import { WeeklyCharts } from "@/components/public/WeeklyCharts";
import { TopGuessers } from "@/components/public/TopGuessers";
import { ChartRecords } from "@/components/public/ChartRecords";
import { SattaMatkaInfo } from "@/components/public/SattaMatkaInfo";
import { FaqSection } from "@/components/public/FaqSection";
import { MainFooter } from "@/components/public/MainFooter";
import { LiveResultList } from "@/components/public/LiveResultList";
import { RefreshIndicator } from "@/components/public/RefreshIndicator";
import type { PublicSectionsResponse } from "@/lib/types";
import { makeResolver, type SectionSettingsMap } from "@/lib/resolveStyle";

const EMPTY: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [], live_update: [] };
type AnkData = { ank: string; finalAnk: string } | null;

export default function Home() {
  const [data, setData] = useState<PublicSectionsResponse>(EMPTY);
  const [ankData, setAnkData] = useState<AnkData>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SectionSettingsMap>({});

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/public/sections", { cache: "no-store" });
        const json = (await res.json()) as PublicSectionsResponse & { error?: string };
        if (!alive) return;
        setData({
          lucky: json.lucky || [],
          live_result: json.live_result || [],
          free_zone: json.free_zone || [],
          live_update: json.live_update || [],
        });
        setLastUpdated(Date.now());
        setError(json.error ?? null);
      } catch {
        if (alive) setError("network");
      }
    }

    async function loadAnk() {
      try {
        const res = await fetch("/api/public/ank", { cache: "no-store" });
        const json = await res.json();
        if (alive && (json.ank || json.finalAnk)) setAnkData(json);
      } catch { /* silent */ }
    }

    async function loadSettings() {
      try {
        const res = await fetch("/api/public/section-settings", { cache: "no-store" });
        const json = await res.json();
        if (alive) setSettings(json);
      } catch { /* silent — components fall back to defaults */ }
    }

    load();
    loadAnk();
    loadSettings();
    const t = setInterval(load, 3000);
    const ankTimer = setInterval(loadAnk, 120_000); // refresh ank every 2 min
    const settingsTimer = setInterval(loadSettings, 3000);
    return () => { alive = false; clearInterval(t); clearInterval(ankTimer); clearInterval(settingsTimer); };
  }, []);

  const resolve = makeResolver(settings);

  return (
    <main className="min-h-screen pb-12 px-2 sm:px-4" style={{ background: "#f5f5f0" }}>
      <header className="bg-black text-white text-center py-2 text-xs flex justify-between px-4">
        <span>Matka Production System</span>
        <Link href="/admin" className="underline">Admin</Link>
      </header>
      {error && (
        <div className="bg-yellow-100 border-y border-yellow-400 text-center py-2 text-sm">
          {error === "db_unavailable" ? "Database not configured yet." : "Network error"}
        </div>
      )}
      <HeroHeader resolve={resolve} />
      <LuckyBand items={data.lucky} ankData={ankData} resolve={resolve} />
      <LiveUpdateBand items={data.live_update} resolve={resolve} />
      <PromoBlock resolve={resolve} />
      <LiveResultList items={data.live_result} resolve={resolve} />
      <ContactForumSection resolve={resolve} />
      <WeeklyCharts resolve={resolve} />
      <TopGuessers resolve={resolve} />
      <ChartRecords resolve={resolve} />
      <SattaMatkaInfo resolve={resolve} />
      <FaqSection resolve={resolve} />
      <MainFooter resolve={resolve} />
      <RefreshIndicator lastUpdated={lastUpdated} />
    </main>
  );
}
