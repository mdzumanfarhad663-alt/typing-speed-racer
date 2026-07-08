// Animated "loading" image shown in a result cell while a game's result is pending
// (admin ticks the Loading checkbox on the dashboard). SMIL-animated SVG served as
// a data-URI <img> so it animates without any JS or extra assets.
const LOADING_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="28" viewBox="0 0 120 28">
    <text x="0" y="20" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#166534">Loading</text>
    <circle cx="78" cy="18" r="3" fill="#166534">
      <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="90" cy="18" r="3" fill="#166534">
      <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="102" cy="18" r="3" fill="#166534">
      <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
    </circle>
  </svg>`
);

export const LOADING_IMG_SRC = `data:image/svg+xml,${LOADING_SVG}`;

export function LoadingResult() {
  return <img src={LOADING_IMG_SRC} alt="Loading" width={120} height={28} className="inline-block" />;
}
