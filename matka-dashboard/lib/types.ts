import type { Row, Section } from "./schema";

export type { Row, Section };

export type PublicSectionsResponse = {
  lucky: Row[];
  live_result: Row[];
  free_zone: Row[];
};

export const SECTION_LABELS: Record<Section, string> = {
  lucky: "Lucky Number Band",
  live_result: "Live Matka Result",
  free_zone: "Free Game Zone",
};
