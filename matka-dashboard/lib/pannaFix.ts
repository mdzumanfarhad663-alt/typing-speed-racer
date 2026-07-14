// Auto-corrects manually typed matka results using panna math:
// - Panna digits must be ascending with 0 counted as highest (last): 012 → 120, 712 → 127.
// - Ank of a panna = last digit of its digit sum (368 → 17 → 7).
// - In a full "panna-jodi-panna" result the jodi is derived from the two panna anks,
//   so it is recomputed after fixing the pannas: 320-50-712 → 230-50-127.
// Only digit groups are touched; placeholders like "***" and any separators pass through.

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

export function normalizeResult(value: string): string {
  if (!value) return value;
  // Fix digit order inside every 3-digit group, keeping everything else as typed.
  let out = value.replace(/\d{3}(?!\d)/g, (m, offset: number) =>
    /\d/.test(value[offset - 1] ?? "") ? m : normalizePanna(m)
  );
  // Full result "panna-jodi-panna": recompute the jodi from the panna anks.
  out = out.replace(
    /(\d{3})(\s*-\s*)\d{2}(\s*-\s*)(\d{3})/g,
    (_m, left, s1, s2, right) => `${left}${s1}${pannaAnk(left)}${pannaAnk(right)}${s2}${right}`
  );
  // Half result "panna-ank": recompute the ank from the panna.
  out = out.replace(/(\d{3})(\s*-\s*)\d(?!\d)/g, (_m, left, s1) => `${left}${s1}${pannaAnk(left)}`);
  return out;
}
