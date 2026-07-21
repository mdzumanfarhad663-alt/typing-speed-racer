import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Self-provision newer columns so we don't depend on a manual `drizzle-kit push`
// on deploy. Runs at most once per warm instance; ADD COLUMN IF NOT EXISTS is a
// cheap no-op once the column exists.
let ensured = false;
export async function ensureRowsColumns(): Promise<void> {
  if (ensured) return;
  try {
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS result_loading boolean NOT NULL DEFAULT false`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time_2 text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_duration_minutes integer`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_shown_at timestamptz`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time1_fired_on text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time2_fired_on text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time_3 text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time_4 text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time3_fired_on text`);
    await db.execute(sql`ALTER TABLE rows ADD COLUMN IF NOT EXISTS live_update_time4_fired_on text`);
    ensured = true;
  } catch (err) {
    console.error("[ensureRowsColumns] failed", err);
  }
}
