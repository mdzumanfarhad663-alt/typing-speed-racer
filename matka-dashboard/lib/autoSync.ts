import { eq, and, or, ilike, notInArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { scrapeMainResults, scrapeMenu2Games, scrapeAnkData } from "@/lib/scraper";

async function upsertLiveUpdateGame(r: { gameTitle: string; resultValue: string; sourceKey: string; timeRange?: string | null }, now: Date) {
  const existing = await db
    .select({ id: schema.rows.id })
    .from(schema.rows)
    .where(
      or(
        and(eq(schema.rows.source, "scraped"), eq(schema.rows.section, "live_update"), eq(schema.rows.sourceKey, r.sourceKey)),
        and(eq(schema.rows.section, "live_update"), ilike(schema.rows.title, r.gameTitle.trim()))
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db.update(schema.rows)
      .set({ resultValue: r.resultValue, timeRange: r.timeRange ?? null, source: "scraped", sourceKey: r.sourceKey, updatedAt: now })
      .where(eq(schema.rows.id, existing[0].id));
  } else {
    const allRows = await db.select({ position: schema.rows.position }).from(schema.rows)
      .where(eq(schema.rows.section, "live_update")).orderBy(schema.rows.position);
    const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;
    await db.insert(schema.rows).values({
      section: "live_update", title: r.gameTitle, resultValue: r.resultValue, timeRange: r.timeRange ?? null,
      color: "#0000ff", source: "scraped", sourceKey: r.sourceKey, position: nextPos, highlight: false,
    });
  }
}

/** Scrapes the source site and upserts everything into the DB. */
export async function runFullSync(): Promise<{ ok: boolean; upserted: number; total: number; menu2Count: number; error?: string }> {
  const [results, menu2Games, ankData] = await Promise.all([
    scrapeMainResults(), scrapeMenu2Games(), scrapeAnkData(),
  ]);

  if (results.length === 0) {
    return { ok: false, upserted: 0, total: 0, menu2Count: 0, error: "scrape_failed" };
  }

  let upserted = 0;
  const now = new Date();

  // Upsert main live results
  for (const r of results) {
    try {
      const existing = await db.select({ id: schema.rows.id }).from(schema.rows)
        .where(or(
          and(eq(schema.rows.source, "scraped"), eq(schema.rows.sourceKey, r.sourceKey)),
          ilike(schema.rows.title, r.gameTitle.trim())
        )).limit(1);

      const extraLines = [
        ...(r.jodiUrl ? [`jodi_url:${r.jodiUrl}`] : []),
        ...(r.panelUrl ? [`panel_url:${r.panelUrl}`] : []),
      ];

      if (existing.length > 0) {
        await db.update(schema.rows).set({
          resultValue: r.resultValue, timeRange: r.timeRange,
          leftTag: r.jodiUrl ? "Jodi" : null, rightTag: r.panelUrl ? "Panel" : null,
          extraLines, source: "scraped", sourceKey: r.sourceKey, highlight: r.isHighlighted, updatedAt: now,
        }).where(eq(schema.rows.id, existing[0].id));
      } else {
        const allRows = await db.select({ position: schema.rows.position }).from(schema.rows)
          .where(eq(schema.rows.section, "live_result")).orderBy(schema.rows.position);
        const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;
        await db.insert(schema.rows).values({
          section: "live_result", title: r.gameTitle, resultValue: r.resultValue,
          timeRange: r.timeRange, leftTag: r.jodiUrl ? "Jodi" : null, rightTag: r.panelUrl ? "Panel" : null,
          extraLines, color: "#0000ff", source: "scraped", sourceKey: r.sourceKey, position: nextPos, highlight: r.isHighlighted,
        });
      }
      upserted++;
    } catch (err) { console.error("upsert error for", r.sourceKey, err); }
  }

  // Sync positions to match source site order.
  // Scraped rows use positions 10000+ (index-based), manual rows stay below 10000
  // so they always appear first in the list.
  for (let idx = 0; idx < results.length; idx++) {
    try {
      await db.update(schema.rows)
        .set({ position: 10000 + idx })
        .where(and(
          eq(schema.rows.source, "scraped"),
          eq(schema.rows.sourceKey, results[idx].sourceKey)
        ));
    } catch (err) { console.error("position sync error", results[idx].sourceKey, err); }
  }

  // Upsert live_update games (menu2) — only scraped ones, manual ones are untouched.
  // menu2 has no time, so borrow the time range from the matching main result by title.
  const timeByTitle = new Map(results.map((r) => [r.gameTitle.trim().toLowerCase(), r.timeRange]));
  for (const g of menu2Games) {
    try {
      await upsertLiveUpdateGame({ ...g, timeRange: timeByTitle.get(g.gameTitle.trim().toLowerCase()) ?? null }, now);
    } catch (err) { console.error("live_update upsert error", err); }
  }

  // Remove scraped live_update rows that are no longer in the source site's menu2
  // (keeps manual rows untouched)
  try {
    const currentKeys = menu2Games.map((g) => g.sourceKey);
    if (currentKeys.length > 0) {
      await db.delete(schema.rows).where(
        and(
          eq(schema.rows.section, "live_update"),
          eq(schema.rows.source, "scraped"),
          notInArray(schema.rows.sourceKey, currentKeys)
        )
      );
    }
    // Source returned 0 games — don't wipe everything, could be a failed scrape
  } catch (err) { console.error("live_update cleanup error", err); }

  // Cache ank data
  if (ankData) {
    try {
      await db.insert(schema.scrapedCache)
        .values({ key: "ank_data", data: ankData as unknown as Record<string, unknown>, scrapedAt: now })
        .onConflictDoUpdate({ target: schema.scrapedCache.key, set: { data: ankData as unknown as Record<string, unknown>, scrapedAt: now } });
    } catch (err) { console.error("ank cache error", err); }
  }

  return { ok: true, upserted, total: results.length, menu2Count: menu2Games.length };
}

// ---- Background auto-sync (server-driven, no admin tab required) ----

const AUTO_SYNC_INTERVAL_MS = 5_000;

let lastSyncAt = 0;
let inFlight: Promise<void> | null = null;

/**
 * Throttled sync that the caller can AWAIT. If the last sync finished less than
 * AUTO_SYNC_INTERVAL_MS ago, resolves immediately without scraping. If a sync is
 * already running, awaits that same one instead of starting a second. Never throws.
 *
 * Because the caller (a browser fetch) keeps the connection open until this
 * resolves, the serverless function stays alive long enough for the scrape to
 * finish — unlike fire-and-forget, which Vercel tears down after the response.
 */
export async function maybeAutoSync(): Promise<void> {
  if (inFlight) return inFlight;
  if (Date.now() - lastSyncAt < AUTO_SYNC_INTERVAL_MS) return;

  inFlight = runFullSync()
    .then(() => undefined)
    .catch((err) => console.error("[autoSync] failed", err))
    .finally(() => {
      lastSyncAt = Date.now();
      inFlight = null;
    });
  return inFlight;
}
