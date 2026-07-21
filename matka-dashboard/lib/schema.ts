import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum, date, jsonb } from "drizzle-orm/pg-core";

export const sectionEnum = pgEnum("section_type", ["lucky", "live_result", "free_zone", "live_update"]);

export const rows = pgTable("rows", {
  id: uuid("id").primaryKey().defaultRandom(),
  section: sectionEnum("section").notNull(),
  title: text("title").notNull(),
  resultValue: text("result_value").notNull().default(""),
  timeRange: text("time_range"),
  leftTag: text("left_tag"),
  rightTag: text("right_tag"),
  color: text("color").notNull().default("#000000"),
  extraLines: text("extra_lines").array(),
  dateLabel: text("date_label"),
  highlight: boolean("highlight").notNull().default(false),
  resultLoading: boolean("result_loading").notNull().default(false),
  // Daily "HH:MM" (24h, Asia/Dhaka) times at which this game auto-switches
  // into Live Update — typically the market's open and close times.
  // Null = no schedule for that slot (manual toggle only).
  liveUpdateTime: text("live_update_time"),
  liveUpdateTime2: text("live_update_time_2"),
  // A second independent Open/Close pair — lets a game auto-show in Live
  // Update twice a day (e.g. a morning and an evening window) instead of once.
  // Same rules as the first pair: "HH:MM" 24h Asia/Dhaka, null = no schedule.
  liveUpdateTime3: text("live_update_time_3"),
  liveUpdateTime4: text("live_update_time_4"),
  // Minutes to stay visible in Live Update before auto-hiding. Null = stays
  // on until manually turned off. liveUpdateShownAt is stamped whenever the
  // game switches into live_update (manually or via the schedule above), so
  // the timer restarts each time it's turned on.
  liveUpdateDurationMinutes: integer("live_update_duration_minutes"),
  liveUpdateShownAt: timestamp("live_update_shown_at", { withTimezone: true }),
  // "YYYY-MM-DD" (Asia/Dhaka) of the last calendar day each schedule slot
  // fired, so a slot only auto-switches on once per day — without this, an
  // auto-off after N minutes would immediately re-trigger the same slot
  // again and again for the rest of the day.
  liveUpdateTime1FiredOn: text("live_update_time1_fired_on"),
  liveUpdateTime2FiredOn: text("live_update_time2_fired_on"),
  liveUpdateTime3FiredOn: text("live_update_time3_fired_on"),
  liveUpdateTime4FiredOn: text("live_update_time4_fired_on"),
  position: integer("position").notNull().default(0),
  source: text("source").notNull().default("manual"), // "manual" | "scraped"
  sourceKey: text("source_key"), // stable slug for upsert, e.g. "KALYAN_MORNING"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Row = typeof rows.$inferSelect;
export type NewRow = typeof rows.$inferInsert;
export type Section = "lucky" | "live_result" | "free_zone" | "live_update";

export type PanelDay = { open: string; jodi: string; close: string; color?: string };

export const panelEntries = pgTable("panel_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  rowId: uuid("row_id").notNull().references(() => rows.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  weekEnd: date("week_end").notNull(),
  days: jsonb("days").$type<PanelDay[]>().notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PanelEntry = typeof panelEntries.$inferSelect;
export type NewPanelEntry = typeof panelEntries.$inferInsert;

export type JodiDay = { value: string; color: string };

export const jodiEntries = pgTable("jodi_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  rowId: uuid("row_id").notNull().references(() => rows.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  weekEnd: date("week_end").notNull(),
  days: jsonb("days").$type<JodiDay[]>().notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type JodiEntry = typeof jodiEntries.$inferSelect;
export type NewJodiEntry = typeof jodiEntries.$inferInsert;

export const marketTimings = pgTable("market_timings", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketName: text("market_name").notNull(),
  openTime: text("open_time").notNull(),
  closeTime: text("close_time").notNull(),
  status: text("status").notNull().default("Daily"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MarketTiming = typeof marketTimings.$inferSelect;
export type NewMarketTiming = typeof marketTimings.$inferInsert;

export const scrapedCache = pgTable("scraped_cache", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).notNull(),
});

export type StyleSlot = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  padding?: string;
  textAlign?: "left" | "center" | "right";
  textShadowColor?: string;
  textShadowBlur?: string;
  textShadowOn?: boolean;
  textStrokeWidth?: string;
  textStrokeColor?: string;
};

export const sectionSettings = pgTable("section_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionKey: text("section_key").notNull().unique(),
  styles: jsonb("styles").$type<Record<string, StyleSlot>>().notNull().default({}),
  content: jsonb("content").$type<Record<string, string>>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SectionSetting = typeof sectionSettings.$inferSelect;
export type NewSectionSetting = typeof sectionSettings.$inferInsert;
