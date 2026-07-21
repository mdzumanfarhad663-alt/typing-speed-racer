import { and, eq, isNotNull, max, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";

// Auto-switches a manual game into Live Update once its scheduled daily time
// (HH:MM, Asia/Kolkata) has passed today. Idempotent — a game already in
// live_update is skipped, so this is safe to call on every page load.
let lastRun = 0;
const THROTTLE_MS = 15_000;

function currentHHMM(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export async function applyScheduledLiveUpdates(): Promise<void> {
  const now = Date.now();
  if (now - lastRun < THROTTLE_MS) return;
  lastRun = now;

  try {
    const nowHHMM = currentHHMM();
    const due = await db
      .select({ id: rows.id, liveUpdateTime: rows.liveUpdateTime })
      .from(rows)
      .where(and(eq(rows.section, "live_result"), ne(rows.source, "scraped"), isNotNull(rows.liveUpdateTime)));

    const toFlip = due.filter((r) => r.liveUpdateTime && r.liveUpdateTime <= nowHHMM);
    if (toFlip.length === 0) return;

    const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_update"));
    let nextPos = (maxPos ?? -1) + 1;

    for (const row of toFlip) {
      await db.update(rows).set({ section: "live_update", position: nextPos, updatedAt: new Date() }).where(eq(rows.id, row.id));
      nextPos++;
    }
  } catch (err) {
    console.error("[applyScheduledLiveUpdates] failed", err);
  }
}
