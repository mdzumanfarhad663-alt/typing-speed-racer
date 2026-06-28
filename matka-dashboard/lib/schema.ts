import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum, date, jsonb } from "drizzle-orm/pg-core";

export const sectionEnum = pgEnum("section_type", ["lucky", "live_result", "free_zone"]);

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
  position: integer("position").notNull().default(0),
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
export type Section = "lucky" | "live_result" | "free_zone";

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
