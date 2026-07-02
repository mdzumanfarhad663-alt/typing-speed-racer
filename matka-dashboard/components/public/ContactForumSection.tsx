const FORUM_ROWS = [
  { badge: "new" as const, main: "Satta Matka Guessing Forum" },
  { badge: "free" as const, main: "Daily 3 Ank Open To Close All Games" },
  { badge: "update" as const, main: "Weekly Jodi & Panna" },
  { badge: "free" as const, main: "All Matka Charts" },
  { badge: "free" as const, main: "Satta 220 Patti Favourite Panna Chart" },
];

const BADGE_LABEL: Record<"new" | "free" | "update", string> = {
  new: "New",
  free: "Free",
  update: "Update",
};

export function ContactForumSection() {
  return (
    <>
      {/* Contact section */}
      <div
        className="my-4"
        style={{ border: "1px solid #ddd", borderRadius: 6, overflow: "hidden" }}
      >
        {/* Red header */}
        <div
          className="text-center py-3 px-4"
          style={{ background: "#e30000" }}
        >
          <span className="font-bold text-white text-lg sm:text-xl">
            Contact For Any Support And Queries
          </span>
        </div>
        {/* Black sub-header */}
        <div
          className="text-center py-2 px-4"
          style={{ background: "#000" }}
        >
          <span className="text-white text-sm sm:text-base">
            Email us, and we will get back to you shortly.
          </span>
        </div>
        {/* White body with green email pill */}
        <div className="bg-white text-center py-5 px-4">
          <a
            href="mailto:support@sattamatkadpboss.mobi"
            className="inline-block font-bold text-white text-base sm:text-lg px-8 py-2 rounded-full"
            style={{
              background: "#1f9d55",
              border: "none",
              textDecoration: "none",
            }}
          >
            support@sattamatkadpboss.mobi
          </a>
        </div>
      </div>

      {/* Member's Forum section */}
      <div className="my-4" style={{ overflow: "hidden", borderRadius: 4 }}>
        {/* Header */}
        <div
          className="text-center py-3 px-4"
          style={{ background: "#0b6e4f" }}
        >
          <span
            className="font-bold text-lg sm:text-xl text-white"
          >
            MEMBER&apos;S FORUM AND FREE SATTA MATKA ZONE
          </span>
        </div>

        {/* Forum rows */}
        <div>
          {FORUM_ROWS.map((row, i) => (
            <div
              key={i}
              className="py-2.5 px-4"
              style={{
                background: i % 2 === 0 ? "#f7f7f7" : "#fff",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span className="arrow-icon" />
              <span className="font-bold text-black text-base sm:text-lg">
                {row.main}
              </span>
              <span className={`badge-pill badge-${row.badge}`}>{BADGE_LABEL[row.badge]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
