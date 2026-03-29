import type { Express } from "express";
import { createServer, type Server } from "http";
import { createHash } from "crypto";
import { storage } from "./storage";

function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

// Demo user for MVP (no auth)
const DEMO_EMAIL = "demo@archon.canon";
const DEMO_NAME = "Demo User";

async function getOrCreateDemoUser() {
  let user = await storage.getUserByEmail(DEMO_EMAIL);
  if (!user) {
    user = await storage.createUser({
      email: DEMO_EMAIL,
      displayName: DEMO_NAME,
      tier: "free",
      verdictsUsedThisMonth: 0,
      monthResetDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    });
  }
  return user;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ── POST /api/users — create/get demo user ──
  app.post("/api/users", async (_req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/verdicts — create a new StoneVerdictEvent ──
  app.post("/api/verdicts", async (req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      const body = req.body;

      // Get last verdict for hash chain
      const lastVerdict = await storage.getLastVerdict();
      const prevHash = lastVerdict?.canonHash || sha256("GENESIS");

      // Compute block number
      const totalVerdicts = await storage.countVerdicts();
      const blockNumber = totalVerdicts + 1;

      // Build verdict data for hashing
      const verdictData = {
        blockNumber,
        subjectName: body.subjectName,
        subjectTicker: body.subjectTicker,
        subjectKind: body.subjectKind,
        operators: body.operators,
        qtac7Score: body.qtac7Score,
        stoneScore: body.stoneScore,
        timestamp: new Date().toISOString(),
      };

      // SHA-256 hash chain
      const canonHash = sha256(prevHash + JSON.stringify(verdictData));

      const verdict = await storage.createVerdict({
        userId: user.id,
        blockNumber,
        timestamp: new Date().toISOString(),
        subjectName: body.subjectName,
        subjectTicker: body.subjectTicker || null,
        subjectKind: body.subjectKind,
        subjectMarket: body.subjectMarket || null,
        subjectSector: body.subjectSector || null,
        operators: body.operators,
        qtac7Score: body.qtac7Score,
        qtac7Pink: body.qtac7Pink,
        qtac7OmegaGap: body.qtac7OmegaGap,
        dimBusiness: body.dimBusiness,
        dimEconomics: body.dimEconomics,
        dimManagement: body.dimManagement,
        dimMoat: body.dimMoat,
        dimCompounding: body.dimCompounding,
        dimValuation: body.dimValuation,
        dimRisk: body.dimRisk,
        stoneScore: body.stoneScore,
        verdictText: body.verdictText,
        recommendation: body.recommendation,
        rangeLow: body.rangeLow || null,
        rangeHigh: body.rangeHigh || null,
        conditions: body.conditions || null,
        retrialDate: body.retrialDate || null,
        retrialStatus: "pending",
        canonHash,
        prevHash,
        sealed: 1,
      });

      // Increment user verdicts count
      await storage.updateUser(user.id, {
        verdictsUsedThisMonth: (user.verdictsUsedThisMonth || 0) + 1,
      });

      // Create or update canon block for this session
      const lastCanon = await storage.getLastCanonBlock();
      const canonBlockNumber = (lastCanon?.blockNumber || 0) + 1;
      const canonPrevHash = lastCanon?.hash || sha256("GENESIS_CANON");
      const canonBlockHash = sha256(canonPrevHash + JSON.stringify({ verdictId: verdict.id, blockNumber: canonBlockNumber }));

      await storage.createCanonBlock({
        blockNumber: canonBlockNumber,
        events: JSON.stringify([verdict.id]),
        volts: 0,
        hash: canonBlockHash,
        prevHash: canonPrevHash,
        sealedAt: new Date().toISOString(),
      });

      res.json(verdict);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/verdicts — list verdicts ──
  app.get("/api/verdicts", async (_req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      const results = await storage.getVerdictsByUser(user.id);
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/verdicts/:id — get single verdict ──
  app.get("/api/verdicts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const verdict = await storage.getVerdict(id);
      if (!verdict) return res.status(404).json({ error: "Not found" });
      res.json(verdict);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── POST /api/daily-blocks — seal a DailyBlock ──
  app.post("/api/daily-blocks", async (req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      const body = req.body;
      const today = new Date().toISOString().split("T")[0];
      const notesHash = sha256(body.rawNotes || "");

      const block = await storage.createDailyBlock({
        userId: user.id,
        date: today,
        canonWord: body.canonWord,
        jewels: body.jewels || "[]",
        volts: body.volts || 0,
        linkedBlocks: body.linkedBlocks || null,
        notesHash,
        rawNotes: body.rawNotes || null,
      });

      res.json(block);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/daily-blocks — list DailyBlocks ──
  app.get("/api/daily-blocks", async (_req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      const blocks = await storage.getDailyBlocksByUser(user.id);
      res.json(blocks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/canon-blocks — list canon blocks with verdict details ──
  app.get("/api/canon-blocks", async (_req, res) => {
    try {
      const canonBlocksList = await storage.getCanonBlocks();

      // Attach verdict details
      const enriched = await Promise.all(
        canonBlocksList.map(async (block) => {
          const eventIds: number[] = JSON.parse(block.events || "[]");
          const verdictDetails = await Promise.all(
            eventIds.map((id) => storage.getVerdict(id))
          );
          return {
            ...block,
            verdictDetails: verdictDetails.filter(Boolean),
          };
        })
      );

      res.json(enriched);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/stats — dashboard statistics ──
  app.get("/api/stats", async (_req, res) => {
    try {
      const user = await getOrCreateDemoUser();
      const totalVerdicts = await storage.countVerdicts();
      const activeCanons = await storage.countCanonBlocks();
      const currentVolts = await storage.getTotalVolts(user.id);
      const streakDays = await storage.getStreakDays(user.id);

      res.json({
        totalVerdicts,
        activeCanons,
        currentVolts,
        streakDays,
        verdictsUsedThisMonth: user.verdictsUsedThisMonth,
        tier: user.tier,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Masters Registry Routes ──

  // Seed master cards on first run
  async function seedMasterCards() {
    const count = await storage.countMasterCards();
    if (count > 0) return;

    const now = new Date().toISOString();
    const seedData = [
      {
        code: "MC-T001",
        name: "Tony Wilson",
        role: "Basketball Shot Architect",
        domain: "GENESIS TRAINER",
        qtac7: 9.6,
        thesis: "Every shot is a physics experiment. 300 perfect reps rewire the cerebellum.",
        tags: JSON.stringify(["IMPACT", "FRAMEWORK", "SCIENCE", "RESULTS", "ENGAGE"]),
        status: "SOVEREIGN",
        hoverQuote: "Form before speed. Always.",
        metricThatMatters: "Shot conversion rate under pressure",
        locked: 0,
        createdAt: now,
      },
      {
        code: "MC-R001",
        name: "Ryan Moeller",
        role: "HCBI Network Founder",
        domain: "CAPITAL ARCHITECT",
        qtac7: 9.2,
        thesis: "Human capital infrastructure requires the same rigor as financial infrastructure.",
        tags: JSON.stringify(["CAPITAL", "SYSTEMS", "NETWORK", "ALIGNMENT"]),
        status: "VERIFIED",
        hoverQuote: "Infrastructure scales; individuals don't.",
        metricThatMatters: "Network density coefficient",
        locked: 1,
        createdAt: now,
      },
      {
        code: "MC-B001",
        name: "Brandon Hines",
        role: "Founder & Sovereign Architect, CortexChain",
        domain: "SOVEREIGN ARCHITECT",
        qtac7: 9.4,
        thesis: "Measurement infrastructure for human cognitive output.",
        tags: JSON.stringify(["ARCHITECTURE", "COGNITION", "CAPITAL", "MOAT", "COMPOUNDING"]),
        status: "SOVEREIGN",
        hoverQuote: "If you can't measure it, you can't compound it.",
        metricThatMatters: "Cognitive output per capita",
        locked: 1,
        createdAt: now,
      },
    ];

    for (const card of seedData) {
      await storage.createMasterCard(card);
    }
  }

  // Run seed
  seedMasterCards().catch(console.error);

  // GET /api/masters — list all master cards
  app.get("/api/masters", async (_req, res) => {
    try {
      const masters = await storage.getMasterCards();
      res.json(masters);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/nominations — submit a nomination
  app.post("/api/nominations", async (req, res) => {
    try {
      const body = req.body;
      if (!body.nomineeName || !body.nomineeUrl || !body.reason || !body.nominatorEmail) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const nomination = await storage.createNomination({
        nomineeName: body.nomineeName,
        nomineeUrl: body.nomineeUrl,
        reason: body.reason,
        nominatorEmail: body.nominatorEmail,
        createdAt: new Date().toISOString(),
      });
      res.json(nomination);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/leads — submit viral ingest widget
  app.post("/api/leads", async (req, res) => {
    try {
      const body = req.body;
      if (!body.email || !body.linkedinUrl) {
        return res.status(400).json({ error: "Email and LinkedIn URL are required" });
      }
      // Simulate QTAC7 score between 6.0 and 9.5
      const simulatedQtac7 = Math.round((6.0 + Math.random() * 3.5) * 10) / 10;
      const lead = await storage.createLead({
        email: body.email,
        linkedinUrl: body.linkedinUrl,
        simulatedQtac7,
        createdAt: new Date().toISOString(),
      });
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return httpServer;
}
