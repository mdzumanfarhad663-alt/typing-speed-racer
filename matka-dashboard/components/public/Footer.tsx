const MEMBER_RESOURCES = [
  "Satta Matka Guessing Forum",
  "Daily 3 Ank Open To Close All Games",
  "Weekly Jodi & Panna",
  "All Matka Charts",
  "Satta 220 Patti Favourite Panna Chart",
];

const FOOTER_LINKS = ["About Us", "Privacy Policy", "Contact Us", "Disclaimer", "Sitemap"];

export function Footer() {
  return (
    <>
      {/* 1. Contact */}
      <section className="section-frame my-4">
        <div className="text-center py-4 sm:py-6 px-4">
          <h2 className="text-xl sm:text-2xl font-bold italic text-red-600 mb-2">
            Contact For Any Support And Queries
          </h2>
          <p className="italic text-sm sm:text-base">Email us and we will get back to you shortly.</p>
          <p className="text-base sm:text-lg font-bold italic text-blue-700 mt-2">
            support@sattamatkadpboss.mobi
          </p>
          <p className="text-sm sm:text-base font-bold italic mt-3">PRO. BIG BOSS SIR</p>
          <p className="text-sm sm:text-base font-bold italic text-red-600">08829959562</p>
        </div>
      </section>

      {/* 2. Welcome / About */}
      <section className="section-frame my-4">
        <div className="text-center py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm italic leading-relaxed">
          <div className="mb-2">
            Welcome to <strong>SattaMatkaDpboss.Mobi</strong> — your one-stop destination for live Kalyan Matka,
            DPBoss 143, Milan Day Night, Rajdhani Day Night and 50+ Matka markets. Free daily results, full Jodi
            &amp; Panel chart history, weekly tips and an active guessing community — all in one place.
          </div>
          <div>
            हमारी वेबसाइट पर आपको हर मटका गेम का तेज़ और सटीक रिज़ल्ट मिलेगा। रोज़ाना अपडेट होने वाले चार्ट,
            फ्री गेसिंग और साप्ताहिक जोड़ी टिप्स के लिए हमें बुकमार्क करें।
          </div>
        </div>
      </section>

      {/* 3. Member Resources */}
      <section className="section-frame my-4">
        <div className="py-4 sm:py-5 px-4 sm:px-6">
          <h3 className="text-lg sm:text-xl font-bold italic text-center text-red-600 mb-3">
            Member Resources
          </h3>
          <ul className="text-sm sm:text-base italic font-semibold space-y-1 text-center sm:text-left max-w-xl mx-auto">
            {MEMBER_RESOURCES.map((r) => (
              <li key={r} className="before:content-['★'] before:text-yellow-500 before:mr-2">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Disclaimer */}
      <section className="section-frame my-4">
        <div className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm italic leading-relaxed text-center">
          <h3 className="text-base sm:text-lg font-bold not-italic text-red-700 mb-2">DISCLAIMER</h3>
          <p>
            This website is for <strong>educational and informational purposes only</strong>. All Matka results
            and chart data shown here are provided as-is for reference. We do not run, host, organise or promote
            any form of gambling. If gambling is prohibited or restricted in your jurisdiction, please leave this
            site immediately. Any action you take based on the information on this site is strictly at your own
            risk; we are not liable for any losses or damages of any kind.
          </p>
        </div>
      </section>

      {/* 5. Rating */}
      <section className="section-frame my-4">
        <div className="text-center py-4 sm:py-5 px-4">
          <div className="text-2xl sm:text-3xl text-yellow-500 tracking-widest">★ ★ ★ ★ ★</div>
          <p className="mt-2 text-sm sm:text-base italic font-semibold">
            <strong>4.9 / 5</strong> based on <strong>14,850+</strong> user votes — trusted for the fastest result
            updates.
          </p>
        </div>
      </section>

      {/* 6. Footer bar */}
      <footer className="my-4 px-4">
        <div className="bg-black text-white py-4 px-4 rounded">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm italic">
            {FOOTER_LINKS.map((l, i) => (
              <span key={l} className="flex items-center">
                <a href="#" className="hover:underline">{l}</a>
                {i < FOOTER_LINKS.length - 1 && <span className="ml-4 text-gray-500">|</span>}
              </span>
            ))}
          </nav>
          <p className="text-center text-xs sm:text-sm italic mt-3 text-gray-300">
            © 2012–2026 SattaMatkaDpboss.Mobi — All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
