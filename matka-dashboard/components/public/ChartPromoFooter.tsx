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
          <div>अब सभी मटका बाजार खेलो ऑनलाइन ऐप पर</div>
          <div>रोज खेलो रोज कमाओ अभी डाउनलोड करो</div>
        </div>
        <a
          href="https://sattamatkadpboss.mobi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold text-base sm:text-lg px-6 py-2 rounded-lg"
          style={{
            background: "linear-gradient(180deg, #ffe082, #c98a1c)",
            border: "2px solid #7a4a00",
            color: "#3a1a00",
            boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
          }}
        >
          🔗 Online Matka Play (Direct)
        </a>
        <div className="mt-3 text-xs sm:text-sm font-bold" style={{ color: "#ffd700" }}>
          ~ Kalyan Official App ~
        </div>
        <div className="text-xs sm:text-sm font-bold" style={{ color: "#ffd700" }}>
          Super Fast deposit and withdrawal
        </div>
      </div>

      {/* Booking / call promo */}
      <div className="text-center py-5 px-4 bg-white" style={{ border: "2px solid #ff2fa0" }}>
        <div className="font-bold text-sm sm:text-base mb-2" style={{ color: "#d0021b" }}>
          [ 45 बुकिंग चालू | बुकिंग चालू 45 ]
        </div>
        <div className="font-bold text-sm sm:text-base leading-relaxed text-black">
          कल्याण बाजार बम्पर धमाका अचूक जोड़ी पर कमाओ लाखों 100% फिक्स 1 जोड़ी 2 पत्ती सिर्फ एक दिन में- पूरा लॉस कवर होगा मनी बैक गारंटी एडवांस चार्ज 2500/- मात्र
        </div>
        <a href="tel:08829959562" className="block font-bold text-base sm:text-lg mt-2" style={{ color: "#1155cc" }}>
          कॉल : 08829959562
        </a>
        <a href="tel:08829959562" className="block font-bold text-base sm:text-lg" style={{ color: "#1155cc" }}>
          कॉल : 08829959562
        </a>
        <hr className="my-3 border-gray-300" />
        <div className="font-bold text-sm sm:text-base">
          <span style={{ color: "#d0021b" }}>Note :-</span> <span className="text-black">Don't Call For Trail Help</span>
        </div>
      </div>

      {/* Thin keyword bar */}
      <div className="text-center py-1.5 text-xs italic" style={{ background: "#f5fffa", border: "1px solid #b6e3d4", color: "#333" }}>
        sattamataka143
      </div>

      {/* WhatsApp button */}
      <div className="text-center py-3 px-4" style={{ background: "#000" }}>
        <a
          href="https://sattamatkadpboss.mobi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold text-sm sm:text-base px-5 py-2 rounded-lg text-white"
          style={{ background: "linear-gradient(180deg, #4caf1f, #1a5c0a)", border: "1px solid #0a3d00" }}
        >
          Join our WhatsApp channel for fast Result
        </a>
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
        <div className="font-bold text-lg sm:text-xl" style={{ color: "#d0021b" }}>SattaMatkaDpboss.Mobi</div>
        <div className="font-bold text-sm sm:text-base text-black mt-1">ALL RIGHTS RESERVED (2012-2026)</div>
        <div className="font-bold text-sm sm:text-base text-black mt-2">SITE OWNER:-</div>
        <div className="font-bold text-sm sm:text-base underline text-black">PRO. BIG BOSS SIR</div>
        <a href="tel:08829959562" className="block font-bold text-xl sm:text-2xl mt-2" style={{ color: "#1155cc" }}>
          08829959562
        </a>
        <a
          href="https://sattamatkadpboss.mobi"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs sm:text-sm italic text-black mt-1 hover:underline"
        >
          https://sattamatkadpboss.mobi
        </a>
      </div>
    </div>
  );
}
