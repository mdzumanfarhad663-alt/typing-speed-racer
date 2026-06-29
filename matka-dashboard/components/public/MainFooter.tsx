export function MainFooter() {
  return (
    <div style={{ background: "#0b131e" }} className="py-6 px-4">

      {/* Disclaimer box */}
      <div
        className="max-w-3xl mx-auto mb-6 p-5"
        style={{
          background: "#fff",
          border: "2px solid #3d5afe",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="text-center font-bold italic text-lg mb-3"
          style={{ color: "#d32f2f" }}
        >
          !! DISCLAIMER !!
        </div>
        <p
          className="text-sm leading-relaxed mb-3"
          style={{ color: "#222", fontWeight: 500, textAlign: "justify" }}
        >
          यह वेबसाइट (<em style={{ color: "#d32f2f" }}>SattaMatkaDpboss.Mobi</em>) केवल मनोरंजन और सूचना के उद्देश्य के लिए है। हम किसी भी अवैध सट्टा मटका व्यवसाय से नहीं जुड़े हैं। यहाँ दिखाए गए सभी परिणाम इंटरनेट पर उपलब्ध डेटा पर आधारित हैं। हम जुए या सट्टा खेलने का समर्थन नहीं करते हैं। कृपया अपने देश के कानूनों का पालन करें। किसी भी लाभ या हानि के लिए आप स्वयं जिम्मेदार होंगे।
        </p>
        <p className="text-sm font-bold italic" style={{ color: "#d32f2f" }}>
          Note: This site is for educational purposes only. View at your own risk.
        </p>
      </div>

      {/* Live update yellow box */}
      <div
        className="max-w-3xl mx-auto mb-6 p-5"
        style={{
          background: "linear-gradient(135deg, #fff9c4 0%, #fbc02d 100%)",
          border: "1px solid #fbc02d",
          borderRadius: 6,
        }}
      >
        <h2
          className="text-center font-bold italic text-base sm:text-lg mb-3"
          style={{ color: "#b71c1c" }}
        >
          Satta Matka DPBoss: सबसे तेज़ लाइव अपडेट
        </h2>
        <p className="text-sm leading-relaxed" style={{ fontWeight: 500, color: "#000", textAlign: "justify" }}>
          यदि आप इंटरनेट पर सबसे तेज़ कल्याण मटका रिजल्ट और <strong>DPBoss</strong> गेसिंग खोज रहे हैं, तो आप सही जगह पर हैं। हमारी वेबसाइट आपको मिलन डे, मिलन नाइट, राजधानी, और मेन बाजार जैसे सभी मार्केट के परिणाम बिना किसी देरी के प्रदान करती है।
        </p>
      </div>

      {/* Footer nav links — dark brown */}
      <div
        className="mb-6 py-5 px-4"
        style={{
          background: "rgba(67,32,4,0.9)",
          borderRadius: 8,
          border: "1px solid #9a4a09",
        }}
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          {[
            { label: "SATTA MATKA CHART", href: "https://sattamatkadpboss.mobi/satta-matka-chart.php" },
            { label: "TARA MATKA", href: "https://sattamatkadpboss.mobi/tara-matka-mumbai.php" },
            { label: "FIX MATKA", href: "https://sattamatkadpboss.mobi/fix-matka-number.php" },
            { label: "SITEMAP", href: "https://sattamatkadpboss.mobi/sitemap_index.xml" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sm sm:text-base hover:underline"
              style={{ color: "#ffd700", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: "ABOUT US", href: "https://sattamatkadpboss.mobi/about-us.php" },
            { label: "CONTACT US", href: "https://sattamatkadpboss.mobi/contact.php" },
            { label: "PRIVACY POLICY", href: "https://sattamatkadpboss.mobi/privacy-policy.php" },
            { label: "DISCLAIMER", href: "https://sattamatkadpboss.mobi/disclaimer.php" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sm sm:text-base hover:underline"
              style={{ color: "#ffd700", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div
        className="max-w-sm mx-auto mb-6 text-center py-6 px-6"
        style={{
          background: "#fff",
          borderRadius: 12,
          borderTop: "4px solid #d32f2f",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="font-bold italic text-xl sm:text-2xl mb-1"
          style={{ color: "#d32f2f" }}
        >
          SattaMatkaDpboss.Mobi
        </div>
        <div
          className="text-xs sm:text-sm font-bold tracking-wide mb-4"
          style={{ color: "#333" }}
        >
          ALL RIGHTS RESERVED (2012-2026)
        </div>
        <div className="text-xs font-semibold mb-1" style={{ color: "#555" }}>
          SITE OWNER:-
        </div>
        <div className="font-bold text-base sm:text-lg mb-3" style={{ color: "#00008b" }}>
          PRO. BIG BOSS SIR
        </div>
        <a
          href="tel:08829959562"
          className="font-bold text-2xl sm:text-3xl"
          style={{ color: "#0000cd", textDecoration: "none" }}
        >
          08829959562
        </a>
      </div>

      {/* Ratings box */}
      <div
        className="max-w-lg mx-auto text-center py-6 px-6"
        style={{
          background: "#1a1a2e",
          border: "2px solid #fbc02d",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="font-bold text-white text-lg sm:text-xl italic mb-3">
          DPBoss User Reviews &amp; Ratings
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl" style={{ color: "#fbc02d" }}>★ ★ ★ ★ ★</span>
          <span className="font-bold text-2xl" style={{ color: "#fbc02d" }}>4.9 / 5</span>
        </div>
        <div className="text-sm italic mb-3" style={{ color: "#ccc" }}>
          (Based on 14,850 votes)
        </div>
        <div className="text-sm italic" style={{ color: "#ddd" }}>
          Fastest Satta Matka Results and Accurate Charts trusted by thousands of users daily.
        </div>
      </div>

    </div>
  );
}
