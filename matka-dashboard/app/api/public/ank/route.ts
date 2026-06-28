import { NextResponse } from "next/server";
import { scrapeAnkData } from "@/lib/scraper";

export const revalidate = 120;

export async function GET() {
  try {
    const data = await scrapeAnkData();
    return NextResponse.json(
      { ank: data?.ank ?? "", finalAnk: data?.finalAnk ?? "" },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ ank: "", finalAnk: "" });
  }
}
