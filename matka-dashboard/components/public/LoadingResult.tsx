// Animated "loading" image shown in a result cell while a game's result is pending
// (admin ticks the Loading checkbox on the dashboard). SMIL-animated SVG served as
// a data-URI <img> so it animates without any JS or extra assets.
// Style: three dots bouncing up and down.
const LOADING_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="28" viewBox="0 0 72 28">
    <circle cx="16" cy="14" r="6" fill="#c0392b">
      <animate attributeName="cy" values="14;5;14" dur="0.6s" begin="0s" repeatCount="indefinite" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline"/>
      <animate attributeName="fill-opacity" values="1;0.5;1" dur="0.6s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="36" cy="14" r="6" fill="#c0392b">
      <animate attributeName="cy" values="14;5;14" dur="0.6s" begin="0.15s" repeatCount="indefinite" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline"/>
      <animate attributeName="fill-opacity" values="1;0.5;1" dur="0.6s" begin="0.15s" repeatCount="indefinite"/>
    </circle>
    <circle cx="56" cy="14" r="6" fill="#c0392b">
      <animate attributeName="cy" values="14;5;14" dur="0.6s" begin="0.3s" repeatCount="indefinite" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" calcMode="spline"/>
      <animate attributeName="fill-opacity" values="1;0.5;1" dur="0.6s" begin="0.3s" repeatCount="indefinite"/>
    </circle>
  </svg>`
);

export const LOADING_IMG_SRC = `data:image/svg+xml,${LOADING_SVG}`;

export function LoadingResult() {
  return <img src={LOADING_IMG_SRC} alt="Loading" width={72} height={28} className="inline-block align-middle" />;
}
