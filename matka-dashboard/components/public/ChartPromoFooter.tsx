const NAV_LINKS: { label: string; color: string; href: string }[] = [
  { label: "Home", color: "#0a7d1f", href: "/" },
  { label: "Matka Guessing", color: "#7b1113", href: "https://sattamatkadpboss.mobi/satta-matka-guessing-forum.php" },
  { label: "Matka Chart", color: "#c98a1c", href: "https://sattamatkadpboss.mobi/satta-matka-chart.php" },
  { label: "Matka Play", color: "#1155cc", href: "https://sattamatkadpboss.mobi/matka-play.php" },
  { label: "Tara Matka", color: "#0a7d1f", href: "https://sattamatkadpboss.mobi/tara-matka-mumbai.php" },
  { label: "Fix Matka", color: "#c98a1c", href: "https://sattamatkadpboss.mobi/fix-matka-number.php" },
  { label: "Sitemap", color: "#d0021b", href: "https://sattamatkadpboss.mobi/sitemap_index.xml" },
];

// Promo + booking + footer stack shown under every panel/jodi chart page,
// matching the reference site's layout below the result box.
export function ChartPromoFooter() {
  return (
    <div style={{ fontFamily: "Times New Roman, serif" }}>
      {/* Pink/red app promo */}
      <div
        className="text-center py-5 px-4"
        style={{ background: "linear-gradient(180deg, #e2144e 0%, #7a0f1f 100%)", border: "3px solid #7a0f1f" }}
      >
        <div className="text-white font-bold text-sm sm:text-base leading-relaxed mb-3" style={{ textShadow: "1px 1px 2px #000" }}>
          अब मटका खेलना हुआ आसान ! घर बैठे मटका खेलो अब मोबाइल एप्लीकेशन पे और जीतो ढेर सारी धनराशि। अभी डाउनलोड करो।
        </div>
        <a
          href="/"
          className="inline-block font-bold text-base sm:text-lg px-6 py-2 rounded-lg"
          style={{
            background: "linear-gradient(180deg, #ffe082, #c98a1c)",
            border: "2px solid #7a4a00",
            color: "#3a1a00",
            boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
          }}
        >
          🔗 Online Matka Play (Direct) 🎮
        </a>
        <div className="mt-3 text-xs sm:text-sm font-bold" style={{ color: "#ffd700" }}>
          या फिर, अपने इलाके के किसी भरोसेमंद एजेंट के साथ दांव लगाएं।
        </div>
      </div>

      {/* Nav links */}
      <div className="text-center py-2.5 px-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1" style={{ background: "#fff9b0" }}>
        {NAV_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center gap-1.5">
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-bold text-sm sm:text-base hover:underline"
              style={{ color: link.color }}
            >
              {link.label}
            </a>
            {i < NAV_LINKS.length - 1 && <span className="text-black">|</span>}
          </span>
        ))}
      </div>

      {/* Footer identity box */}
      <div className="text-center py-5 px-4" style={{ background: "#fff9b0", borderTop: "1px solid #e0d68a" }}>
        <div className="font-bold text-xl sm:text-2xl" style={{ color: "#d0021b" }}>SattaMatka-Dpboss.In</div>
        <div className="font-bold text-xl sm:text-2xl" style={{ color: "#d0021b" }}>SattaMatkaDpboss.Mobi</div>
        <div className="font-bold text-base sm:text-lg text-black mt-1">ALL RIGHTS RESERVED (2012-2026)</div>
        <div className="mx-auto mt-3 pt-3 max-w-xs" style={{ borderTop: "1px solid #000000" }}>
          <div className="font-bold text-base sm:text-lg text-black">SITE OWNER:-</div>
        </div>
        <div className="font-bold text-base sm:text-lg underline text-black">PRO. BIG BOSS SIR</div>
        <div className="block font-bold text-2xl sm:text-3xl mt-2" style={{ color: "#1155cc" }}>
          SURYA BHAI
        </div>
        <style>{`
          @keyframes cpf-live-pulse {
            0% { box-shadow: 0 0 0 0 rgba(255,0,0,0.55); }
            70% { box-shadow: 0 0 0 6px rgba(255,0,0,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); }
          }
          .cpf-live-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 30%, #ff8a8a, #e00000 60%, #a80000);
            animation: cpf-live-pulse 1.4s ease-out infinite;
          }
        `}</style>
        <a
          href="https://sattamatka-ten.vercel.app/"
          className="flex items-center justify-center gap-1.5 text-sm sm:text-base italic text-black mt-1 hover:underline"
        >
          https://sattamatka-dpboss.in
          <span className="cpf-live-dot" aria-hidden />
        </a>
      </div>
    </div>
  );
}
