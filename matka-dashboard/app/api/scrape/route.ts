import { NextResponse } from "next/server";
import { eq, and, or, ilike } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { scrapeMainResults, scrapeMenu2Games } from "@/lib/scraper";

export const maxDuration = 30;

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.SCRAPE_SECRET ?? "";
  const cronSecret = process.env.CRON_SECRET ?? "";
  return (
    (secret.length > 0 && auth === `Bearer ${secret}`) ||
    (cronSecret.length > 0 && auth === `Bearer ${cronSecret}`)
  );
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [results, menu2] = await Promise.all([scrapeMainResults(), scrapeMenu2Games()]);

  if (results.length === 0) {
    return NextResponse.json({ error: "scrape_failed", upserted: 0 });
  }

  let upserted = 0;
  const now = new Date();

  for (const r of results) {
    try {
      const existing = await db
        .select({ id: schema.rows.id })
        .from(schema.rows)
        .where(
          or(
            and(eq(schema.rows.source, "scraped"), eq(schema.rows.sourceKey, r.sourceKey)),
            ilike(schema.rows.title, r.gameTitle.trim())
          )
        )
        .limit(1);

      const extraLines = [
        ...(r.jodiUrl ? [`jodi_url:${r.jodiUrl}`] : []),
        ...(r.panelUrl ? [`panel_url:${r.panelUrl}`] : []),
      ];

      if (existing.length > 0) {
        await db
          .update(schema.rows)
          .set({ resultValue: r.resultValue, timeRange: r.timeRange, leftTag: r.jodiUrl ? "Jodi" : null, rightTag: r.panelUrl ? "Panel" : null, extraLines, highlight: r.isHighlighted, source: "scraped", sourceKey: r.sourceKey, updatedAt: now })
          .where(eq(schema.rows.id, existing[0].id));
      } else {
        const allRows = await db.select({ position: schema.rows.position }).from(schema.rows).where(eq(schema.rows.section, "live_result")).orderBy(schema.rows.position);
        const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;
        await db.insert(schema.rows).values({
          section: "live_result", title: r.gameTitle, resultValue: r.resultValue, timeRange: r.timeRange,
          leftTag: r.jodiUrl ? "Jodi" : null, rightTag: r.panelUrl ? "Panel" : null, extraLines,
          color: "#0000ff", source: "scraped", sourceKey: r.sourceKey, position: nextPos, highlight: r.isHighlighted,
        });
      }
      upserted++;
    } catch (err) {
      console.error("upsert error for", r.sourceKey, err);
    }
  }

  try {
    await db.insert(schema.scrapedCache).values({ key: "last_scrape", data: results as unknown as Record<string, unknown>[], scrapedAt: now })
      .onConflictDoUpdate({ target: schema.scrapedCache.key, set: { data: results as unknown as Record<string, unknown>[], scrapedAt: now } });

    if (menu2.length > 0) {
      await db.insert(schema.scrapedCache).values({ key: "menu2", data: menu2 as unknown as Record<string, unknown>[], scrapedAt: now })
        .onConflictDoUpdate({ target: schema.scrapedCache.key, set: { data: menu2 as unknown as Record<string, unknown>[], scrapedAt: now } });
    }
  } catch (err) {
    console.error("cache update error", err);
  }

  return NextResponse.json({ ok: true, upserted, total: results.length, timestamp: now.toISOString() });
}

export async function GET(req: Request) {
  return POST(req);
}
