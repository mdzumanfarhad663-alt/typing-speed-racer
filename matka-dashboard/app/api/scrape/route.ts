import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { scrapeMainResults } from "@/lib/scraper";

export const maxDuration = 30;

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.SCRAPE_SECRET ?? "";
  const cronSecret = process.env.CRON_SECRET ?? "";
  // Accept manual trigger with SCRAPE_SECRET or Vercel cron with CRON_SECRET
  return (
    (secret.length > 0 && auth === `Bearer ${secret}`) ||
    (cronSecret.length > 0 && auth === `Bearer ${cronSecret}`)
  );
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = await scrapeMainResults();

  if (results.length === 0) {
    return NextResponse.json({ error: "scrape_failed", upserted: 0 });
  }

  let upserted = 0;
  const now = new Date();

  for (const r of results) {
    try {
      // Find existing scraped row with same sourceKey
      const existing = await db
        .select({ id: schema.rows.id })
        .from(schema.rows)
        .where(
          and(
            eq(schema.rows.source, "scraped"),
            eq(schema.rows.sourceKey, r.sourceKey)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update result value, time, and URLs
        await db
          .update(schema.rows)
          .set({
            resultValue: r.resultValue,
            timeRange: r.timeRange,
            leftTag: r.jodiUrl ? "Jodi" : undefined,
            rightTag: r.panelUrl ? "Panel" : undefined,
            extraLines: [
              ...(r.jodiUrl ? [`jodi_url:${r.jodiUrl}`] : []),
              ...(r.panelUrl ? [`panel_url:${r.panelUrl}`] : []),
            ],
            updatedAt: now,
          })
          .where(eq(schema.rows.id, existing[0].id));
      } else {
        // Insert new scraped row at the bottom of live_result section
        const maxPos = await db
          .select({ position: schema.rows.position })
          .from(schema.rows)
          .where(eq(schema.rows.section, "live_result"))
          .orderBy(schema.rows.position);

        const nextPos = maxPos.length > 0 ? maxPos[maxPos.length - 1].position + 1 : 0;

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

  // Cache the scraped results for public display
  try {
    await db
      .insert(schema.scrapedCache)
      .values({ key: "last_scrape", data: results as unknown as Record<string, unknown>[], scrapedAt: now })
      .onConflictDoUpdate({
        target: schema.scrapedCache.key,
        set: { data: results as unknown as Record<string, unknown>[], scrapedAt: now },
      });
  } catch (err) {
    console.error("cache update error", err);
  }

  return NextResponse.json({ ok: true, upserted, total: results.length, timestamp: now.toISOString() });
}

// Vercel Cron calls GET
export async function GET(req: Request) {
  return POST(req);
}
