import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, type PanelDay } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { syncJodiFromPanel } from "@/lib/syncJodi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function emptyDay(): PanelDay {
  return { open: "", jodi: "", close: "" };
}

function normalizeDays(raw: unknown): PanelDay[] {
  if (!Array.isArray(raw)) return Array.from({ length: 7 }, emptyDay);
  const arr: PanelDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = raw[i] || {};
    const c = (d as PanelDay).color;
    arr.push({
      open: String((d as PanelDay).open || "").slice(0, 6),
      jodi: String((d as PanelDay).jodi || "").slice(0, 4),
      close: String((d as PanelDay).close || "").slice(0, 6),
      color: typeof c === "string" && c.startsWith("#") ? c : "#000000",
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
    .from(panelEntries)
    .where(eq(panelEntries.rowId, rowId))
    .orderBy(asc(panelEntries.weekStart), asc(panelEntries.position));
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
    .select({ value: max(panelEntries.position) })
    .from(panelEntries)
    .where(eq(panelEntries.rowId, body.rowId));
  const position = (nextPos ?? -1) + 1;

  const [inserted] = await db
    .insert(panelEntries)
    .values({
      rowId: body.rowId,
      weekStart: body.weekStart,
      weekEnd: body.weekEnd,
      days: normalizeDays(body.days),
      position,
    })
    .returning();
  await syncJodiFromPanel(inserted.rowId, inserted.weekStart, inserted.weekEnd, inserted.days);
  return NextResponse.json({ entry: inserted });
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

  await db.delete(panelEntries).where(eq(panelEntries.rowId, body.rowId));
  return NextResponse.json({ ok: true });
}
