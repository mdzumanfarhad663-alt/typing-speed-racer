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
    ensured = true;
  } catch (err) {
    console.error("[ensureRowsColumns] failed", err);
  }
}
