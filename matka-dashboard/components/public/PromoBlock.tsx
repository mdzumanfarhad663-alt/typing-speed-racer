"use client";

export function PromoBlock() {
  return (
    <div
      className="my-4 py-5 px-4 text-center"
      style={{ background: "linear-gradient(135deg, #1a6b8a 0%, #1a4f72 50%, #1a3a5c 100%)" }}
    >
      {/* Hindi text */}
      <div
        className="text-base sm:text-lg font-bold mb-4 leading-relaxed"
        style={{
          color: "#ffffff",
          fontStyle: "italic",
          textShadow: "1px 1px 2px #000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        अब मटका खेलना हुआ आसान ! घर बैठे मटका खेलो अब मोबाइल एप्लीकेशन पे और जीतो ढेर सारी धनराशि। अभी डाउनलोड करो।
      </div>

      {/* Play Online Matka button — scrolls to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-block font-bold text-white text-base px-8 py-2 rounded-full mb-3 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #c0392b 0%, #8e44ad 50%, #c0392b 100%)",
          border: "2px solid #f39c12",
          textShadow: "1px 1px 1px #000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          fontStyle: "italic",
        }}
      >
        Play Online Matka
      </button>

      {/* India's Biggest & Most Trusted */}
      <div
        className="text-base sm:text-lg font-bold italic"
        style={{ color: "#F4D03F", textShadow: "1px 1px 1px #000" }}
      >
        India&apos;s Biggest &amp; Most Trusted
      </div>
    </div>
  );
}
