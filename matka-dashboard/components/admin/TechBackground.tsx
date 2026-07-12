// Pure-CSS animated "tech" background for the admin login page: a drifting
// circuit grid, a sweeping scan line, and floating glow particles. No canvas
// or JS timers — just CSS animations, so it's cheap and hydration-safe.
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.6) % 8}s`,
  duration: `${8 + (i % 5) * 2}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

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
      {/* sweeping scan line */}
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent animate-[scanSweep_6s_ease-in-out_infinite]" />
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
      `}</style>
    </div>
  );
}
