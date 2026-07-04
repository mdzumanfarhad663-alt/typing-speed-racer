"use client";

export function PromoBlock() {
  return (
    <div
      className="my-4 py-5 px-4 text-center rounded"
      style={{ background: "#08619a" }}
    >
      {/* Hindi text */}
      <div
        className="text-base sm:text-lg font-bold mb-4 leading-relaxed italic"
        style={{
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        अब मटका खेलना हुआ आसान ! घर बैठे मटका खेलो अब मोबाइल एप्लीकेशन पे और जीतो ढेर सारी धनराशि। अभी डाउनलोड करो।
      </div>

      {/* Play Online Matka button — scrolls to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-block font-bold text-white text-base px-3 py-1 rounded-full mb-3 cursor-pointer italic"
        style={{
          backgroundImage: "linear-gradient(90deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
          border: "1px solid #f7dc6f",
        }}
      >
        Play Online Matka
      </button>

      {/* India's Biggest & Most Trusted */}
      <div
        className="text-base sm:text-lg font-bold italic"
        style={{ color: "#f4d03f", textShadow: "1px 1px 0px #000" }}
      >
        India&apos;s Biggest &amp; Most Trusted
      </div>
    </div>
  );
}
