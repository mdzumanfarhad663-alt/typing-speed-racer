import { and, eq, or, isNotNull, max, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";

// Auto-switches a manual game into Live Update once any of its four
// scheduled daily times (HH:MM, Asia/Dhaka — the site operator's timezone)
// has passed today, and auto-hides it again after its configured duration.
// The four slots are two independent Open/Close pairs, letting a game show
// twice a day (e.g. a morning window and an evening window).
// Each schedule slot fires at most once per calendar day (tracked via
// liveUpdateTime{1,2,3,4}FiredOn) so an auto-off doesn't immediately
// re-trigger the same still-due slot again. Idempotent — safe to call on
// every page load.
let lastRun = 0;
const THROTTLE_MS = 15_000;
const SCHEDULE_TIMEZONE = "Asia/Dhaka";

type FiredField = "liveUpdateTime1FiredOn" | "liveUpdateTime2FiredOn" | "liveUpdateTime3FiredOn" | "liveUpdateTime4FiredOn";

const SLOTS: { timeField: "liveUpdateTime" | "liveUpdateTime2" | "liveUpdateTime3" | "liveUpdateTime4"; firedField: FiredField }[] = [
  { timeField: "liveUpdateTime", firedField: "liveUpdateTime1FiredOn" },
  { timeField: "liveUpdateTime2", firedField: "liveUpdateTime2FiredOn" },
  { timeField: "liveUpdateTime3", firedField: "liveUpdateTime3FiredOn" },
  { timeField: "liveUpdateTime4", firedField: "liveUpdateTime4FiredOn" },
];

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

async function switchOn(updates: { id: string; firedField: FiredField; today: string }[]) {
  if (updates.length === 0) return;
  const [{ value: maxPos }] = await db.select({ value: max(rows.position) }).from(rows).where(eq(rows.section, "live_update"));
  let nextPos = (maxPos ?? -1) + 1;
  for (const u of updates) {
    await db
      .update(rows)
      .set({ section: "live_update", position: nextPos, liveUpdateShownAt: new Date(), [u.firedField]: u.today, updatedAt: new Date() })
      .where(eq(rows.id, u.id));
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
    const { hhmm: nowHHMM, ymd: today } = currentParts();

    // Turn on: manual games with a schedule slot due today that hasn't
    // already fired today.
    const due = await db
      .select({
        id: rows.id,
        liveUpdateTime: rows.liveUpdateTime,
        liveUpdateTime2: rows.liveUpdateTime2,
        liveUpdateTime3: rows.liveUpdateTime3,
        liveUpdateTime4: rows.liveUpdateTime4,
        liveUpdateTime1FiredOn: rows.liveUpdateTime1FiredOn,
        liveUpdateTime2FiredOn: rows.liveUpdateTime2FiredOn,
        liveUpdateTime3FiredOn: rows.liveUpdateTime3FiredOn,
        liveUpdateTime4FiredOn: rows.liveUpdateTime4FiredOn,
      })
      .from(rows)
      .where(
        and(
          eq(rows.section, "live_result"),
          ne(rows.source, "scraped"),
          or(isNotNull(rows.liveUpdateTime), isNotNull(rows.liveUpdateTime2), isNotNull(rows.liveUpdateTime3), isNotNull(rows.liveUpdateTime4))
        )
      );

    const toTurnOn: { id: string; firedField: FiredField; today: string }[] = [];
    for (const r of due) {
      // Prefer whichever slot is actually due; if several are, the earliest
      // slot wins and the rest pick up on the next sweep once it's fired.
      for (const slot of SLOTS) {
        const time = r[slot.timeField];
        const firedOn = r[slot.firedField];
        if (time && time <= nowHHMM && firedOn !== today) {
          toTurnOn.push({ id: r.id, firedField: slot.firedField, today });
          break;
        }
      }
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
