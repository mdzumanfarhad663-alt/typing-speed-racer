import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

// Animated arrow GIFs (matches the reference site's blinking arrows), embedded as data URIs.
const ARROW_SMALL = "data:image/gif;base64,R0lGODlhHwAPAPkAMQAAAP8AAP//AAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBQAAACwAAAAAHwAPAAACWYSPqcvtG2Iw8jEZhJ55WtVlG9CRWGR6KSlE7VaKWsuqcdvBdFjxLocLvoAqymuzC7qGtUptuJMkbzNP7oqgTp1XJobGmia6Nwylh0OTVw3ZSAb/pMwn86FQACH5BAkFAAAALAAAAAAfAA8AAAJYjANwye2fgphIIoifpErcDHab4YWhRVnKsSyRsZKkV25TXUa4PO6syPLtdg4URVi5JX8imsqi6uCUOtTT4/pBYU1rDBRlWJ2mqtZJdmFsHJtbBGbB5FpDoQAh+QQJBQAAACwAAAAAHwAPAAACWYSPqcvtG2IwEsj7ThB8bs+FU2aJJXh5kbZewvZ+ZyJT7/l18lfh0s2LdYCh20lEjAhfyV7uiUsmaUxoENTxtapVy28Ew5qeXRa4ktqSVSOSBpmtuSnpVqRQACH5BAkFAAAALAAAAAAfAA8AAAJahI+hG+gPTRCUtojfZDd7sH3aIimgwJQdyVRNOLkSesBoTNvpyeU3atE5Ni6fAvh73VhAovJ4bJ4qxqZxE4NxntbXotrRdGk1nwXjlLYuWXTxjDWBSJEtS1EAACH5BAkFAAAALAAAAAAfAA8AAAJZhI+py+2vgpwBzHOhFZzXIFQGKI7ZRVIbRVpT94VrQsJyCs+pNIZ+iwOFgB3Z6ncb+pQx1bHWxP1mCOg0KCSyntdXM1mMeXIY8I31QfMoxqwmMuS55G+MpFAAIfkECQUAAAAsAAAAAB8ADwAAAlmEj3nB2wpjEGHRiNNk/Oa/CeKGcBXAoWYTtiojXuQUy9Q9U7RdbSaKwwFhNOJQE8wRR8rUMDn0jWyx0+4a1U17usfqZ+LxPpDcKOrEhK3n3Tnj86a+JzWjUAAh+QQJBQAAACwAAAAAHwAPAAACWISPqcvtD02YZwZgYwriyo51lpeNpWiB3CS01xq2bsi5qii/t0l3vs6qBWmb34+2csFWmV7ylWIdazPnsYKbokjGZdRJRFDHyNuMWTKlhzGdDBRpjjBqTaEAIfkEBQUAAAAsAAAAAB8ADwAAAluEj6kbvQ9RECFaRq8+s3nzeSLwgU43CVlHqm7FgiuVzjAd4s3qUep+q0h8vwyHCGyNlD6WiFa8vWSdphIVvTqYVVgvaEt0rUepbTSOUWUzV5toNAnRolO9ZCh8ADs=";
const ARROW_MEDIUM = "data:image/gif;base64,R0lGODlhJgAPAPMGAP/////MzP+Zmf9mZv8zM/8AAMzM/5mZ/5lm/2Yz/zMA/wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAAGACwAAAAAJgAPAAADgWi63P4wyjmDvcFgy/YFmpcZRWkWxnCWA6iuRQYXg1ISOJ7eOLsXOZwMGBTYYg0VYaHcLR2lUSOaBDJpzs1RgAGRVpkX+Hd6zkY8Ifk2egVr3yABjWQ0X0bngwqtX58EVE19Ugx8fwoBNz9yRmk4cIcKgwYCLGInNTNPFJ2en6ANCQAh+QQFAAAAACwBAAIAJAALAAAEddDIaQCVINuLN1dgqACICCZZaSrVqqhJHJNnDCK0Isetvh+gioaGyiR0xKEmqGQOS0XAEQW9ZEAHCmBVUZm6q6LLUOPlQgkhTIbb+mRklhKaO6SQSrdwKX/ij3J0eU58e3dFcVRlMXaLCSqGSRlAL14iOC4JEQA7";
const ARROW_WIDE = "data:image/gif;base64,R0lGODlhNgAJAPsAMQAAAP8AAP8zM/9mZt0AAMwAACIAAHcAAFUAAO4AAIgAAP+ZmQAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJIwAAACwBAAEANAAHAAAEYRCAIIK8OOvNN7WSMAwCcYHTFKzSyravy8qXSJrBsNxHe6Y+lEX482Fyu9LBNggUEMYUDSidUl21UfOZEHgTCkN0mCESx5nuNwwoEArsU6yMvRZVr/Y7DjggxB2BgoJ+gBEAIfkEBSMAAAAsAQABADQABwAABEIQgCCCvDjrzTe1kjAMAtGd6CmSZjAs7JHOswuXxzoEBUL/HR0PkRAYEwoDcJkpHpOAAqEAZVolUqpSckBsr9fuNpIAOw==";

type ArrowKind = "small" | "medium" | "wide";
const ARROW_SRC: Record<ArrowKind, string> = { small: ARROW_SMALL, medium: ARROW_MEDIUM, wide: ARROW_WIDE };
const ARROW_SIZE: Record<ArrowKind, { width: number; height: number }> = {
  small: { width: 20, height: 10 },
  medium: { width: 38, height: 15 },
  wide: { width: 50, height: 10 },
};

function ArrowGif({ kind, className }: { kind: ArrowKind; className?: string }) {
  const { width, height } = ARROW_SIZE[kind];
  return <img src={ARROW_SRC[kind]} alt="" width={width} height={height} className={className} />;
}

const FORUM_ROWS = [
  { badge: "new" as const, arrow: "small" as const, main: "Satta Matka Guessing Forum", href: "https://sattamatkadpboss.mobi/satta-matka-guessing-forum.php" },
  { badge: "free" as const, arrow: "medium" as const, main: "Daily 3 Ank Open To Close All Games", href: "https://sattamatkadpboss.mobi/open-to-close.php" },
  { badge: "update" as const, arrow: "wide" as const, main: "Weekly Jodi & Panna", href: "https://sattamatkadpboss.mobi/weekly-jodi-panna.php" },
  { badge: "free" as const, arrow: "medium" as const, main: "All Matka Charts", href: "https://sattamatkadpboss.mobi/satta-matka-chart.php" },
  { badge: "free" as const, arrow: "medium" as const, main: "Satta 220 Patti Favourite Panna Chart", href: "https://sattamatkadpboss.mobi/all-panna-record.php" },
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
            <div
              key={i}
              className="text-center py-2.5 px-4 flex items-center justify-center gap-2"
              style={{ background: i % 2 === 0 ? "#f7f7f7" : "#fff", borderBottom: "1px solid #ddd" }}
            >
              <ArrowGif kind={row.arrow} />
              <a href={row.href} target="_blank" rel="noopener noreferrer" className="font-bold text-black text-base sm:text-lg hover:underline">
                {row.main}
              </a>
              <span className={`badge-pill badge-${row.badge}`}>{BADGE_LABEL[row.badge]}</span>
              <ArrowGif kind={row.arrow} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
