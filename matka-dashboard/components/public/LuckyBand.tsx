import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

type AnkData = { ank: string; finalAnk: string } | null;

export function LuckyBand({ ankData, resolve }: { items: Row[]; ankData: AnkData; resolve: SectionResolver }) {
  const { styles, content } = resolve("lucky_band");

  // Admin-entered values win; empty falls back to the auto-scraped value.
  const leftValue = content.ankValue || ankData?.ank || "";
  const rightValue = content.finalAnkValue || ankData?.finalAnk || "";

  return (
    <section className="my-4">
      <div className="lucky-band-title" style={toCss(styles.titleBand)}>
        <h2>{content.heading}</h2>
      </div>

      {(leftValue || rightValue) && (
        <table className="lucky-ank-box w-full border-collapse" style={toCss(styles.ankBox)}>
          <thead>
            <tr>
              <th className="py-2" style={{ ...toCss(styles.ankNameText), ...toCss(styles.ankLeftTitle) }}>{content.ankLabel}</th>
              <th className="py-2" style={{ ...toCss(styles.ankNameText), ...toCss(styles.ankRightTitle) }}>{content.finalAnkLabel}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5" style={{ ...toCss(styles.ankNumberText), ...toCss(styles.ankLeftValue) }}>{leftValue}</td>
              <td className="py-2.5" style={{ ...toCss(styles.ankNumberText), ...toCss(styles.ankRightValue) }}>{rightValue}</td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
}
