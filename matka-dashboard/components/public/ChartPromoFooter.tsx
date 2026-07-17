"use client";
import { toCss } from "@/lib/resolveStyle";
import type { ChartDesign } from "./PanelChart";

const PROMO_DEFAULTS = {
  hindiText: "अब मटका खेलना हुआ आसान ! घर बैठे मटका खेलो अब मोबाइल एप्लीकेशन पे और जीतो ढेर सारी धनराशि। अभी डाउनलोड करो।",
  buttonLabel: "Play Online Matka",
  trustedLabel: "India's Biggest & Most Trusted",
};

const NAV_LINKS: { label: string; color: string; href: string }[] = [
  { label: "Home", color: "#0a7d1f", href: "/" },
  { label: "Matka Guessing", color: "#7b1113", href: "https://sattamatkadpboss.mobi/satta-matka-guessing-forum.php" },
  { label: "Matka Chart", color: "#c98a1c", href: "https://sattamatkadpboss.mobi/satta-matka-chart.php" },
  { label: "Matka Play", color: "#1155cc", href: "https://sattamatkadpboss.mobi/matka-play.php" },
  { label: "Tara Matka", color: "#0a7d1f", href: "https://sattamatkadpboss.mobi/tara-matka-mumbai.php" },
  { label: "Fix Matka", color: "#c98a1c", href: "https://sattamatkadpboss.mobi/fix-matka-number.php" },
  { label: "Sitemap", color: "#d0021b", href: "https://sattamatkadpboss.mobi/sitemap_index.xml" },
];

// Promo + footer stack shown under every panel/jodi chart page. The promo box
// reuses the same "Promo Block" design/content as the home page (editable
// from Home Page Design → Promo Block) so both stay in sync.
export function ChartPromoFooter({ promoDesign }: { promoDesign?: ChartDesign }) {
  const styles = promoDesign?.styles ?? {};
  const content = { ...PROMO_DEFAULTS, ...(promoDesign?.content ?? {}) };
  return (
    <div style={{ fontFamily: "Times New Roman, serif" }}>
      {/* Promo block (same design as the home page) */}
      <div className="py-5 px-4 text-center" style={toCss(styles.panel)}>
        <div
          className="text-base sm:text-lg font-bold mb-4 leading-relaxed italic"
          style={{ color: "#ffffff", fontFamily: "Arial, sans-serif" }}
        >
          {content.hindiText}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-block font-bold text-base px-3 py-1 rounded-full mb-3 cursor-pointer italic"
          style={{ boxShadow: "0 0 15px #000", ...toCss(styles.button) }}
        >
          {content.buttonLabel}
        </button>
        <div
          className="text-base sm:text-lg font-bold italic"
          style={{ textShadow: "1px 1px 0px #000", ...toCss(styles.trustedText) }}
        >
          {content.trustedLabel}
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
        <div className="font-bold text-lg sm:text-xl" style={{ color: "#d0021b" }}>SattaMatka-Dpboss.In</div>
        <div className="font-bold text-lg sm:text-xl" style={{ color: "#d0021b" }}>SattaMatkaDpboss.Mobi</div>
        <div className="font-bold text-sm sm:text-base text-black mt-1">ALL RIGHTS RESERVED (2012-2026)</div>
        <div className="font-bold text-sm sm:text-base text-black mt-2">SITE OWNER:-</div>
        <div className="font-bold text-sm sm:text-base underline text-black">PRO. BIG BOSS SIR</div>
        <div className="block font-bold text-xl sm:text-2xl mt-2" style={{ color: "#1155cc" }}>
          SURYA BHAI
        </div>
        <a
          href="https://sattamatka-ten.vercel.app/"
          className="flex items-center justify-center gap-1 text-xs sm:text-sm italic text-black mt-1 hover:underline"
        >
          https://sattamatka-dpboss.in
          <img src="https://sattamatkadpboss.mobi/icon/137.gif" alt="" width={16} height={16} />
        </a>
      </div>
    </div>
  );
}
