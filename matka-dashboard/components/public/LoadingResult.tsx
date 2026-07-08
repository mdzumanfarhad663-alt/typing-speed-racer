// Animated "loading" image shown in a result cell while a game's result is pending
// (admin ticks the Loading checkbox on the dashboard). SMIL-animated SVG served as
// a data-URI <img> so it animates without any JS or extra assets.
const LOADING_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="28" viewBox="0 0 150 28">
    <text x="0" y="21" font-family="Georgia, serif" font-size="18" font-weight="bold" font-style="italic" fill="#c0392b">Loading</text>
    <circle cx="118" cy="14" r="8" fill="none" stroke="#f0c9c4" stroke-width="3"/>
    <circle cx="118" cy="14" r="8" fill="none" stroke="#c0392b" stroke-width="3" stroke-linecap="round" stroke-dasharray="14 40">
      <animateTransform attributeName="transform" type="rotate" from="0 118 14" to="360 118 14" dur="0.8s" repeatCount="indefinite"/>
    </circle>
  </svg>`
);

export const LOADING_IMG_SRC = `data:image/svg+xml,${LOADING_SVG}`;

export function LoadingResult() {
  return <img src={LOADING_IMG_SRC} alt="Loading" width={150} height={28} className="inline-block align-middle" />;
}
