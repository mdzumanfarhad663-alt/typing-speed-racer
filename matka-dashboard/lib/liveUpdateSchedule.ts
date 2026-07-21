import { and, eq, or, isNotNull, max, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";

// Auto-switches a manual game into Live Update once either of its two
// scheduled daily times (HH:MM, Asia/Dhaka — the site operator's timezone)
// has passed today, and auto-hides it again after its configured duration.
// Idempotent — a game already in the target state is skipped, so this is
// safe to call on every page load.
let lastRun = 0;
const THROTTLE_MS = 15_000;
const SCHEDULE_TIMEZONE = "Asia/Dhaka";

function currentHHMM(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: SCHEDULE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

async function switchOn(ids: string[]) {
  if (ids.length === 0) return;
  const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_update"));
  let nextPos = (maxPos ?? -1) + 1;
  for (const id of ids) {
    await db
      .update(rows)
      .set({ section: "live_update", position: nextPos, liveUpdateShownAt: new Date(), updatedAt: new Date() })
      .where(eq(rows.id, id));
    nextPos++;
  }
}

async function switchOff(ids: string[]) {
  if (ids.length === 0) return;
  const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_result"));
  let nextPos = (maxPos ?? -1) + 1;
  for (const id of ids) {
    await db.update(rows).set({ section: "live_result", position: nextPos, updatedAt: new Date() }).where(eq(rows.id, id));
    nextPos++;
  }
}

export async function applyScheduledLiveUpdates(): Promise<void> {
  const now = Date.now();
  if (now - lastRun < THROTTLE_MS) return;
  lastRun = now;

  try {
    // Turn on: manual games with a schedule whose time has passed today.
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
    const toTurnOn = due
      .filter((r) => (r.liveUpdateTime && r.liveUpdateTime <= nowHHMM) || (r.liveUpdateTime2 && r.liveUpdateTime2 <= nowHHMM))
      .map((r) => r.id);
    await switchOn(toTurnOn);

    // Turn off: games currently shown whose duration has elapsed since they
    // were switched on (manually or by the schedule above).
    const shown = await db
      .select({ id: rows.id, liveUpdateDurationMinutes: rows.liveUpdateDurationMinutes, liveUpdateShownAt: rows.liveUpdateShownAt })
      .from(rows)
      .where(and(eq(rows.section, "live_update"), ne(rows.source, "scraped"), isNotNull(rows.liveUpdateDurationMinutes), isNotNull(rows.liveUpdateShownAt)));
    const nowMs = Date.now();
    const toTurnOff = shown
      .filter((r) => {
        if (!r.liveUpdateDurationMinutes || !r.liveUpdateShownAt) return false;
        const elapsedMs = nowMs - new Date(r.liveUpdateShownAt).getTime();
        return elapsedMs >= r.liveUpdateDurationMinutes * 60_000;
      })
      .map((r) => r.id);
    await switchOff(toTurnOff);
  } catch (err) {
    console.error("[applyScheduledLiveUpdates] failed", err);
  }
}
