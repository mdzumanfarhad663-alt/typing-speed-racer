import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { jodiEntries, type JodiDay } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeDays(raw: unknown): JodiDay[] {
  if (!Array.isArray(raw)) return Array.from({ length: 7 }, () => ({ value: "", color: "#000000" }));
  const arr: JodiDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = (raw[i] || {}) as JodiDay;
    arr.push({
      value: String(d.value || "").slice(0, 4),
      color: typeof d.color === "string" && d.color.startsWith("#") ? d.color : "#000000",
    });
  }
  return arr;
}

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const url = new URL(req.url);
  const rowId = url.searchParams.get("rowId");
  if (!rowId) return NextResponse.json({ error: "rowId required" }, { status: 400 });
  const entries = await db
    .select()
    .from(jodiEntries)
    .where(eq(jodiEntries.rowId, rowId))
    .orderBy(asc(jodiEntries.weekStart), asc(jodiEntries.position));
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || !body.rowId || !body.weekStart || !body.weekEnd) {
    return NextResponse.json({ error: "rowId, weekStart, weekEnd required" }, { status: 400 });
  }
  const [{ value: nextPos }] = await db
    .select({ value: max(jodiEntries.position) })
    .from(jodiEntries)
    .where(eq(jodiEntries.rowId, body.rowId));
  const position = (nextPos ?? -1) + 1;
  const [inserted] = await db
    .insert(jodiEntries)
    .values({
      rowId: body.rowId,
      weekStart: body.weekStart,
      weekEnd: body.weekEnd,
      days: normalizeDays(body.days),
      position,
    })
    .returning();
  return NextResponse.json({ entry: inserted });
}

// Bulk-restore all weeks of a chart from a snapshot (used by undo/redo in the admin editor).
export async function PUT(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body?.rowId || !Array.isArray(body.entries)) {
    return NextResponse.json({ error: "rowId and entries required" }, { status: 400 });
  }

  type Snap = { weekStart?: string; weekEnd?: string; days?: unknown; position?: number };
  const values = (body.entries as Snap[])
    .filter((e) => e.weekStart && e.weekEnd)
    .map((e, i) => ({
      rowId: body.rowId as string,
      weekStart: e.weekStart as string,
      weekEnd: e.weekEnd as string,
      days: normalizeDays(e.days),
      position: typeof e.position === "number" ? e.position : i,
    }));

  await db.delete(jodiEntries).where(eq(jodiEntries.rowId, body.rowId));
  if (values.length > 0) {
    await db.insert(jodiEntries).values(values);
  }
  return NextResponse.json({ ok: true, count: values.length });
}

// Delete ALL weeks of a chart. Requires the admin password even with a valid session.
export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body?.rowId) return NextResponse.json({ error: "rowId required" }, { status: 400 });

  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const ok = hash && (await bcrypt.compare(body.password || "", hash));
  if (!ok) return NextResponse.json({ error: "wrong_password" }, { status: 403 });

  await db.delete(jodiEntries).where(eq(jodiEntries.rowId, body.rowId));
  return NextResponse.json({ ok: true });
}
