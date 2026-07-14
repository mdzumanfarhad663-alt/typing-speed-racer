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

export function pannaAnk(panna: string): string {
  const sum = panna.split("").reduce((s, d) => s + Number(d), 0);
  return String(sum % 10);
}

// Panel-chart jodi: derived from the day's open/close pannas. Falls back to the
// typed value when a side isn't a full 3-digit panna (holiday, half result, "**").
export function computePanelJodi(open: string, close: string, typed: string): string {
  const o = /^\d{3}$/.test(open.trim()) ? pannaAnk(open.trim()) : null;
  const c = /^\d{3}$/.test(close.trim()) ? pannaAnk(close.trim()) : null;
  if (o !== null && c !== null) return o + c;
  if (o !== null && !close.trim() && typed.length <= 1) return o;
  return typed;
}

export function normalizeResult(value: string): string {
  if (!value) return value;
  // Fix digit order inside every 3-digit group, keeping everything else as typed.
  return value.replace(/\d{3}(?!\d)/g, (m, offset: number) =>
    /\d/.test(value[offset - 1] ?? "") ? m : normalizePanna(m)
  );
}
