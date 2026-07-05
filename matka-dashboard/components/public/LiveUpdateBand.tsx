import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

// Animated "NEW" badge GIF (matches the reference site's blinking badge).
const NEW_BADGE_GIF =
  "data:image/gif;base64,R0lGODlhGQALANUgAP729va5ue+Ght8REf/8/OMvL/3v7+hOTu13d/jKyu15efCQkPOjo/WysuZDQ+tqauQzM/vd3frY2OIkJP77++leXuZEROpeXvvk5PjHx/OmpvGTk+ZAQOIgIN0AAP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFFAAgACwAAAAAGQALAAAGa0CPcEgsGo/I5FHzWXgSAM9nOkV8BoNPwBMgEDWgKFSqGV4+isXH4DFgvqCPZiwfZkH4j4OwHYLxYVJUUQYgBAuFaF8fEx+BdUMBcQOSV4seTFGQQmBsCh9elwMEmlQfFhBaQgQSSq6vsEdBACH5BAUUACAALAAAAAAZAAsAAAZnwI9wSCwaj8jkcdNhfBCcT4dDjXaEHcFHUCBuPFGodDPMcBqMzuFzqHg9nY04Tux47p1IQTv83sFSHYJRBx4FDIUdDV4dFHZWZEMCcFuUjB9MkG9rDR1dlx8FVlVRUnwFD0qqq6xHQQA7";

export function LiveUpdateBand({ items, resolve }: { items: Row[]; resolve: SectionResolver }) {
  if (!items || items.length === 0) return null;
  const { styles, content } = resolve("live_update_band");

  return (
    <div className="live-update-box">
      <div className="live-result" style={toCss(styles.header)}>
        {content.heading}
        <img src={NEW_BADGE_GIF} alt="New" width={38} height={17} className="inline-block ml-2 align-middle" />
      </div>
      {items.map((row, i) => (
        <div
          key={row.id}
          className={`flex flex-col items-center py-2.5 bg-white ${i < items.length - 1 ? "border-b border-gray-200" : ""}`}
        >
          <span className="text-red-600 font-bold text-xl">{row.title}</span>
          <span className="text-blue-700 font-bold text-2xl tracking-widest">{row.resultValue}</span>
          {row.timeRange && <span className="text-red-500 text-sm">{row.timeRange}</span>}
        </div>
      ))}
    </div>
  );
}
