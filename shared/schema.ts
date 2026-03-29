import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ──────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  tier: text("tier").notNull().default("free"), // free | pro | enterprise
  verdictsUsedThisMonth: integer("verdicts_used_this_month").notNull().default(0),
  monthResetDate: text("month_reset_date").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ── Verdicts (StoneVerdictEvent) ──────────────────────
export const verdicts = sqliteTable("verdicts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  blockNumber: integer("block_number").notNull(),
  timestamp: text("timestamp").notNull(),
  subjectName: text("subject_name").notNull(),
  subjectTicker: text("subject_ticker"),
  subjectKind: text("subject_kind").notNull(), // Company | Person | Nation | Asset | Protocol
  subjectMarket: text("subject_market"),
  subjectSector: text("subject_sector"),
  operators: text("operators").notNull(), // JSON string of all 6 operator blocks
  qtac7Score: real("qtac7_score").notNull(),
  qtac7Pink: real("qtac7_pink").notNull(),
  qtac7OmegaGap: real("qtac7_omega_gap").notNull(),
  dimBusiness: real("dim_business").notNull(),
  dimEconomics: real("dim_economics").notNull(),
  dimManagement: real("dim_management").notNull(),
  dimMoat: real("dim_moat").notNull(),
  dimCompounding: real("dim_compounding").notNull(),
  dimValuation: real("dim_valuation").notNull(),
  dimRisk: real("dim_risk").notNull(),
  stoneScore: real("stone_score").notNull(),
  verdictText: text("verdict_text").notNull(),
  recommendation: text("recommendation").notNull(),
  rangeLow: text("range_low"),
  rangeHigh: text("range_high"),
  conditions: text("conditions"), // JSON array string
  retrialDate: text("retrial_date"),
  retrialStatus: text("retrial_status").default("pending"),
  canonHash: text("canon_hash").notNull(),
  prevHash: text("prev_hash").notNull(),
  sealed: integer("sealed").notNull().default(1),
});

export const insertVerdictSchema = createInsertSchema(verdicts).omit({ id: true });
export type InsertVerdict = z.infer<typeof insertVerdictSchema>;
export type Verdict = typeof verdicts.$inferSelect;

// ── Daily Blocks ──────────────────────────────────────
export const dailyBlocks = sqliteTable("daily_blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  canonWord: text("canon_word").notNull(),
  jewels: text("jewels").notNull(), // JSON array of {label, detail}
  volts: integer("volts").notNull(),
  linkedBlocks: text("linked_blocks"), // JSON array of verdict IDs
  notesHash: text("notes_hash").notNull(),
  rawNotes: text("raw_notes"),
});

export const insertDailyBlockSchema = createInsertSchema(dailyBlocks).omit({ id: true });
export type InsertDailyBlock = z.infer<typeof insertDailyBlockSchema>;
export type DailyBlock = typeof dailyBlocks.$inferSelect;

// ── Canon Blocks ──────────────────────────────────────
export const canonBlocks = sqliteTable("canon_blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blockNumber: integer("block_number").notNull().unique(),
  events: text("events").notNull(), // JSON array of verdict IDs
  volts: integer("volts").notNull(),
  hash: text("hash").notNull(),
  prevHash: text("prev_hash").notNull(),
  sealedAt: text("sealed_at").notNull(),
});

export const insertCanonBlockSchema = createInsertSchema(canonBlocks).omit({ id: true });
export type InsertCanonBlock = z.infer<typeof insertCanonBlockSchema>;
export type CanonBlock = typeof canonBlocks.$inferSelect;

// ── Master Cards ─────────────────────────────────────
export const masterCards = sqliteTable("master_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  domain: text("domain").notNull(),
  qtac7: real("qtac7").notNull(),
  thesis: text("thesis").notNull(),
  tags: text("tags").notNull(), // JSON array
  status: text("status").notNull(), // PROTO | META | VERIFIED | SOVEREIGN
  hoverQuote: text("hover_quote").notNull(),
  metricThatMatters: text("metric_that_matters"),
  locked: integer("locked").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertMasterCardSchema = createInsertSchema(masterCards).omit({ id: true });
export type InsertMasterCard = z.infer<typeof insertMasterCardSchema>;
export type MasterCard = typeof masterCards.$inferSelect;

// ── Nominations ──────────────────────────────────────
export const nominations = sqliteTable("nominations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nomineeName: text("nominee_name").notNull(),
  nomineeUrl: text("nominee_url").notNull(),
  reason: text("reason").notNull(),
  nominatorEmail: text("nominator_email").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertNominationSchema = createInsertSchema(nominations).omit({ id: true });
export type InsertNomination = z.infer<typeof insertNominationSchema>;
export type Nomination = typeof nominations.$inferSelect;

// ── Leads (Viral Ingest Widget) ──────────────────────
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  simulatedQtac7: real("simulated_qtac7"),
  createdAt: text("created_at").notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
