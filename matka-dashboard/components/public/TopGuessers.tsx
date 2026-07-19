import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

const GUESSERS = [
  "1-SURYA BHAI",
  "2- RUDRA PENAL KING",
  "3-SRS BHAI",
  "4-DANISH BHAI",
  "5-Jay~sir",
];

const FAST_RESULT = [
  "1.ADMIN SIR",
  "2.CO-ADMIN SIR",
  "3.S.KUMAR SIR",
  "4.VIP BHAI",
  "5.SURYA BHAI",
];

export function TopGuessers({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("top_guessers");
  return (
    <div className="my-[18px]" style={{ border: "2px solid #ff0000", overflow: "hidden" }}>
      {/* Top bar */}
      <div className="px-3 py-1" style={toCss(styles.topBar)}>
        <span className="font-bold text-xs sm:text-sm">{content.topBarLabel}</span>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-2">
        {/* LEFT — TOP GUSSER */}
        <div>
          <div className="px-3 py-2" style={toCss(styles.leftHeader)}>
            <span className="font-bold text-base sm:text-lg">{content.leftHeading}</span>
          </div>
          {GUESSERS.map((name, i) => (
            <div key={i} className="px-3 py-2" style={{ borderTop: "1px solid #005000", ...toCss(styles.leftRows) }}>
              <span className="font-bold text-sm sm:text-base">{name}</span>
            </div>
          ))}
        </div>

        {/* RIGHT — FAST RESULT */}
        <div style={{ borderLeft: "2px solid #ff0000" }}>
          <div className="px-3 py-2" style={toCss(styles.rightHeader)}>
            <span className="font-bold text-base sm:text-lg">{content.rightHeading}</span>
          </div>
          {FAST_RESULT.map((name, i) => (
            <div key={i} className="px-3 py-2" style={{ borderTop: "1px solid #0000aa", ...toCss(styles.rightRows) }}>
              <span className="font-bold text-sm sm:text-base">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
