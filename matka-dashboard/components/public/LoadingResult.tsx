// Animated "loading" image shown in a result cell while a game's result is pending
// (admin ticks the Loading checkbox on the dashboard). SMIL-animated SVG served as
// a data-URI <img> so it animates without any JS or extra assets.
// Style: "Loading" with dots that appear one after another (Loading . .. ...).
const LOADING_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="28" viewBox="0 0 150 28">
    <text x="0" y="21" font-family="Georgia, serif" font-size="18" font-weight="bold" font-style="italic" fill="#c0392b">Loading</text>
    <circle cx="86" cy="20" r="2.6" fill="#c0392b">
      <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="98" cy="20" r="2.6" fill="#c0392b">
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="110" cy="20" r="2.6" fill="#c0392b">
      <animate attributeName="opacity" values="0;0;0;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" begin="0s" repeatCount="indefinite"/>
    </circle>
  </svg>`
);

export const LOADING_IMG_SRC = `data:image/svg+xml,${LOADING_SVG}`;

export function LoadingResult() {
  return <img src={LOADING_IMG_SRC} alt="Loading" width={150} height={28} className="inline-block align-middle" />;
}
