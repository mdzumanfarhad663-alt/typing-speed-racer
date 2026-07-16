// The 7 game variations of the Matka Rates Chart, in display order.
// Only the rate ("1:N") is editable from admin; names and payout wording are
// fixed per language, with the payout amount derived from the rate.
export const MATKA_RATE_GAMES = [
  "Singles (Ank)",
  "Jodi (Pair/Bracket)",
  "Single Pana (SP)",
  "Double Pana (DP)",
  "Triple Pana (TP)",
  "Half Sangam",
  "Sangam",
] as const;

export const DEFAULT_MATKA_RATES = ["1:9", "1:90", "1:140", "1:280", "1:600", "1:1400", "1:15000"];

export function parseRates(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_MATKA_RATES;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === DEFAULT_MATKA_RATES.length && parsed.every((r) => typeof r === "string")) {
      return parsed;
    }
  } catch { /* fall through */ }
  return DEFAULT_MATKA_RATES;
}

/** "1:140" -> "140" (payout amount for the translated sentence). */
export function rateAmount(rate: string): string {
  return rate.split(":")[1]?.trim() || rate;
}
