import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

type AnkData = { ank: string; finalAnk: string } | null;

export function LuckyBand({ items, ankData, resolve }: { items: Row[]; ankData: AnkData; resolve: SectionResolver }) {
  const { styles, content } = resolve("lucky_band");
  return (
    <section className="my-4">
      <div className="lucky-band-title" style={toCss(styles.titleBand)}>
        <h2>{content.heading}</h2>
      </div>

      {/* Ank table — auto-scraped from source site */}
      {ankData && (ankData.ank || ankData.finalAnk) && (
        <table className="lucky-ank-box w-full border-collapse" style={toCss(styles.ankBox)}>
          <thead>
            <tr>
              <th className="py-2" style={{ color: "#ff0000" }}>{content.ankLabel}</th>
              <th className="py-2" style={{ color: "#ff0000" }}>{content.finalAnkLabel}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5">{ankData.ank}</td>
              <td className="py-2.5">{ankData.finalAnk}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Admin-managed lucky cards */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 py-6 px-8">
          {items.map((r) => (
            <div key={r.id} className="text-center">
              <div className="font-bold text-lg" style={{ color: r.color }}>{r.title}</div>
              <div className="text-lg font-semibold">{r.resultValue}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
