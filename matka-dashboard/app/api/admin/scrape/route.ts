import { NextResponse } from "next/server";
import { eq, and, or, ilike } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { scrapeMainResults } from "@/lib/scraper";

export const maxDuration = 30;

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = await scrapeMainResults();

  if (results.length === 0) {
    return NextResponse.json({ error: "scrape_failed", upserted: 0 }, { status: 502 });
  }

  let upserted = 0;
  const now = new Date();

  for (const r of results) {
    try {
      // Match by sourceKey (scraped rows) OR by title (manual rows) — avoids duplicates
      const existing = await db
        .select({ id: schema.rows.id, source: schema.rows.source })
        .from(schema.rows)
        .where(
          or(
            and(
              eq(schema.rows.source, "scraped"),
              eq(schema.rows.sourceKey, r.sourceKey)
            ),
            ilike(schema.rows.title, r.gameTitle.trim())
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update result value and time on whichever row was found
        await db
          .update(schema.rows)
          .set({
            resultValue: r.resultValue,
            timeRange: r.timeRange,
            source: "scraped",
            sourceKey: r.sourceKey,
            updatedAt: now,
          })
          .where(eq(schema.rows.id, existing[0].id));
      } else {
        // New game — insert it
        const allRows = await db
          .select({ position: schema.rows.position })
          .from(schema.rows)
          .where(eq(schema.rows.section, "live_result"))
          .orderBy(schema.rows.position);

        const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;

        await db.insert(schema.rows).values({
          section: "live_result",
          title: r.gameTitle,
          resultValue: r.resultValue,
          timeRange: r.timeRange,
          leftTag: r.jodiUrl ? "Jodi" : null,
          rightTag: r.panelUrl ? "Panel" : null,
          extraLines: [
            ...(r.jodiUrl ? [`jodi_url:${r.jodiUrl}`] : []),
            ...(r.panelUrl ? [`panel_url:${r.panelUrl}`] : []),
          ],
          color: "#0000ff",
          source: "scraped",
          sourceKey: r.sourceKey,
          position: nextPos,
          highlight: false,
        });
      }
      upserted++;
    } catch (err) {
      console.error("upsert error for", r.sourceKey, err);
    }
  }

  // Cache scraped results for public API
  try {
    await db
      .insert(schema.scrapedCache)
      .values({
        key: "last_scrape",
        data: results as unknown as Record<string, unknown>[],
        scrapedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.scrapedCache.key,
        set: {
          data: results as unknown as Record<string, unknown>[],
          scrapedAt: now,
        },
      });
  } catch (err) {
    console.error("cache update error", err);
  }

  return NextResponse.json({ ok: true, upserted, total: results.length, timestamp: now.toISOString() });
}
