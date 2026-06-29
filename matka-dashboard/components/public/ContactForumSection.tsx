const FORUM_ROWS = [
  {
    prefix: { text: "🆕", color: "inherit" },
    main: "Satta Matka Guessing Forum",
    suffix: { text: "🆕", color: "inherit" },
  },
  {
    prefix: { text: "FREE", color: "#e74c3c" },
    main: "Daily 3 Ank Open To Close All Games",
    suffix: { text: "FREE", color: "#e74c3c" },
  },
  {
    prefix: { text: "•UPDATE•", color: "#e74c3c" },
    main: "Weekly Jodi & Panna",
    suffix: { text: "•UPDATE•", color: "#e74c3c" },
  },
  {
    prefix: { text: "FREE", color: "#e74c3c" },
    main: "All Matka Charts",
    suffix: { text: "FREE", color: "#e74c3c" },
  },
  {
    prefix: { text: "FREE", color: "#e74c3c" },
    main: "Satta 220 Patti Favourite Panna Chart",
    suffix: { text: "FREE", color: "#e74c3c" },
  },
];

export function ContactForumSection() {
  return (
    <>
      {/* Contact section */}
      <div
        className="my-4"
        style={{ border: "2px solid #0077be", borderRadius: 6, overflow: "hidden" }}
      >
        {/* Red header */}
        <div
          className="text-center py-3 px-4"
          style={{ background: "#e30000" }}
        >
          <span className="font-bold italic text-white text-lg sm:text-xl">
            Contact For Any Support And Queries
          </span>
        </div>
        {/* Black sub-header */}
        <div
          className="text-center py-2 px-4"
          style={{ background: "#000" }}
        >
          <span className="italic text-white text-sm sm:text-base">
            Email us, and we will get back to you shortly.
          </span>
        </div>
        {/* White body with green email pill */}
        <div className="bg-white text-center py-5 px-4">
          <a
            href="mailto:support@sattamatkadpboss.mobi"
            className="inline-block font-bold text-black text-base sm:text-lg px-8 py-2 rounded-full"
            style={{
              background: "#90ee90",
              border: "none",
              textDecoration: "none",
              fontStyle: "italic",
            }}
          >
            support@sattamatkadpboss.mobi
          </a>
        </div>
      </div>

      {/* Member's Forum section */}
      <div className="my-4" style={{ overflow: "hidden", borderRadius: 4 }}>
        {/* Crimson header */}
        <div
          className="text-center py-3 px-4"
          style={{
            background: "linear-gradient(90deg, #c0135a 0%, #e91e63 50%, #c0135a 100%)",
          }}
        >
          <span
            className="font-bold italic text-lg sm:text-xl"
            style={{ color: "#fff200", textShadow: "1px 1px 2px #000" }}
          >
            MEMBER&apos;S FORUM AND FREE SATTA MATKA ZONE
          </span>
        </div>

        {/* Forum rows */}
        <div>
          {FORUM_ROWS.map((row, i) => (
            <div
              key={i}
              className="text-center py-3 px-4"
              style={{
                background: i % 2 === 0 ? "#fff5f8" : "#fff",
                borderBottom: i < FORUM_ROWS.length - 1 ? "1.5px solid #e0557f" : "none",
                border: "2px solid #e0557f",
                marginTop: i === 0 ? 0 : -2,
              }}
            >
              <span
                className="font-bold italic text-base sm:text-lg"
                style={{ color: row.prefix.color, marginRight: 6 }}
              >
                {row.prefix.text}
              </span>
              <span className="font-bold italic text-black text-base sm:text-lg">
                {row.main}
              </span>
              <span
                className="font-bold italic text-base sm:text-lg"
                style={{ color: row.suffix.color, marginLeft: 6 }}
              >
                {row.suffix.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
