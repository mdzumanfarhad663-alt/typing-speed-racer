import "dotenv/config";
import { db } from "../lib/db";
import { rows } from "../lib/schema";

async function main() {
  console.log("Clearing existing rows...");
  await db.delete(rows);

  console.log("Seeding sample data...");
  await db.insert(rows).values([
    // Lucky
    { section: "lucky", title: "Ank (शुभांक)", resultValue: "0-4-6-7", color: "#d00000", position: 0 },
    { section: "lucky", title: "Final Ank", resultValue: "K-0, M-*", color: "#d00000", position: 1 },
    // Live result
    { section: "live_result", title: "RAJA-RANI MORNING", resultValue: "267-59-469", timeRange: "(09:40 - 10:40)", leftTag: "Jodi", rightTag: "Panel", color: "#00a000", position: 0 },
    { section: "live_result", title: "RATAN MORNING", resultValue: "230-52-147", timeRange: "(10:00 - 11:00)", leftTag: "Jodi", rightTag: "Panel", color: "#8b008b", position: 1 },
    { section: "live_result", title: "KARNATAKA DAY", resultValue: "458-73-139", timeRange: "(10:00 - 11:00)", leftTag: "Jodi", rightTag: "Panel", color: "#8b3a3a", position: 2 },
    { section: "live_result", title: "KALYAN MORNING", resultValue: "459-80-460", timeRange: "(11:40 - 12:40 PM)", leftTag: "Jodi", rightTag: "Panel", color: "#0066cc", position: 3, highlight: true },
    { section: "live_result", title: "MINI MILAN", resultValue: "469-95-249", timeRange: "(11:35) - (12:35)", leftTag: "Jodi", rightTag: "Panel", color: "#d00000", position: 4 },
    { section: "live_result", title: "DHAN EXPRESS", resultValue: "480-21-588", timeRange: "(11:00 )- - (01:00 )", leftTag: "Jodi", rightTag: "Panel", color: "#006400", position: 5 },
    { section: "live_result", title: "{ASHA BAZAR}", resultValue: "100-15-267", timeRange: "{__ 11:-15__} - {__12:-15__}", leftTag: "Jodi", rightTag: "Panel", color: "#c71585", position: 6 },
    // Free zone
    { section: "free_zone", title: "Kalyan", resultValue: "MEMBERSHIP KE LIYE", dateLabel: "Date : 27-06-2026", extraLines: ["CALL KARE", "08829959562"], color: "#d00000", position: 0 },
    { section: "free_zone", title: "MAIN BAZAR", resultValue: "BOOKING KE LIYE", extraLines: ["CALL KARE", "08829959562"], color: "#006400", position: 1 },
    { section: "free_zone", title: "PRABHAT", resultValue: "7-8-9-0", extraLines: ["7-8-9-0", "90-95-08-03-85-80-76-71"], color: "#7b1d1d", position: 2 },
    { section: "free_zone", title: "PRABHAT NIGHT", resultValue: "3-4-8-9", extraLines: ["3-4-8-9", "32-37-45-40-87-82-90-95"], color: "#666", position: 3 },
  ]);
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
