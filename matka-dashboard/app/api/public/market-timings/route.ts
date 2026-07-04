import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { marketTimings } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const all = await db.select().from(marketTimings).orderBy(asc(marketTimings.position), asc(marketTimings.createdAt));
    return NextResponse.json({ marketTimings: all }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error("[public/market-timings] error", e);
    return NextResponse.json({ marketTimings: [], error: "db_unavailable" }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
