type Menu2Game = { gameTitle: string; resultValue: string; sourceKey: string };

export function LiveUpdateBand({ games }: { games: Menu2Game[] }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="section-frame my-4">
      {/* Header */}
      <div className="bg-amber-400 text-center py-2 font-bold text-xl tracking-wide border-b-2 border-amber-600">
        📡 LIVE UPDATE
      </div>
      {/* Games */}
      {games.map((g, i) => (
        <div
          key={g.sourceKey}
          className={`flex flex-col items-center py-3 bg-white ${i < games.length - 1 ? "border-b-2 border-gray-300" : ""}`}
        >
          <span className="text-red-600 font-bold text-xl italic">{g.gameTitle}</span>
          <span className="text-blue-700 font-bold text-2xl tracking-widest">{g.resultValue}</span>
        </div>
      ))}
    </div>
  );
}
