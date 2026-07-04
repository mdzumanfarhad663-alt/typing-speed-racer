import type { Row } from "@/lib/types";

type AnkData = { ank: string; finalAnk: string } | null;

export function LuckyBand({ items, ankData }: { items: Row[]; ankData: AnkData }) {
  return (
    <section className="my-4">
      <div className="lucky-band-title text-center py-2">
        <h2 className="text-lg font-bold italic" style={{ color: "#000" }}>Today Satta Matka Lucky Number</h2>
      </div>

      {/* Ank table — auto-scraped from source site */}
      {ankData && (ankData.ank || ankData.finalAnk) && (
        <table className="lucky-ank-box w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="py-2 font-bold italic" style={{ color: "#ff0000" }}>Ank (शुभांक)</th>
              <th className="py-2 font-bold italic" style={{ color: "#ff0000" }}>Final Ank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5 font-bold italic text-lg">{ankData.ank}</td>
              <td className="py-2.5 font-bold italic text-lg">{ankData.finalAnk}</td>
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
