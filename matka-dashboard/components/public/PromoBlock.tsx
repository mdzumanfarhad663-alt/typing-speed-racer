"use client";

import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

export function PromoBlock({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("promo_block");
  return (
    <div className="my-[18px] py-5 px-4 text-center rounded" style={{ borderBottom: "3px solid #6ba8f2", ...toCss(styles.panel) }}>
      {/* Hindi text */}
      <div
        className="text-base sm:text-lg font-bold mb-4 leading-relaxed italic"
        style={{ color: "#ffffff", fontFamily: "Arial, sans-serif" }}
      >
        {content.hindiText}
      </div>

      {/* Play Online Matka button — scrolls to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="font-bold italic"
        style={{
          ...toCss(styles.button),
          // Fixed CTA look — always wins over an admin-set solid backgroundColor
          // so the button stays a gradient pill rather than flattening to one color.
          background:
            "linear-gradient(90deg, rgba(131, 58, 180, 1) 0, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)",
          border: "1px solid #f7dc6f",
          boxShadow: "0 0 15px #000",
          padding: ".25rem .75rem",
          color: "#fff",
          borderRadius: "1rem",
          marginTop: ".25rem",
          cursor: "pointer",
          display: "inline-block",
          fontSize: "1.1rem",
        }}
      >
        {content.buttonLabel}
      </button>

      {/* India's Biggest & Most Trusted */}
      <div
        className="text-base sm:text-lg font-bold italic"
        style={{ textShadow: "1px 1px 0px #000", ...toCss(styles.trustedText) }}
      >
        {content.trustedLabel}
      </div>
    </div>
  );
}
