import {
  type User, type InsertUser, users,
  type Verdict, type InsertVerdict, verdicts,
  type DailyBlock, type InsertDailyBlock, dailyBlocks,
  type CanonBlock, type InsertCanonBlock, canonBlocks,
  type MasterCard, type InsertMasterCard, masterCards,
  type Nomination, type InsertNomination, nominations,
  type Lead, type InsertLead, leads,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Verdicts
  createVerdict(verdict: InsertVerdict): Promise<Verdict>;
  getVerdict(id: number): Promise<Verdict | undefined>;
  getVerdictsByUser(userId: number, limit?: number): Promise<Verdict[]>;
  getLastVerdict(): Promise<Verdict | undefined>;
  countVerdicts(): Promise<number>;

  // Daily Blocks
  createDailyBlock(block: InsertDailyBlock): Promise<DailyBlock>;
  getDailyBlocksByUser(userId: number): Promise<DailyBlock[]>;

  // Canon Blocks
  createCanonBlock(block: InsertCanonBlock): Promise<CanonBlock>;
  getCanonBlocks(): Promise<CanonBlock[]>;
  getLastCanonBlock(): Promise<CanonBlock | undefined>;
  countCanonBlocks(): Promise<number>;

  // Stats
  getTotalVolts(userId: number): Promise<number>;
  getStreakDays(userId: number): Promise<number>;

  // Master Cards
  getMasterCards(): Promise<MasterCard[]>;
  createMasterCard(card: InsertMasterCard): Promise<MasterCard>;
  countMasterCards(): Promise<number>;

  // Nominations
  createNomination(nomination: InsertNomination): Promise<Nomination>;

  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
}

export class DatabaseStorage implements IStorage {
  // ── Users ──
  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.email, email)).get();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values(insertUser).returning().get();
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    return db.update(users).set(data).where(eq(users.id, id)).returning().get();
  }

  // ── Verdicts ──
  async createVerdict(verdict: InsertVerdict): Promise<Verdict> {
    return db.insert(verdicts).values(verdict).returning().get();
  }

  async getVerdict(id: number): Promise<Verdict | undefined> {
    return db.select().from(verdicts).where(eq(verdicts.id, id)).get();
  }

  async getVerdictsByUser(userId: number, limit?: number): Promise<Verdict[]> {
    const q = db.select().from(verdicts).where(eq(verdicts.userId, userId)).orderBy(desc(verdicts.id));
    if (limit) {
      return q.limit(limit).all();
    }
    return q.all();
  }

  async getLastVerdict(): Promise<Verdict | undefined> {
    return db.select().from(verdicts).orderBy(desc(verdicts.id)).limit(1).get();
  }

  async countVerdicts(): Promise<number> {
    const result = db.select({ count: sql<number>`count(*)` }).from(verdicts).get();
    return result?.count ?? 0;
  }

  // ── Daily Blocks ──
  async createDailyBlock(block: InsertDailyBlock): Promise<DailyBlock> {
    return db.insert(dailyBlocks).values(block).returning().get();
  }

  async getDailyBlocksByUser(userId: number): Promise<DailyBlock[]> {
    return db.select().from(dailyBlocks).where(eq(dailyBlocks.userId, userId)).orderBy(desc(dailyBlocks.id)).all();
  }

  // ── Canon Blocks ──
  async createCanonBlock(block: InsertCanonBlock): Promise<CanonBlock> {
    return db.insert(canonBlocks).values(block).returning().get();
  }

  async getCanonBlocks(): Promise<CanonBlock[]> {
    return db.select().from(canonBlocks).orderBy(desc(canonBlocks.blockNumber)).all();
  }

  async getLastCanonBlock(): Promise<CanonBlock | undefined> {
    return db.select().from(canonBlocks).orderBy(desc(canonBlocks.blockNumber)).limit(1).get();
  }

  async countCanonBlocks(): Promise<number> {
    const result = db.select({ count: sql<number>`count(*)` }).from(canonBlocks).get();
    return result?.count ?? 0;
  }

  // ── Stats ──
  async getTotalVolts(userId: number): Promise<number> {
    const result = db
      .select({ total: sql<number>`coalesce(sum(volts), 0)` })
      .from(dailyBlocks)
      .where(eq(dailyBlocks.userId, userId))
      .get();
    return result?.total ?? 0;
  }

  async getStreakDays(userId: number): Promise<number> {
    const blocks = db
      .select({ date: dailyBlocks.date })
      .from(dailyBlocks)
      .where(eq(dailyBlocks.userId, userId))
      .orderBy(desc(dailyBlocks.date))
      .all();

    if (blocks.length === 0) return 0;

    let streak = 1;
    const today = new Date().toISOString().split("T")[0];
    const latestDate = blocks[0].date;

    // Only count streak if latest entry is today or yesterday
    const latestMs = new Date(latestDate).getTime();
    const todayMs = new Date(today).getTime();
    const diffDays = Math.floor((todayMs - latestMs) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    for (let i = 1; i < blocks.length; i++) {
      const prevMs = new Date(blocks[i - 1].date).getTime();
      const currMs = new Date(blocks[i].date).getTime();
      const gap = Math.floor((prevMs - currMs) / (1000 * 60 * 60 * 24));
      if (gap === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // ── Master Cards ──
  async getMasterCards(): Promise<MasterCard[]> {
    return db.select().from(masterCards).orderBy(desc(masterCards.qtac7)).all();
  }

  async createMasterCard(card: InsertMasterCard): Promise<MasterCard> {
    return db.insert(masterCards).values(card).returning().get();
  }

  async countMasterCards(): Promise<number> {
    const result = db.select({ count: sql<number>`count(*)` }).from(masterCards).get();
    return result?.count ?? 0;
  }

  // ── Nominations ──
  async createNomination(nomination: InsertNomination): Promise<Nomination> {
    return db.insert(nominations).values(nomination).returning().get();
  }

  // ── Leads ──
  async createLead(lead: InsertLead): Promise<Lead> {
    return db.insert(leads).values(lead).returning().get();
  }
}

export const storage = new DatabaseStorage();
