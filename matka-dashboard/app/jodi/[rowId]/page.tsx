import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jodiEntries, rows } from "@/lib/schema";
import { JodiChart } from "@/components/public/JodiChart";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JodiPage({ params }: { params: { rowId: string } }) {
  const [game] = await db.select().from(rows).where(eq(rows.id, params.rowId));
  if (!game) notFound();
  const entries = await db
    .select()
    .from(jodiEntries)
    .where(eq(jodiEntries.rowId, params.rowId))
    .orderBy(asc(jodiEntries.weekStart), asc(jodiEntries.position));
  return <JodiChart game={game} entries={entries} />;
}
