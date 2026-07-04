import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { marketTimings } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if ("marketName" in body) patch.marketName = String(body.marketName).slice(0, 100);
  if ("openTime" in body) patch.openTime = String(body.openTime).slice(0, 20);
  if ("closeTime" in body) patch.closeTime = String(body.closeTime).slice(0, 20);
  if ("status" in body) patch.status = String(body.status).slice(0, 30);
  if ("position" in body) patch.position = Number(body.position) || 0;

  const [updated] = await db.update(marketTimings).set(patch).where(eq(marketTimings.id, params.id)).returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ marketTiming: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  await db.delete(marketTimings).where(eq(marketTimings.id, params.id));
  return NextResponse.json({ ok: true });
}
