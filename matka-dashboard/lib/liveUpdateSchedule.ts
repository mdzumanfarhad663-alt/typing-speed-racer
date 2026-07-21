import { and, eq, or, isNotNull, max, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";

// Auto-switches a manual game into Live Update once either of its two
// scheduled daily times (HH:MM, Asia/Kolkata — typically open and close)
// has passed today. Idempotent — a game already in live_update is skipped,
// so this is safe to call on every page load.
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
      .select({ id: rows.id, liveUpdateTime: rows.liveUpdateTime, liveUpdateTime2: rows.liveUpdateTime2 })
      .from(rows)
      .where(
        and(
          eq(rows.section, "live_result"),
          ne(rows.source, "scraped"),
          or(isNotNull(rows.liveUpdateTime), isNotNull(rows.liveUpdateTime2))
        )
      );

    const toFlip = due.filter(
      (r) => (r.liveUpdateTime && r.liveUpdateTime <= nowHHMM) || (r.liveUpdateTime2 && r.liveUpdateTime2 <= nowHHMM)
    );
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
