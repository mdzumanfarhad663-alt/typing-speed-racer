"use client";
import { useEffect, useState } from "react";
import { HeroHeader } from "@/components/public/HeroHeader";
import { AnnouncementBox } from "@/components/public/AnnouncementBox";
import { LuckyBand } from "@/components/public/LuckyBand";
import { LiveUpdateBand } from "@/components/public/LiveUpdateBand";
import { PromoBlock } from "@/components/public/PromoBlock";
import { ContactForumSection } from "@/components/public/ContactForumSection";
import { TopGuessers } from "@/components/public/TopGuessers";
import { ChartRecords } from "@/components/public/ChartRecords";
import { SattaMatkaInfo } from "@/components/public/SattaMatkaInfo";
import { FaqSection } from "@/components/public/FaqSection";
import { MainFooter } from "@/components/public/MainFooter";
import { LiveResultList } from "@/components/public/LiveResultList";
import { HomeRefreshButton } from "@/components/public/HomeRefreshButton";
import { ChatBot } from "@/components/public/ChatBot";
import type { PublicSectionsResponse } from "@/lib/types";
import { makeResolver, type SectionSettingsMap } from "@/lib/resolveStyle";
import type { MarketTiming } from "@/lib/schema";

const EMPTY: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [], live_update: [] };
type AnkData = { ank: string; finalAnk: string } | null;

export default function Home() {
  const [data, setData] = useState<PublicSectionsResponse>(EMPTY);
  const [ankData, setAnkData] = useState<AnkData>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SectionSettingsMap>({});
  const [marketTimings, setMarketTimings] = useState<MarketTiming[]>([]);

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

    // Pull fresh results from the source site into our DB. The browser holds this
    // request open until the scrape finishes, keeping the serverless function alive
    // (fire-and-forget on the server gets killed on Vercel). Throttled to 5s server-side.
    async function triggerRefresh() {
      try { await fetch("/api/public/refresh", { cache: "no-store" }); } catch { /* silent */ }
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

    async function loadMarketTimings() {
      try {
        const res = await fetch("/api/public/market-timings", { cache: "no-store" });
        const json = await res.json();
        if (alive) setMarketTimings(json.marketTimings || []);
      } catch { /* silent — falls back to defaults */ }
    }

    triggerRefresh();
    load();
    loadAnk();
    loadSettings();
    loadMarketTimings();
    // Trigger a source-site scrape every 5s so results stay live whenever the
    // public page is open — no admin dashboard required.
    const refreshTimer = setInterval(triggerRefresh, 5000);
    const t = setInterval(load, 5000); // re-read the freshly-synced DB
    const ankTimer = setInterval(loadAnk, 120_000); // refresh ank every 2 min
    const settingsTimer = setInterval(loadSettings, 3000);
    const marketTimer = setInterval(loadMarketTimings, 30_000);
    // Refresh button: re-read everything in place instead of reloading the page
    // (a full reload flashes the default design before admin styles load).
    const onManualRefresh = () => { load(); loadAnk(); loadSettings(); loadMarketTimings(); };
    window.addEventListener("home:refresh", onManualRefresh);
    return () => { alive = false; clearInterval(refreshTimer); clearInterval(t); clearInterval(ankTimer); clearInterval(settingsTimer); clearInterval(marketTimer); window.removeEventListener("home:refresh", onManualRefresh); };
  }, []);

  const resolve = makeResolver(settings);
  // Admin toggles (💬 Live Chat Bot card): hidden only when explicitly turned off.
  const chatEnabled = settings["chatbot"]?.content?.enabled !== "false";
  const refreshEnabled = settings["chatbot"]?.content?.refreshEnabled !== "false";

  return (
    <main className="min-h-screen pb-12 px-2 sm:px-4" style={{ background: "#f5f5f0" }}>
      {error && (
        <div className="bg-yellow-100 border-y border-yellow-400 text-center py-2 text-sm">
          {error === "db_unavailable" ? "Database not configured yet." : "Network error"}
        </div>
      )}
      <HeroHeader resolve={resolve} />
      <AnnouncementBox resolve={resolve} />
      <LuckyBand items={data.lucky} ankData={ankData} resolve={resolve} />
      <LiveUpdateBand items={data.live_update} resolve={resolve} />
      <PromoBlock resolve={resolve} />
      <LiveResultList items={data.live_result} resolve={resolve} />
      <ContactForumSection resolve={resolve} />
      <TopGuessers resolve={resolve} />
      <ChartRecords resolve={resolve} />
      <SattaMatkaInfo resolve={resolve} marketTimings={marketTimings} />
      <FaqSection resolve={resolve} />
      <MainFooter resolve={resolve} />
      {refreshEnabled && <HomeRefreshButton />}
      {chatEnabled && <ChatBot games={[...data.live_result, ...data.live_update]} timings={marketTimings} ank={ankData} />}
    </main>
  );
}
