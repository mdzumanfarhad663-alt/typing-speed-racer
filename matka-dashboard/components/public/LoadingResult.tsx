// Animated "loading" indicator shown in a result cell while a game's result is
// pending (admin ticks the Loading checkbox on the dashboard). Rendered as an
// inline SVG using `currentColor`, so it automatically matches the color of the
// surrounding result text. Style: "Loading" with dots appearing one after another.
export function LoadingResult() {
  return (
    <svg
      width="150"
      height="28"
      viewBox="0 0 150 28"
      className="inline-block align-middle"
      role="img"
      aria-label="Loading"
    >
      <text x="0" y="21" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" fontStyle="italic" fill="currentColor">
        Loading
      </text>
      <circle cx="86" cy="20" r="2.6" fill="currentColor">
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="98" cy="20" r="2.6" fill="currentColor">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="20" r="2.6" fill="currentColor">
        <animate attributeName="opacity" values="0;0;0;1;0" keyTimes="0;0.25;0.5;0.75;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
