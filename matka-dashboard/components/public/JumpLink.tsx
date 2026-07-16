"use client";
import type { CSSProperties, ReactNode } from "react";

// Scrolls to the target element WITHOUT pushing a history entry — plain
// #anchor links make the phone back button replay every jump instead of
// leaving the page.
export function JumpLink({
  targetId,
  className,
  style,
  children,
}: {
  targetId: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}
