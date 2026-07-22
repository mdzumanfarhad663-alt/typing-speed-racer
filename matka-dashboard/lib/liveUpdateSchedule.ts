import { and, eq, or, isNotNull, max, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";

// Auto-switches a manual game into Live Update once either of its two
// scheduled daily times (HH:MM, Asia/Dhaka — the site operator's timezone)
// has passed today, and auto-hides it again after its configured duration.
// Each schedule slot fires at most once per calendar day (tracked via
// liveUpdateTime{1,2}FiredOn) so an auto-off doesn't immediately re-trigger
// the same still-due slot again. Idempotent — safe to call on every page load.
let lastRun = 0;
const THROTTLE_MS = 15_000;
const SCHEDULE_TIMEZONE = "Asia/Dhaka";

function currentParts(): { hhmm: string; ymd: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { hhmm: `${get("hour")}:${get("minute")}`, ymd: `${get("year")}-${get("month")}-${get("day")}` };
}

async function switchOn(updates: { id: string; firedField: "liveUpdateTime1FiredOn" | "liveUpdateTime2FiredOn"; today: string }[]) {
  if (updates.length === 0) return;
  const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_update"));
  let nextPos = (maxPos ?? -1) + 1;
  for (const u of updates) {
    await db
      .update(rows)
      .set({ section: "live_update", position: nextPos, highlight: true, liveUpdateShownAt: new Date(), [u.firedField]: u.today, updatedAt: new Date() })
      .where(eq(rows.id, u.id));
    nextPos++;
  }
}

async function switchOff(ids: string[]) {
  if (ids.length === 0) return;
  const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_result"));
  let nextPos = (maxPos ?? -1) + 1;
  for (const id of ids) {
    await db.update(rows).set({ section: "live_result", position: nextPos, highlight: false, updatedAt: new Date() }).where(eq(rows.id, id));
    nextPos++;
  }
}

export async function applyScheduledLiveUpdates(): Promise<void> {
  const now = Date.now();
  if (now - lastRun < THROTTLE_MS) return;
  lastRun = now;

  try {
    const { hhmm: nowHHMM, ymd: today } = currentParts();

    // Turn on: manual games with a schedule slot due today that hasn't
    // already fired today.
    const due = await db
      .select({
        id: rows.id,
        liveUpdateTime: rows.liveUpdateTime,
        liveUpdateTime2: rows.liveUpdateTime2,
        liveUpdateTime1FiredOn: rows.liveUpdateTime1FiredOn,
        liveUpdateTime2FiredOn: rows.liveUpdateTime2FiredOn,
      })
      .from(rows)
      .where(
        and(
          eq(rows.section, "live_result"),
          ne(rows.source, "scraped"),
          or(isNotNull(rows.liveUpdateTime), isNotNull(rows.liveUpdateTime2))
        )
      );

    const toTurnOn: { id: string; firedField: "liveUpdateTime1FiredOn" | "liveUpdateTime2FiredOn"; today: string }[] = [];
    for (const r of due) {
      const slot1Due = r.liveUpdateTime && r.liveUpdateTime <= nowHHMM && r.liveUpdateTime1FiredOn !== today;
      const slot2Due = r.liveUpdateTime2 && r.liveUpdateTime2 <= nowHHMM && r.liveUpdateTime2FiredOn !== today;
      // Prefer whichever slot is actually due; if both are, slot 1 wins and
      // slot 2 will pick up on the next sweep once slot 1 is marked fired.
      if (slot1Due) toTurnOn.push({ id: r.id, firedField: "liveUpdateTime1FiredOn", today });
      else if (slot2Due) toTurnOn.push({ id: r.id, firedField: "liveUpdateTime2FiredOn", today });
    }
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
