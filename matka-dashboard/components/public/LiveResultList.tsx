import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";
import { ResultCard } from "./ResultCard";

export function LiveResultList({ items, resolve }: { items: Row[]; resolve: SectionResolver }) {
  const { styles, content } = resolve("live_result_list");
  return (
    <section className="section-card my-[18px]" style={{ border: "solid 3px #f39c12" }}>
      <div className="gradient-band" style={toCss(styles.header)}>
        <h2>
          <span className="mx-2">{"«««"}</span>
          <span className="underline">{content.heading}</span>
          <span className="mx-2">{"»»»"}</span>
        </h2>
      </div>
      <div className="bg-white">
        {items.length === 0 && <div className="py-6 text-center text-gray-500">No results yet</div>}
        {items.map((r) => <ResultCard key={r.id} row={r} resolve={resolve} />)}
      </div>
    </section>
  );
}
