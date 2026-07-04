import type { Row, Section, StyleSlot } from "./schema";

export type { Row, Section, StyleSlot };

export type PublicSectionsResponse = {
  lucky: Row[];
  live_result: Row[];
  free_zone: Row[];
  live_update: Row[];
};

export const SECTION_LABELS: Record<Section, string> = {
  lucky: "Lucky Number Band",
  live_result: "Live Matka Result",
  free_zone: "Free Game Zone",
  live_update: "Live Update",
};

export type AnkData = { ank: string; finalAnk: string } | null;
