type Menu2Game = { gameTitle: string; resultValue: string; sourceKey: string };

export function LiveUpdateBand({ games }: { games: Menu2Game[] }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="mx-auto max-w-2xl px-3 mt-3">
      <div className="rounded border-2 border-green-400 overflow-hidden shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 text-yellow-300 font-bold text-center py-2 text-lg tracking-wide">
          📡 LIVE UPDATE
        </div>
        {/* Games */}
        {games.map((g, i) => (
          <div
            key={g.sourceKey}
            className={`flex flex-col items-center py-3 ${i < games.length - 1 ? "border-b border-green-300" : ""} bg-white`}
          >
            <span className="text-red-600 font-bold text-lg italic">{g.gameTitle}</span>
            <span className="text-blue-700 font-bold text-2xl tracking-widest">{g.resultValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
