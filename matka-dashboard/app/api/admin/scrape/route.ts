import { NextResponse } from "next/server";
import { eq, and, or, ilike } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { scrapeMainResults, scrapeMenu2Games, scrapeAnkData } from "@/lib/scraper";

export const maxDuration = 30;

async function upsertLiveUpdateGame(r: { gameTitle: string; resultValue: string; sourceKey: string }, now: Date) {
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
      .set({ resultValue: r.resultValue, source: "scraped", sourceKey: r.sourceKey, updatedAt: now })
      .where(eq(schema.rows.id, existing[0].id));
  } else {
    const allRows = await db.select({ position: schema.rows.position }).from(schema.rows)
      .where(eq(schema.rows.section, "live_update")).orderBy(schema.rows.position);
    const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;
    await db.insert(schema.rows).values({
      section: "live_update", title: r.gameTitle, resultValue: r.resultValue,
      color: "#0000ff", source: "scraped", sourceKey: r.sourceKey, position: nextPos, highlight: false,
    });
  }
}

export async function POST() {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [results, menu2Games, ankData] = await Promise.all([
    scrapeMainResults(), scrapeMenu2Games(), scrapeAnkData(),
  ]);

  if (results.length === 0) {
    return NextResponse.json({ error: "scrape_failed", upserted: 0 }, { status: 502 });
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
          extraLines, source: "scraped", sourceKey: r.sourceKey, updatedAt: now,
        }).where(eq(schema.rows.id, existing[0].id));
      } else {
        const allRows = await db.select({ position: schema.rows.position }).from(schema.rows)
          .where(eq(schema.rows.section, "live_result")).orderBy(schema.rows.position);
        const nextPos = allRows.length > 0 ? allRows[allRows.length - 1].position + 1 : 0;
        await db.insert(schema.rows).values({
          section: "live_result", title: r.gameTitle, resultValue: r.resultValue,
          timeRange: r.timeRange, leftTag: r.jodiUrl ? "Jodi" : null, rightTag: r.panelUrl ? "Panel" : null,
          extraLines, color: "#0000ff", source: "scraped", sourceKey: r.sourceKey, position: nextPos, highlight: false,
        });
      }
      upserted++;
    } catch (err) { console.error("upsert error for", r.sourceKey, err); }
  }

  // Upsert live_update games (menu2) — only scraped ones, manual ones are untouched
  for (const g of menu2Games) {
    try { await upsertLiveUpdateGame(g, now); } catch (err) { console.error("live_update upsert error", err); }
  }

  // Cache ank data
  if (ankData) {
    try {
      await db.insert(schema.scrapedCache)
        .values({ key: "ank_data", data: ankData as unknown as Record<string, unknown>, scrapedAt: now })
        .onConflictDoUpdate({ target: schema.scrapedCache.key, set: { data: ankData as unknown as Record<string, unknown>, scrapedAt: now } });
    } catch (err) { console.error("ank cache error", err); }
  }

  return NextResponse.json({ ok: true, upserted, total: results.length, menu2Count: menu2Games.length, timestamp: now.toISOString() });
}
