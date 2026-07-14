// Animated "loading" text shown in a result cell while a game's result is
// pending (admin ticks the Loading checkbox on the dashboard). Real DOM text
// with a CSS keyframe animation (not a baked SVG image) so callers can style
// color/text-shadow per section.
export function LoadingResult({
  color = "#c0392b",
  textShadow,
}: {
  color?: string;
  textShadow?: string;
}) {
  return (
    <span
      className="inline-flex items-baseline gap-0.5 font-bold italic"
      style={{ color, textShadow, fontFamily: "Georgia, serif" }}
    >
      Loading
      <span className="inline-flex">
        <span className="animate-[loadingDot_1.4s_infinite]" style={{ animationDelay: "0s" }}>.</span>
        <span className="animate-[loadingDot_1.4s_infinite]" style={{ animationDelay: "0.35s" }}>.</span>
        <span className="animate-[loadingDot_1.4s_infinite]" style={{ animationDelay: "0.7s" }}>.</span>
      </span>
      <style>{`
        @keyframes loadingDot {
          0%, 25% { opacity: 0; }
          35%, 100% { opacity: 1; }
        }
      `}</style>
    </span>
  );
}
