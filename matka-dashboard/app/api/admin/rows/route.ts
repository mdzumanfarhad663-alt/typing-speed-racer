import { NextResponse } from "next/server";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows, type Section } from "@/lib/schema";
import { getSession } from "@/lib/auth";

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

  const [{ value: nextPos }] = await db
    .select({ value: max(rows.position) })
    .from(rows)
    .where(eq(rows.section, body.section));
  const position = (nextPos ?? -1) + 1;

  const [inserted] = await db
    .insert(rows)
    .values({
      section: body.section,
      title: String(body.title).slice(0, 200),
      resultValue: String(body.resultValue ?? ""),
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
