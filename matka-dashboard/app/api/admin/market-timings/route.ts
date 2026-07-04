import { NextResponse } from "next/server";
import { asc, max } from "drizzle-orm";
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

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const all = await db.select().from(marketTimings).orderBy(asc(marketTimings.position), asc(marketTimings.createdAt));
  return NextResponse.json({ marketTimings: all });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || !body.marketName || typeof body.marketName !== "string") {
    return NextResponse.json({ error: "Market name required" }, { status: 400 });
  }

  const [{ value: maxPos }] = await db.select({ value: max(marketTimings.position) }).from(marketTimings);
  const position = (maxPos ?? -1) + 1;

  const [inserted] = await db
    .insert(marketTimings)
    .values({
      marketName: String(body.marketName).slice(0, 100),
      openTime: String(body.openTime ?? "").slice(0, 20),
      closeTime: String(body.closeTime ?? "").slice(0, 20),
      status: String(body.status ?? "Daily").slice(0, 30),
      position,
    })
    .returning();
  return NextResponse.json({ marketTiming: inserted });
}
