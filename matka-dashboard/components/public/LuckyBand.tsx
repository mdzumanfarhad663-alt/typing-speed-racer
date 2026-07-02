import type { Row } from "@/lib/types";

type AnkData = { ank: string; finalAnk: string } | null;

export function LuckyBand({ items, ankData }: { items: Row[]; ankData: AnkData }) {
  return (
    <section className="section-card my-4">
      <div className="text-center py-2" style={{ background: "#29b6d8" }}>
        <h2 className="text-xl font-bold text-white">Today Satta Matka Lucky Number</h2>
      </div>

      {/* Ank table — auto-scraped from source site */}
      {ankData && (ankData.ank || ankData.finalAnk) && (
        <table className="w-full border-collapse bg-white text-center">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-red-600 font-bold">Ank (शुभांक)</th>
              <th className="py-2 text-red-600 font-bold">Final Ank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5 font-bold text-lg">{ankData.ank}</td>
              <td className="py-2.5 font-bold text-lg">{ankData.finalAnk}</td>
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
