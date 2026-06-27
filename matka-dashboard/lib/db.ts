import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("POSTGRES_URL env var is not set");
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

// Proxy so existing `import { db }` call sites continue to work,
// but initialization is deferred until first method call.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_t, prop) {
    const real = getDb();
    const v = (real as unknown as Record<string | symbol, unknown>)[prop as string];
    return typeof v === "function" ? (v as Function).bind(real) : v;
  },
});

export { schema };
