// Standard matka "red" jodis — digit pairs differing by 5 (1&6, 2&7, 3&8, 4&9, 5&0).
// These always render in red automatically, whatever color is stored on the cell.
const RED_JODIS = new Set(["16", "27", "38", "49", "50", "61", "72", "83", "94", "05"]);

export const RED_JODI_COLOR = "#e40000";

/** True when a 2-digit jodi value is one of the red jodis. */
export function isRedJodi(jodi: string | null | undefined): boolean {
  if (!jodi) return false;
  const d = jodi.replace(/\D/g, "");
  return d.length === 2 && RED_JODIS.has(d);
}

/** Red for a red jodi, otherwise the provided fallback color. */
export function jodiColor(jodi: string | null | undefined, fallback: string): string {
  return isRedJodi(jodi) ? RED_JODI_COLOR : fallback;
}
