import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

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

export function ContactForumSection({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("contact_forum");
  return (
    <>
      {/* Contact section */}
      <div className="my-4" style={{ border: "1px solid #ddd", borderRadius: 6, overflow: "hidden" }}>
        <div className="text-center py-3 px-4" style={toCss(styles.contactHeader)}>
          <span className="font-bold text-lg sm:text-xl">{content.contactHeading}</span>
        </div>
        <div className="text-center py-2 px-4" style={toCss(styles.contactSubHeader)}>
          <span className="text-sm sm:text-base">{content.contactSubText}</span>
        </div>
        <div className="bg-white text-center py-5 px-4">
          <a
            href={`mailto:${content.email}`}
            className="inline-block font-bold text-base sm:text-lg px-8 py-2 rounded-full"
            style={{ border: "none", textDecoration: "none", ...toCss(styles.emailPill) }}
          >
            {content.email}
          </a>
        </div>
      </div>

      {/* Member's Forum section */}
      <div className="my-4" style={{ overflow: "hidden", borderRadius: 4 }}>
        <div className="text-center py-3 px-4" style={toCss(styles.forumHeader)}>
          <span className="font-bold text-lg sm:text-xl">{content.forumHeading}</span>
        </div>
        <div>
          {FORUM_ROWS.map((row, i) => (
            <div key={i} className="py-2.5 px-4" style={{ background: i % 2 === 0 ? "#f7f7f7" : "#fff", borderBottom: "1px solid #ddd" }}>
              <span className="arrow-icon" />
              <span className="font-bold text-black text-base sm:text-lg">{row.main}</span>
              <span className={`badge-pill badge-${row.badge}`}>{BADGE_LABEL[row.badge]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
