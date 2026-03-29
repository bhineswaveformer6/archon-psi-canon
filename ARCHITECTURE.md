# ARCHON Ψ CANON — Architecture Spec

## Product: Micro SaaS "Verdict-as-a-Service"
- Free tier: 3 verdicts/month
- Pro tier: $49/month unlimited verdicts + full Canon access
- Each verdict runs 6 scoring operators → QTAC₇ + StoneScore + action recommendation
- All verdicts sealed to an append-only Canon ledger with SHA-256 hash chain

## Design Language: "Burberry × Parchment"
- Background: warm parchment `#faf7f2` light / deep `#0f0e0c` dark
- Accent: honey gold `#c8a96e` — ONLY accent, no secondary hues
- Typography: EB Garamond (display, italic for emphasis) + DM Mono (metadata, scores, timestamps)
- Ψ monogram lattice: tiled SVG pattern at 0.04 opacity on body::before
- Border language: 1px borders, 2px border-top accent on pillar cards, 2px left-border on blockquotes
- Top bar: navy `#0d1020` with green live dot + "HCBI NETWORK" in honey monospace
- Cards: matte parchment surface, no gradients on buttons, elevation via background shift

## HSL Values for Tailwind index.css (H S% L% format, no hsl() wrapper):
### Light mode:
- background: 45 33% 97%
- card/surface: 45 25% 97%  
- foreground/text: 40 23% 8%
- muted: 40 10% 90%
- muted-foreground: 40 5% 45%
- primary: 36 40% 60% (honey gold #c8a96e)
- primary-foreground: 40 23% 8%
- accent: 36 40% 60%
- accent-foreground: 40 23% 8%
- border: 36 12% 82%
- input: 36 12% 82%
- ring: 36 40% 60%
- destructive: 0 60% 50%
- destructive-foreground: 0 0% 100%
- secondary: 40 10% 92%
- secondary-foreground: 40 23% 14%
- popover: 45 25% 97%
- popover-foreground: 40 23% 8%
- chart-1: 36 40% 60%
- chart-2: 183 50% 35%
- chart-3: 40 23% 14%
- chart-4: 36 30% 70%
- chart-5: 0 60% 50%
- sidebar-background: 220 60% 9%
- sidebar-foreground: 36 40% 60%
- sidebar-primary: 36 40% 60%
- sidebar-primary-foreground: 0 0% 100%
- sidebar-accent: 220 50% 14%
- sidebar-accent-foreground: 36 40% 60%
- sidebar-border: 220 40% 15%
- sidebar-ring: 36 40% 60%
- radius: 0.5rem

### Dark mode:
- background: 30 8% 5%
- card: 30 8% 7%
- foreground: 36 20% 82%
- muted: 30 5% 12%
- muted-foreground: 36 5% 45%
- primary: 36 40% 60%
- primary-foreground: 30 8% 5%
- accent: 36 30% 15%
- accent-foreground: 36 40% 60%
- border: 30 5% 15%
- input: 30 5% 15%
- ring: 36 40% 60%
- destructive: 0 60% 50%
- destructive-foreground: 0 0% 100%
- secondary: 30 5% 12%
- secondary-foreground: 36 20% 82%
- popover: 30 8% 7%
- popover-foreground: 36 20% 82%

## Data Model (SQLite via Drizzle)

### users table
- id: integer primary key autoincrement
- email: text not null unique
- displayName: text not null
- tier: text not null default "free" (free | pro | enterprise)
- verdictsUsedThisMonth: integer not null default 0
- monthResetDate: text not null (ISO date)
- createdAt: text not null (ISO timestamp)

### verdicts table (StoneVerdictEvent)
- id: integer primary key autoincrement
- userId: integer not null references users
- blockNumber: integer not null
- timestamp: text not null (ISO)
- subjectName: text not null
- subjectTicker: text
- subjectKind: text not null (Company | Person | Nation | Asset | Protocol)
- subjectMarket: text
- subjectSector: text
- operators: text not null (JSON string of all 6 operator blocks)
- qtac7Score: real not null
- qtac7Pink: real not null
- qtac7OmegaGap: real not null
- dimBusiness: real not null
- dimEconomics: real not null
- dimManagement: real not null
- dimMoat: real not null
- dimCompounding: real not null
- dimValuation: real not null
- dimRisk: real not null
- stoneScore: real not null
- verdictText: text not null
- recommendation: text not null
- rangelow: text
- rangeHigh: text
- conditions: text (JSON array string)
- retrialDate: text
- retrialStatus: text default "pending"
- canonHash: text not null
- prevHash: text not null
- sealed: integer not null default 1

### dailyBlocks table
- id: integer primary key autoincrement
- userId: integer not null references users
- date: text not null (ISO date)
- canonWord: text not null
- jewels: text not null (JSON array of {label, detail})
- volts: integer not null
- linkedBlocks: text (JSON array of verdict IDs)
- notesHash: text not null
- rawNotes: text

### canonBlocks table
- id: integer primary key autoincrement
- blockNumber: integer not null unique
- events: text not null (JSON array of verdict IDs)
- volts: integer not null
- hash: text not null
- prevHash: text not null
- sealedAt: text not null (ISO)

## Pages / Routes

### 1. /#/ — Dashboard
- Welcome banner with Ψ glyph
- Stats: total verdicts, active canons, current VOLTs, streak days
- Recent verdicts list (last 5)
- Pricing tier badge + usage meter (3/3 free verdicts used)

### 2. /#/calculator — ARCHON Calculator
- Subject input form (name, ticker, kind, market, sector)
- 6 operator panels (accordion-style, each with key input fields):
  1. BusinessBlock: business description, circle of competence, moat type
  2. EconomicsBlock: ROIC, margins, reinvestment rate, capital efficiency
  3. CompoundingBlock: CAGR, benchmark CAGR, max drawdown, years
  4. FloatBlock: start float, end float, profit margin, reinvestment rate
  5. PeopleBlock: CEO equity %, holder median years, insider net buy score
  6. ErrorsBlock: major errors list, capital at risk, capital lost, design changes
- Auto-compute all scores (CSS, NS, BFS, FS, TBS, AFS)
- QTAC₇ calculation: geometric mean of 7 dimension scores
- StoneScore weighted formula
- PINK risk deflator
- Omega Gap
- Action recommendation engine
- "SEAL TO CANON" button → creates StoneVerdictEvent + appends to chain

### 3. /#/canon — Canon Ledger
- Blockchain-style vertical timeline
- Each block shows: block number, hash (truncated), timestamp, event count, VOLTs
- Click to expand → shows all StoneVerdictEvents in that block
- Hash chain visualization (block → prevHash → next block)
- Search/filter by subject, kind, date range

### 4. /#/mastercard/:id — BuffettMasterCard
- 3-layer expandable card:
  - Layer 1 (Summary): Subject name/ticker, StoneScore gauge, QTAC₇, verdict badge, recommendation
  - Layer 2 (Operators): Expandable accordion showing all 6 operator outputs with metrics
  - Layer 3 (Canon): Hash, block number, retrial date, conditions, Omega Gap trend
- Honey gold accent borders
- Print/export ready layout

### 5. /#/daily — DailyBlock / Log Off
- Full-screen modal-style page
- Step 1: "One word for this day" (single text input)
- Step 2: "Jewels" (multi-line, 3-5 entries with label + detail)
- Step 3: "Anything else that must not be lost?" (textarea)
- VOLTs slider (0-300) + auto-calculation from activity
- "SEAL DAY" button → creates DailyBlock, shows confirmation:
  "Day sealed: [canonWord] — VOLTs: 230 — Blocks touched: 5, 11, 19"
- History of past DailyBlocks below

### 6. /#/pricing — Pricing Gate
- Free tier card: 3 verdicts/month, basic Canon view
- Pro tier card ($49/mo): unlimited verdicts, full Canon, BuffettMasterCards, DailyBlocks, export
- Enterprise card ($199/mo): team canons, API access, custom operators

## Sidebar Navigation
- Navy background (#0d1020)
- Ψ logo glyph at top (honey gold)
- Nav items with honey gold active state:
  - Dashboard (home icon)
  - Calculator (calculator icon)
  - Canon Ledger (link/chain icon)
  - MasterCards (credit-card icon)
  - Daily Block (moon icon)
  - Pricing (zap icon)
- User tier badge at bottom
- Collapsible on mobile

## Key Technical Details
- SHA-256 hash chain: each verdict's canonHash = SHA-256(prevHash + verdictJSON)
- Canon blocks group verdicts by session/day
- QTAC₇ = (Q × T × A × C × D × R × V)^(1/7) where each dimension is 0-10
- StoneScore = Σ Wi × Mi / (1 + PINK_risk)
- All timestamps in ISO 8601
- Responsive down to 375px
- Dark mode default (matches BatcaveOS aesthetic)
