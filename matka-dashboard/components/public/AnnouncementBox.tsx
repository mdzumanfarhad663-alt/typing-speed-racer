import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

/** Admin-managed announcement banner. Renders nothing when no text is set. */
export function AnnouncementBox({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("announcement");
  const text = (content.text || "").trim();
  if (!text) return null;
  return (
    <section className="my-3">
      <div className="whitespace-pre-line" style={toCss(styles.box)}>{text}</div>
    </section>
  );
}
