"use client";

import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

export function PromoBlock({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("promo_block");
  return (
    <div className="my-4 py-5 px-4 text-center rounded" style={toCss(styles.panel)}>
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
        className="inline-block font-bold text-base px-3 py-1 rounded-full mb-3 cursor-pointer italic"
        style={{ boxShadow: "0 0 15px #000", ...toCss(styles.button) }}
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
