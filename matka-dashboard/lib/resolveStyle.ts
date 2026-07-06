import type { CSSProperties } from "react";
import type { StyleSlot } from "@/lib/schema";
import { getSectionDefaults } from "@/lib/sectionConfig";

export type SectionLive = { styles?: Record<string, StyleSlot>; content?: Record<string, string> };
export type SectionSettingsMap = Record<string, SectionLive>;

/** Maps a style slot to inline CSS. Omitted fields fall through to the component's own defaults. */
export function toCss(slot?: StyleSlot): CSSProperties {
  if (!slot) return {};
  const css: CSSProperties = {};
  if (slot.backgroundColor) css.backgroundColor = slot.backgroundColor;
  if (slot.textColor) css.color = slot.textColor;
  if (slot.fontSize) css.fontSize = slot.fontSize;
  if (slot.fontFamily) css.fontFamily = slot.fontFamily;
  if (slot.fontWeight) css.fontWeight = slot.fontWeight as CSSProperties["fontWeight"];
  if (slot.fontStyle) css.fontStyle = slot.fontStyle as CSSProperties["fontStyle"];
  if (slot.borderColor) css.borderColor = slot.borderColor;
  if (slot.borderWidth) css.borderWidth = slot.borderWidth;
  if (slot.borderStyle) css.borderStyle = slot.borderStyle as CSSProperties["borderStyle"];
  if (slot.padding) css.padding = slot.padding;
  if (slot.textAlign) css.textAlign = slot.textAlign;
  if (slot.textShadowOn) {
    css.textShadow = "1px 1px 0 pink, 1px 5px 5px #aba8a8";
  } else if (slot.textShadowColor) {
    css.textShadow = `1px 1px ${slot.textShadowBlur || "0"}px ${slot.textShadowColor}`;
  }
  if (slot.textStroke) (css as Record<string, string>).WebkitTextStroke = slot.textStroke;
  return css;
}

/** Per-slot deep merge of a live DB row over the section's hardcoded defaults. */
export function resolveSection(key: string, live?: SectionLive): { styles: Record<string, StyleSlot>; content: Record<string, string> } {
  const defaults = getSectionDefaults(key);
  const styles: Record<string, StyleSlot> = {};
  for (const slotKey of Object.keys(defaults.styles)) {
    styles[slotKey] = { ...defaults.styles[slotKey], ...(live?.styles?.[slotKey] ?? {}) };
  }
  return {
    styles,
    content: { ...defaults.content, ...(live?.content ?? {}) },
  };
}

export type SectionResolver = (key: string) => { styles: Record<string, StyleSlot>; content: Record<string, string> };

export function makeResolver(map: SectionSettingsMap): SectionResolver {
  return (key: string) => resolveSection(key, map[key]);
}

/** Parses a "list" content field (JSON-encoded array), falling back to [] on bad data. */
export function parseList<T>(value: string | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
