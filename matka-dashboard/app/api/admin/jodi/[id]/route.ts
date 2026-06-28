import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if ("weekStart" in body) patch.weekStart = body.weekStart;
  if ("weekEnd" in body) patch.weekEnd = body.weekEnd;
  if ("days" in body) patch.days = normalizeDays(body.days);
  if ("position" in body) patch.position = Number(body.position) || 0;
  const [updated] = await db.update(jodiEntries).set(patch).where(eq(jodiEntries.id, params.id)).returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  await db.delete(jodiEntries).where(eq(jodiEntries.id, params.id));
  return NextResponse.json({ ok: true });
}
