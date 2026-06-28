import type { PanelDay, PanelEntry, Row } from "@/lib/schema";

function pad(s: string, len: number) {
  return (s + "      ").slice(0, len).split("");
}

function DayCell({ d }: { d: PanelDay }) {
  const open = pad(d.open || "   ", 3);
  const close = pad(d.close || "   ", 3);
  return (
    <td className="border border-yellow-600 p-2 bg-black text-yellow-300 align-middle">
      <div className="flex items-center justify-center gap-1">
        <div className="flex flex-col text-xs leading-tight text-yellow-200">
          <span>{open[0]}</span><span>{open[1]}</span><span>{open[2]}</span>
        </div>
        <div className="text-2xl font-bold italic text-yellow-300 px-1">{d.jodi || "--"}</div>
        <div className="flex flex-col text-xs leading-tight text-yellow-200">
          <span>{close[0]}</span><span>{close[1]}</span><span>{close[2]}</span>
        </div>
      </div>
    </td>
  );
}

function fmtDate(s: string) {
  // s is ISO date YYYY-MM-DD
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

export function PanelChart({ game, entries }: { game: Row; entries: PanelEntry[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-2">
      <div className="max-w-5xl mx-auto border-4 border-red-700">
        <div className="bg-blue-900 text-center py-4 border-b-4 border-red-700">
          <h1 className="text-2xl md:text-3xl font-bold italic text-red-500">
            {game.title.toUpperCase()} PANEL CHART
          </h1>
        </div>
        <div className="bg-blue-900 text-center py-3 border-b-4 border-red-700 px-4">
          <p className="text-xl italic font-bold text-white">{game.title} Jodi Patti chart</p>
          <p className="text-xs italic text-white mt-1">
            panel chart, jodi patti record chart, satta panel chart, panel chart for matka
          </p>
        </div>

        {entries.length === 0 && (
          <div className="bg-yellow-300 text-black text-center py-10 text-lg italic font-bold">
            No panel data yet. Admin can add weekly entries from the admin panel.
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="bg-yellow-300 text-black text-center py-6 px-4 border-y-4 border-red-700">
              <h2 className="text-2xl md:text-3xl font-bold italic text-blue-700">
                {game.title.toUpperCase()}
              </h2>
              <div className="text-xl font-bold mt-1">{game.resultValue}</div>
            </div>
            <table className="w-full bg-purple-900 border-collapse border-2 border-yellow-400">
              <tbody>
                <tr>
                  <td className="border border-yellow-600 p-2 bg-yellow-300 text-black italic font-bold text-sm w-40">
                    <div>{fmtDate(entry.weekStart)}</div>
                    <div>To</div>
                    <div>{fmtDate(entry.weekEnd)}</div>
                  </td>
                  {entry.days.map((d, i) => <DayCell key={i} d={d} />)}
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <div className="bg-blue-900 text-center py-3 border-t-4 border-red-700">
          <a href="/" className="text-yellow-300 underline italic font-bold">← Back to dashboard</a>
        </div>
      </div>
    </main>
  );
}
