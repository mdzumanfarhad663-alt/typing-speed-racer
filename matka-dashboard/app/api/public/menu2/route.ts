import { NextResponse } from "next/server";
import { scrapeMenu2Games } from "@/lib/scraper";

// Revalidate every 60 seconds — live scrape, no DB needed
export const revalidate = 60;

export async function GET() {
  try {
    const games = await scrapeMenu2Games();
    return NextResponse.json(
      { games, scrapedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" } }
    );
  } catch {
    return NextResponse.json({ games: [], scrapedAt: null });
  }
}
