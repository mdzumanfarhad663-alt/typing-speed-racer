// Heavier pure-CSS/SVG "tech" background for the admin login page: a drifting
// circuit grid, falling matrix-style code columns, a pulsing network-node
// graph, a sweeping scan beam, and floating glow particles. No canvas or JS
// timers — just CSS/SVG animations, so it's cheap and hydration-safe.
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 29) % 100}%`,
  delay: `${(i * 0.5) % 10}s`,
  duration: `${7 + (i % 6) * 2}s`,
  size: i % 4 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
}));

// Deterministic pseudo-random 0/1 pattern (no Math.random()) so server and
// client render identical markup — avoids a hydration mismatch.
function pseudoBits(seed: number, len: number): string {
  let s = seed * 9301 + 49297;
  let out = "";
  for (let i = 0; i < len; i++) {
    s = (s * 9301 + 49297) % 233280;
    out += s / 233280 > 0.5 ? "1" : "0";
  }
  return out;
}

const RAIN_COLUMNS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 6.25) % 100}%`,
  delay: `${(i * 0.9) % 9}s`,
  duration: `${9 + (i % 5) * 2}s`,
  chars: pseudoBits(i + 1, 18),
}));

// Fixed node graph (deterministic so server/client markup matches).
const NODES = [
  { x: 60, y: 60 }, { x: 220, y: 110 }, { x: 120, y: 220 }, { x: 300, y: 40 },
  { x: 340, y: 220 }, { x: 40, y: 320 }, { x: 260, y: 320 }, { x: 180, y: 150 },
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 6], [6, 2], [5, 2], [0, 7], [7, 4]];

export function TechBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* drifting circuit grid */}
      <div
        className="absolute inset-[-20%] opacity-20 animate-[gridDrift_25s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* falling matrix-style code columns */}
      <div className="absolute inset-0 opacity-25 font-mono text-[10px] leading-[14px] text-emerald-400 select-none">
        {RAIN_COLUMNS.map((c, i) => (
          <div
            key={i}
            className="absolute top-[-40%] whitespace-pre animate-[rainFall_linear_infinite]"
            style={{ left: c.left, animationDuration: c.duration, animationDelay: c.delay }}
          >
            {c.chars.split("").join("\n")}
          </div>
        ))}
      </div>

      {/* pulsing network-node graph */}
      <svg
        viewBox="0 0 380 360"
        className="absolute -right-10 -top-10 w-[26rem] h-[26rem] opacity-30 animate-[gridDrift_40s_linear_infinite_reverse]"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
            stroke="#60a5fa" strokeWidth="1"
            style={{ animation: `edgePulse 3s ease-in-out ${(i * 0.3) % 3}s infinite` }}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x} cy={n.y} r="4"
            fill="#93c5fd"
            style={{ animation: `nodePulse 2.5s ease-in-out ${(i * 0.4) % 2.5}s infinite` }}
          />
        ))}
      </svg>

      {/* sweeping scan line */}
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-blue-400/15 to-transparent animate-[scanSweep_6s_ease-in-out_infinite]" />

      {/* floating glow particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-blue-400/70 shadow-[0_0_8px_2px_rgba(96,165,250,0.6)] animate-[particleRise_linear_infinite]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      <style>{`
        @keyframes gridDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes scanSweep {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes particleRise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes rainFall {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(140vh); opacity: 0; }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.4; r: 3; }
          50% { opacity: 1; r: 5; }
        }
        @keyframes edgePulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
