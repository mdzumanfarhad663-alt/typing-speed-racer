import "dotenv/config";
import { db } from "../lib/db";
import { rows, marketTimings } from "../lib/schema";

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

  console.log("Seeding market timings...");
  await db.delete(marketTimings);
  await db.insert(marketTimings).values([
    { marketName: "Time Bazar", openTime: "01:00 PM", closeTime: "02:00 PM", status: "Mon–Sat", position: 0 },
    { marketName: "Milan Day", openTime: "3:00 PM", closeTime: "5:00 PM", status: "Mon–Sat", position: 1 },
    { marketName: "Rajdhani Day", openTime: "3:15 PM", closeTime: "5:15 PM", status: "Mon–Sat", position: 2 },
    { marketName: "Kalyan", openTime: "3:45 PM", closeTime: "5:45 PM", status: "Mon–Sat", position: 3 },
    { marketName: "Madhur Day", openTime: "1:30 PM", closeTime: "2:30 PM", status: "Daily", position: 4 },
    { marketName: "Supreme Day", openTime: "3:30 PM", closeTime: "5:30 PM", status: "Daily", position: 5 },
    { marketName: "Sridevi", openTime: "11:30 AM", closeTime: "12:30 PM", status: "Daily", position: 6 },
    { marketName: "Day Bombay", openTime: "12:00 PM", closeTime: "2:00 PM", status: "Daily", position: 7 },
    { marketName: "Main Mumbai", openTime: "9:30 PM", closeTime: "11:45 PM", status: "Mon–Fri", position: 8 },
    { marketName: "Milan Night", openTime: "9:00 PM", closeTime: "11:00 PM", status: "Mon–Sat", position: 9 },
    { marketName: "Rajdhani Night", openTime: "9:30 PM", closeTime: "11:45 PM", status: "Mon–Fri", position: 10 },
    { marketName: "Madhur Night", openTime: "8:30 PM", closeTime: "10:30 PM", status: "Mon–Sat", position: 11 },
    { marketName: "Supreme Night", openTime: "8:30 PM", closeTime: "10:30 PM", status: "Daily", position: 12 },
    { marketName: "Sridevi Night", openTime: "7:15 PM", closeTime: "8:15 PM", status: "Daily", position: 13 },
    { marketName: "Night Bombay", openTime: "8:00 PM", closeTime: "10:00 PM", status: "Daily", position: 14 },
    { marketName: "KBC Bombay", openTime: "1:30 PM", closeTime: "2:30 PM", status: "Daily", position: 15 },
    { marketName: "Malamal Bombay", openTime: "11:40 AM", closeTime: "12:40 PM", status: "Daily", position: 16 },
    { marketName: "CMM Matka", openTime: "5:00 PM", closeTime: "7:00 PM", status: "Daily", position: 17 },
    { marketName: "Main Bazar", openTime: "9:35 PM", closeTime: "12:05 AM", status: "Mon–Fri", position: 18 },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
