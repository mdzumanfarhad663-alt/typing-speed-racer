import type { JodiEntry, Row } from "@/lib/schema";
import { RefreshButton } from "./RefreshButton";

function GameHeader({ game, anchorId, jumpHref, jumpLabel }: { game: Row; anchorId: string; jumpHref: string; jumpLabel: string }) {
  return (
    <div id={anchorId}>
      <div className="bg-yellow-300 text-black text-center py-4 sm:py-6 px-4 border-y-4 border-red-700">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
          {game.title.toUpperCase()}
        </h2>
        <div className="text-base sm:text-xl font-bold mt-1">{game.resultValue}</div>
        <div className="mt-3">
          <RefreshButton />
        </div>
      </div>
      <div className="bg-black text-center py-2">
        <a href={jumpHref} className="inline-block bg-yellow-100 text-red-600 font-bold px-4 py-1 rounded border border-red-600 text-sm">
          {jumpLabel}
        </a>
      </div>
    </div>
  );
}

export function JodiChart({ game, entries }: { game: Row; entries: JodiEntry[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-2">
      <div className="max-w-2xl mx-auto border-4 border-red-700">
        <div id="top" className="bg-red-900 text-center py-3 sm:py-4 border-b-4 border-red-700">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white px-2">
            {game.title.toUpperCase()} CHART
          </h1>
        </div>
        <div className="bg-red-900 text-center py-2 sm:py-3 border-b-4 border-red-700 px-4">
          <p className="text-base sm:text-xl font-bold text-white">{game.title} Jodi Matka Chart</p>
          <p className="text-[10px] sm:text-xs text-white mt-1">
            jodi chart, jodi matka chart, jodi record chart, jodi patti chart
          </p>
        </div>

        <GameHeader game={game} anchorId="header-top" jumpHref="#bottom" jumpLabel="Go to Bottom" />

        {entries.length === 0 ? (
          <div className="bg-yellow-300 text-black text-center py-8 text-base font-bold border-y-4 border-red-700">
            No jodi data yet. Admin can add weekly entries from the admin panel.
          </div>
        ) : (
          <div className="bg-purple-900 p-1 sm:p-2 flex justify-center">
            <table className="border-collapse border-2 border-purple-600 bg-purple-900">
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    {entry.days.map((d, i) => (
                      <td key={i} className="border-2 border-purple-700 bg-white text-center align-middle p-1 sm:p-2 w-10 sm:w-14">
                        <span className="text-lg sm:text-2xl font-bold" style={{ color: d.color || "#000" }}>
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
          <a href="/" className="text-yellow-300 underline font-bold text-sm">← Back to dashboard</a>
        </div>
      </div>
    </main>
  );
}
