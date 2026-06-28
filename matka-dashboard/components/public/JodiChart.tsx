import type { JodiEntry, Row } from "@/lib/schema";
import { RefreshButton } from "./RefreshButton";

function fmtDate(s: string) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

function GameHeader({ game, anchorId, jumpHref, jumpLabel }: { game: Row; anchorId: string; jumpHref: string; jumpLabel: string }) {
  return (
    <div id={anchorId}>
      <div className="bg-yellow-300 text-black text-center py-6 px-4 border-y-4 border-red-700">
        <h2 className="text-2xl md:text-3xl font-bold italic text-blue-700">
          {game.title.toUpperCase()}
        </h2>
        <div className="text-xl font-bold mt-1">{game.resultValue}</div>
        <div className="mt-3">
          <RefreshButton />
        </div>
      </div>
      <div className="bg-black text-center py-2">
        <a href={jumpHref} className="inline-block bg-yellow-100 text-red-600 italic font-bold px-4 py-1 rounded border border-red-600">
          {jumpLabel}
        </a>
      </div>
    </div>
  );
}

export function JodiChart({ game, entries }: { game: Row; entries: JodiEntry[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-2">
      <div className="max-w-5xl mx-auto border-4 border-red-700">
        <div id="top" className="bg-red-900 text-center py-4 border-b-4 border-red-700">
          <h1 className="text-2xl md:text-3xl font-bold italic text-white">
            {game.title.toUpperCase()} CHART
          </h1>
        </div>
        <div className="bg-red-900 text-center py-3 border-b-4 border-red-700 px-4">
          <p className="text-xl italic font-bold text-white">{game.title} Jodi Matka Chart</p>
          <p className="text-xs italic text-white mt-1">
            jodi chart, jodi matka chart, jodi record chart, jodi patti chart
          </p>
        </div>

        <GameHeader game={game} anchorId="header-top" jumpHref="#bottom" jumpLabel="Go to Bottom" />

        {entries.length === 0 ? (
          <div className="bg-yellow-300 text-black text-center py-10 text-lg italic font-bold border-y-4 border-red-700">
            No jodi data yet. Admin can add weekly entries from the admin panel.
          </div>
        ) : (
          <div className="bg-purple-900 p-2 border-y-2 border-purple-600">
            <table className="w-full border-collapse">
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border-2 border-black bg-yellow-300 text-black italic font-bold text-sm w-32 p-2 align-middle text-center">
                      <div>{fmtDate(entry.weekStart)}</div>
                      <div>To</div>
                      <div>{fmtDate(entry.weekEnd)}</div>
                    </td>
                    {entry.days.map((d, i) => (
                      <td key={i} className="border-2 border-black bg-white text-center align-middle p-2 w-[12%]">
                        <span className="text-2xl md:text-3xl font-bold italic" style={{ color: d.color || "#000" }}>
                          {d.value || "--"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <GameHeader game={game} anchorId="bottom" jumpHref="#top" jumpLabel="Go to Top" />

        <div className="bg-red-900 text-center py-3 border-t-4 border-red-700">
          <a href="/" className="text-yellow-300 underline italic font-bold">← Back to dashboard</a>
        </div>
      </div>
    </main>
  );
}
