"use client";

export function PromoBlock() {
  return (
    <div
      className="my-4 py-5 px-4 text-center"
      style={{ background: "#6c1d8b" }}
    >
      {/* Hindi text */}
      <div
        className="text-base sm:text-lg font-bold mb-4 leading-relaxed"
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
        className="inline-block font-bold text-white text-base px-8 py-2 rounded-full mb-3 cursor-pointer"
        style={{
          background: "#8e2430",
        }}
      >
        Play Online Matka
      </button>

      {/* India's Biggest & Most Trusted */}
      <div
        className="text-base sm:text-lg font-bold"
        style={{ color: "#ffd400" }}
      >
        India&apos;s Biggest &amp; Most Trusted
      </div>
    </div>
  );
}
