import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { parseRateRows, type MatkaRateRow } from "@/lib/matkaRates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Matka Rates Chart rows, stored in section_settings under "matka_rates"
// (content.rows = JSON array of {game, rate}). The public home page reads
// them through /api/public/section-settings.
const KEY = "matka_rates";
const MAX_ROWS = 30;

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const [row] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  return NextResponse.json({ rows: parseRateRows(row?.content as Record<string, string> | undefined) });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const rows = body?.rows;
  if (
    !Array.isArray(rows) ||
    rows.length === 0 ||
    rows.length > MAX_ROWS ||
    !rows.every(
      (r: MatkaRateRow) =>
        r &&
        typeof r.game === "string" &&
        r.game.trim().length > 0 &&
        r.game.trim().length <= 60 &&
        typeof r.rate === "string" &&
        /^1:\d{1,7}$/.test(r.rate.trim())
    )
  ) {
    return NextResponse.json({ error: "Each row needs a game name and a rate like 1:90" }, { status: 400 });
  }
  const clean: MatkaRateRow[] = rows.map((r: MatkaRateRow) => ({ game: r.game.trim(), rate: r.rate.trim() }));
  const content = { rows: JSON.stringify(clean) };
  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  if (existing) {
    await db
      .update(sectionSettings)
      .set({ content: { ...(existing.content as Record<string, string>), ...content }, updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  } else {
    await db.insert(sectionSettings).values({ sectionKey: KEY, styles: {}, content });
  }
  return NextResponse.json({ rows: clean });
}
