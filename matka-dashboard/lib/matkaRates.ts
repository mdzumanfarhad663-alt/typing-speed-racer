// Rows of the homepage Matka Rates Chart. Admin can edit game names and
// rates, add new rows, and delete rows. Payout wording is fixed per language,
// with the amount derived from the rate ("1:140" -> 140).
export type MatkaRateRow = { game: string; rate: string };

export const DEFAULT_MATKA_RATE_ROWS: MatkaRateRow[] = [
  { game: "Singles (Ank)", rate: "1:9" },
  { game: "Jodi (Pair/Bracket)", rate: "1:90" },
  { game: "Single Pana (SP)", rate: "1:140" },
  { game: "Double Pana (DP)", rate: "1:280" },
  { game: "Triple Pana (TP)", rate: "1:600" },
  { game: "Half Sangam", rate: "1:1400" },
  { game: "Sangam", rate: "1:15000" },
];

export function parseRateRows(content: Record<string, string> | undefined): MatkaRateRow[] {
  // New format: rows = [{game, rate}, ...]
  try {
    const raw = content?.rows;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((r) => r && typeof r.game === "string" && typeof r.rate === "string")
      ) {
        return parsed;
      }
    }
  } catch { /* fall through */ }
  // Legacy format: rates = ["1:9", ...] paired with the default game names
  try {
    const raw = content?.rates;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === DEFAULT_MATKA_RATE_ROWS.length) {
        return DEFAULT_MATKA_RATE_ROWS.map((row, i) => ({ game: row.game, rate: String(parsed[i]) }));
      }
    }
  } catch { /* fall through */ }
  return DEFAULT_MATKA_RATE_ROWS;
}

/** "1:140" -> "140" (payout amount for the translated sentence). */
export function rateAmount(rate: string): string {
  return rate.split(":")[1]?.trim() || rate;
}
