import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import type { PublicSectionsResponse } from "@/lib/types";
import { maybeAutoSync } from "@/lib/autoSync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Kick off a background scrape of the source site (throttled to once per 5s).
  maybeAutoSync();
  try {
    const all = await db.select().from(rows).orderBy(asc(rows.position), asc(rows.createdAt));
    const grouped: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [], live_update: [] };

    for (const r of all) {
      if (r.section in grouped) grouped[r.section as keyof PublicSectionsResponse].push(r);
    }

    // Any game in live_update that is NOT already in live_result (matched by title)
    // gets injected at the top of live_result so it shows in both sections.
    const liveResultTitles = new Set(
      grouped.live_result.map((r) => r.title.toLowerCase().trim())
    );
    for (const r of grouped.live_update) {
      if (!liveResultTitles.has(r.title.toLowerCase().trim())) {
        grouped.live_result.unshift(r); // add at top
        liveResultTitles.add(r.title.toLowerCase().trim());
      }
    }

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
