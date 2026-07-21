import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import type { PublicSectionsResponse } from "@/lib/types";
import { ensureRowsColumns } from "@/lib/ensureSchema";
import { applyScheduledLiveUpdates } from "@/lib/liveUpdateSchedule";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureRowsColumns();
    await applyScheduledLiveUpdates();
    const all = await db.select().from(rows).orderBy(asc(rows.position), asc(rows.createdAt));
    const grouped: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [], live_update: [] };

    for (const r of all) {
      if (r.section in grouped) grouped[r.section as keyof PublicSectionsResponse].push(r);
    }

    // Same game entered twice (e.g. manual + scraped, or differing case/spacing)
    // must show only once: keep the first occurrence per normalized title.
    const normTitle = (t: string) => t.toLowerCase().replace(/\s+/g, " ").trim();
    const dedupe = (list: typeof grouped.live_result) => {
      const seen = new Set<string>();
      return list.filter((r) => {
        const key = normTitle(r.title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    grouped.live_result = dedupe(grouped.live_result);
    grouped.live_update = dedupe(grouped.live_update);

    // Any game in live_update that is NOT already in live_result (matched by title)
    // gets injected at the top of live_result so it shows in both sections.
    const liveResultTitles = new Set(grouped.live_result.map((r) => normTitle(r.title)));
    for (const r of grouped.live_update) {
      if (!liveResultTitles.has(normTitle(r.title))) {
        grouped.live_result.unshift(r); // add at top
        liveResultTitles.add(normTitle(r.title));
      }
    }

    // Manual games always sort above auto-scraped ones within a section,
    // regardless of their stored position value.
    const manualFirst = (a: (typeof grouped.live_result)[number], b: (typeof grouped.live_result)[number]) => {
      const aScraped = a.source === "scraped" ? 1 : 0;
      const bScraped = b.source === "scraped" ? 1 : 0;
      if (aScraped !== bScraped) return aScraped - bScraped;
      return a.position - b.position;
    };
    grouped.live_result.sort(manualFirst);
    grouped.live_update.sort(manualFirst);

    return NextResponse.json(grouped, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error("[public/sections] error", e);
    return NextResponse.json(
      { lucky: [], live_result: [], free_zone: [], live_update: [], error: "db_unavailable" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
