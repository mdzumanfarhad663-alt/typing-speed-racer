// Auto-corrects manually typed matka results using panna math:
// - Panna digits must be ascending with 0 counted as highest (last): 012 → 120, 712 → 127.
// The jodi/ank (middle or 1-2 digit groups) is left exactly as typed — the admin
// controls it. Placeholders like "***" and any separators pass through untouched.

const digitRank = (d: number) => (d === 0 ? 10 : d);

export function normalizePanna(panna: string): string {
  const digits = panna.split("").map(Number);
  digits.sort((a, b) => digitRank(a) - digitRank(b));
  return digits.join("");
}

export function normalizeResult(value: string): string {
  if (!value) return value;
  // Fix digit order inside every 3-digit group, keeping everything else as typed.
  return value.replace(/\d{3}(?!\d)/g, (m, offset: number) =>
    /\d/.test(value[offset - 1] ?? "") ? m : normalizePanna(m)
  );
}
