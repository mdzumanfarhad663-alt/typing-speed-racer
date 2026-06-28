import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(schema.scrapedCache)
      .where(eq(schema.scrapedCache.key, "last_scrape"))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ results: [], scrapedAt: null });
    }

    return NextResponse.json({
      results: rows[0].data,
      scrapedAt: rows[0].scrapedAt,
    });
  } catch {
    return NextResponse.json({ results: [], scrapedAt: null });
  }
}
