import { NextResponse } from "next/server";
import { and, asc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows, type Section } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { ensureRowsColumns } from "@/lib/ensureSchema";
import { normalizeResult } from "@/lib/pannaFix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_SECTIONS: Section[] = ["lucky", "live_result", "free_zone", "live_update"];

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  await ensureRowsColumns();
  const url = new URL(req.url);
  const section = url.searchParams.get("section") as Section | null;
  const query = db.select().from(rows).orderBy(asc(rows.position), asc(rows.createdAt));
  const all = section && VALID_SECTIONS.includes(section)
    ? await db.select().from(rows).where(eq(rows.section, section)).orderBy(asc(rows.position), asc(rows.createdAt))
    : await query;
  return NextResponse.json({ rows: all });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || !VALID_SECTIONS.includes(body.section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  // Manual rows use positions 0–9999 so they always appear above scraped rows (10000+)
  const [{ value: maxManualPos }] = await db
    .select({ value: max(rows.position) })
    .from(rows)
    .where(and(eq(rows.section, body.section), eq(rows.source, "manual")));
  const position = Math.min((maxManualPos ?? -1) + 1, 9999);

  const [inserted] = await db
    .insert(rows)
    .values({
      section: body.section,
      title: String(body.title).slice(0, 200),
      resultValue: normalizeResult(String(body.resultValue ?? "")),
      timeRange: body.timeRange ?? null,
      leftTag: body.leftTag ?? null,
      rightTag: body.rightTag ?? null,
      color: typeof body.color === "string" && body.color.startsWith("#") ? body.color : "#000000",
      extraLines: Array.isArray(body.extraLines) ? body.extraLines.map(String) : null,
      dateLabel: body.dateLabel ?? null,
      highlight: Boolean(body.highlight),
      position,
    })
    .returning();
  return NextResponse.json({ row: inserted });
}
