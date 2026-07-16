import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { DEFAULT_MATKA_RATES } from "@/lib/matkaRates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Matka Rates Chart rates, stored in section_settings under "matka_rates"
// (content.rates = JSON array of 7 "1:N" strings). The public home page reads
// them through /api/public/section-settings.
const KEY = "matka_rates";

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const [row] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  let rates = DEFAULT_MATKA_RATES;
  try {
    const raw = (row?.content as Record<string, string> | undefined)?.rates;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === DEFAULT_MATKA_RATES.length) rates = parsed;
    }
  } catch { /* fall back to defaults */ }
  return NextResponse.json({ rates });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (
    !body ||
    !Array.isArray(body.rates) ||
    body.rates.length !== DEFAULT_MATKA_RATES.length ||
    !body.rates.every((r: unknown) => typeof r === "string" && /^1:\d{1,7}$/.test(r.trim()))
  ) {
    return NextResponse.json({ error: "Rates must be 7 values like 1:90" }, { status: 400 });
  }
  const rates = body.rates.map((r: string) => r.trim());
  const content = { rates: JSON.stringify(rates) };
  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  if (existing) {
    await db
      .update(sectionSettings)
      .set({ content: { ...(existing.content as Record<string, string>), ...content }, updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  } else {
    await db.insert(sectionSettings).values({ sectionKey: KEY, styles: {}, content });
  }
  return NextResponse.json({ rates });
}
