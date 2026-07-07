import { sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // one backup per day
const MAX_BACKUPS = 30; // keep ~30 days of daily backups

// The backups table is self-provisioning (created on first use) so no separate
// migration step is required on deploy.
let ensured = false;
async function ensureTable() {
  if (ensured) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS db_backups (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz NOT NULL DEFAULT now(),
      kind text NOT NULL DEFAULT 'auto',
      data jsonb NOT NULL
    )
  `);
  ensured = true;
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function snapshot() {
  const [rows, panelEntries, jodiEntries, marketTimings, sectionSettings] = await Promise.all([
    db.select().from(schema.rows),
    db.select().from(schema.panelEntries),
    db.select().from(schema.jodiEntries),
    db.select().from(schema.marketTimings),
    db.select().from(schema.sectionSettings),
  ]);
  return { rows, panelEntries, jodiEntries, marketTimings, sectionSettings };
}

export async function createBackup(kind: "auto" | "manual" = "manual") {
  await ensureTable();
  const data = await snapshot();
  await db.execute(sql`INSERT INTO db_backups (kind, data) VALUES (${kind}, ${JSON.stringify(data)}::jsonb)`);
  // prune oldest beyond the retention limit
  await db.execute(sql`
    DELETE FROM db_backups WHERE id IN (
      SELECT id FROM db_backups ORDER BY created_at DESC OFFSET ${MAX_BACKUPS}
    )
  `);
}

export type BackupMeta = { id: string; createdAt: string; kind: string; rows: number; panel: number; jodi: number };

export async function listBackups(): Promise<BackupMeta[]> {
  await ensureTable();
  const res = await db.execute(sql`
    SELECT id, created_at,
      COALESCE(jsonb_array_length(data->'rows'), 0) AS rows,
      COALESCE(jsonb_array_length(data->'panelEntries'), 0) AS panel,
      COALESCE(jsonb_array_length(data->'jodiEntries'), 0) AS jodi,
      kind
    FROM db_backups ORDER BY created_at DESC
  `);
  const list = ((res as unknown as { rows?: unknown[] }).rows ?? (res as unknown as unknown[])) as Record<string, unknown>[];
  return list.map((r) => ({
    id: String(r.id),
    createdAt: new Date(r.created_at as string).toISOString(),
    kind: String(r.kind),
    rows: Number(r.rows),
    panel: Number(r.panel),
    jodi: Number(r.jodi),
  }));
}

type Snap = Awaited<ReturnType<typeof snapshot>>;
const toDate = (v: unknown) => new Date(v as string);

export async function restoreBackup(id: string): Promise<void> {
  await ensureTable();
  const res = await db.execute(sql`SELECT data FROM db_backups WHERE id = ${id} LIMIT 1`);
  const list = ((res as unknown as { rows?: unknown[] }).rows ?? (res as unknown as unknown[])) as { data: Snap }[];
  if (!list[0]) throw new Error("not_found");
  const data = list[0].data;

  // Wipe children first, then parents (rows), to respect FK order, then reinsert.
  await db.delete(schema.panelEntries);
  await db.delete(schema.jodiEntries);
  await db.delete(schema.marketTimings);
  await db.delete(schema.sectionSettings);
  await db.delete(schema.rows);

  if (data.rows?.length) {
    for (const part of chunk(data.rows, 100)) {
      await db.insert(schema.rows).values(part.map((r) => ({ ...r, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) })));
    }
  }
  if (data.panelEntries?.length) {
    for (const part of chunk(data.panelEntries, 100)) {
      await db.insert(schema.panelEntries).values(part.map((r) => ({ ...r, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) })));
    }
  }
  if (data.jodiEntries?.length) {
    for (const part of chunk(data.jodiEntries, 100)) {
      await db.insert(schema.jodiEntries).values(part.map((r) => ({ ...r, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) })));
    }
  }
  if (data.marketTimings?.length) {
    for (const part of chunk(data.marketTimings, 100)) {
      await db.insert(schema.marketTimings).values(part.map((r) => ({ ...r, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) })));
    }
  }
  if (data.sectionSettings?.length) {
    for (const part of chunk(data.sectionSettings, 100)) {
      await db.insert(schema.sectionSettings).values(part.map((r) => ({ ...r, updatedAt: toDate(r.updatedAt) })));
    }
  }
}

// Throttled daily auto-backup — safe to call on admin requests.
let lastBackupAt = 0;
let backing = false;
export async function maybeHourlyBackup(): Promise<void> {
  if (backing || Date.now() - lastBackupAt < BACKUP_INTERVAL_MS) return;
  backing = true;
  try {
    // Only auto-backup when there is data worth saving.
    const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(schema.rows);
    if (Number(n) > 0) await createBackup("auto");
  } catch (err) {
    console.error("[backup] auto-backup failed", err);
  } finally {
    lastBackupAt = Date.now();
    backing = false;
  }
}
