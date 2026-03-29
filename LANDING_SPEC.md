# ARCHON Ψ CANON — Viral Landing Page Spec (Masters Registry)

## Route: /#/registry (new public-facing page, add to sidebar as "Registry" with Users icon)

## Design Language
- Light/white background (#F9FAFB), cards pure white with 1px #E5E7EB border
- Typography: same EB Garamond + DM Mono already loaded
- Weights 300/400 for body, 500 for labels; no bold except scores
- Accent: soft gold (use existing primary #c8a96e sparingly — only QTAC₇ score + pill outlines)
- Hover elevation: 150ms ease-out card lift
- CTA buttons with subtle 1px inner shadow "banking UI" feel

## Page Sections (Single Scroll)

### 1. Above the Fold — Hero
- Tiny top-left: "CORTEXCHAIN · HUMAN CAPITAL EXCHANGE" (mono, light gray, text-xs)
- Top-right: "Masters Registry · Sovereign Directory · Signal Box" as ghost tabs (only Registry active, others dimmed)
- Center hero block:
  - H1: "The Central Bank for Human Capital." (font-serif italic)
  - Subhead: "A living catalog of sovereign-grade masters, verified, scored, and built to compound human outcomes." (font-mono text-sm text-muted-foreground)
  - CTA row:
    - Primary button: "Browse Masters" (scrolls to #masters)
    - Ghost button: "Nominate a Master" (opens nomination form dialog)
- Keep minimal. Maximum whitespace.

### 2. Mode Switcher — Three Tabs
Three big tabs (no routing, just in-page state switches):
- **CATALOG** (default) — Grid of featured MasterCards
- **OPERATOR** — Personal MasterCard builder with greyed-out slots
- **MARKET** — Bloomberg-style ticker strip for human capital

### 3. CATALOG Mode (default)
Horizontal scrollable strip of 3 featured MasterCards, then vertical feed below.

**Featured Cards (hardcoded seed data):**

Card 1 — Tony Wilson:
- Code: MC-T001 · GENESIS TRAINER
- Name: Tony Wilson
- Role: Basketball Shot Architect
- QTAC₇: 9.6
- Thesis: "Every shot is a physics experiment. 300 perfect reps rewire the cerebellum."
- Tags: IMPACT · FRAMEWORK · SCIENCE · RESULTS · ENGAGE
- Status: SOVEREIGN (green badge)
- Hover quote: "Form before speed. Always."

Card 2 — Ryan Moeller:
- Code: MC-R001 · CAPITAL ARCHITECT
- Name: Ryan Moeller
- Role: HCBI Network Founder
- QTAC₇: 9.2
- Thesis: "Human capital infrastructure requires the same rigor as financial infrastructure."
- Tags: CAPITAL · SYSTEMS · NETWORK · ALIGNMENT
- Status: VERIFIED (blue badge)
- Locked: shows meta view on click, not full schema

Card 3 — Brandon Hines:
- Code: MC-B001 · SOVEREIGN ARCHITECT
- Name: Brandon Hines
- Role: Founder & Sovereign Architect, CortexChain
- QTAC₇: 9.4
- Thesis: "Measurement infrastructure for human cognitive output."
- Tags: ARCHITECTURE · COGNITION · CAPITAL · MOAT · COMPOUNDING
- Status: SOVEREIGN (gold badge)
- Locked: shows meta view + "View Operator Rail" button

Each card layout:
- White bg, 1px border, 2px top-border in gold for SOVEREIGN cards
- Tag at top: "MC-XXXX · TIER" in mono text-xs
- Name (font-serif) + role (font-mono text-xs muted)
- Big QTAC₇ score (font-mono text-2xl text-primary)
- Chip row: tags as tiny pills with 1px border
- Status badge: PROTO (gray) → META (amber) → VERIFIED (blue) → SOVEREIGN (gold)
- Hover: card lifts + shows 1-sentence quote below name
- Share chips: "Copy URL" + "Share to X/LinkedIn"

### 4. OPERATOR Mode
Shows a "zoomed" personal MasterCard template:
- Left: identity block (avatar placeholder circle, name input, role input)
- Right: ARCHON Ψ band:
  - "QTAC₇: —.— (awaiting data)" in large mono
  - "1 Metric That Matters: We'll compute this from your live footprint."
  - 4 operator slots (greyed out):
    1. Operating Edge
    2. Compounding Motion
    3. Pattern Library
    4. Proof of Repeatability
  - All greyed until ingest completes
- CTA: "Complete My MasterCard →" (links to /#/calculator)

### 5. MARKET Mode
Bloomberg-style ticker strip:
- Horizontal scrolling ticker: "MC-T001 TONY · 9.6 ↑ · MC-R001 RYAN · 9.2 → · MC-B001 BRANDON · 9.4 ↑"
- Each symbol hover: mini card popup with thesis + primary metric
- Label: "ARCHON Ψ Human Capital Exchange — Real-Time"
- Below ticker: simple table view of all masters (code, name, QTAC₇, status, 1MTM)

### 6. Signal Box (at ~60% scroll)
Ultra-simple panel:
- Quote: "Signal Box — Paste a company, we turn it into a sovereign-grade card."
- Single textarea input
- "Generate Card" button
- On submit: show animated progress steps:
  1. "Ingesting signal..."
  2. "Mapping frameworks..."
  3. "Calculating QTAC₇..."
  4. "Extracting the One Metric That Matters..."
- Then redirect to /#/calculator with pre-filled subject name

### 7. Viral Ingest Widget (pinned right side on desktop, below hero on mobile)
- Title: "Generate your MasterCard in 30 seconds."
- Fields: Email + LinkedIn URL
- CTA: "Compute My QTAC₇ →"
- On submit: animated progress with 4 labeled steps
- Output: QTAC₇ score display + "Email me my MasterCard draft" + "Open full Operator view"
- For MVP: simulate the computation, store the email in DB, redirect to calculator

### 8. Nomination Form (Dialog)
- Fields: Name, LinkedIn/Website, "Why this person?", Your email
- Submit saves to a new nominations table
- Shows: "Nomination received. We'll review and mint a Proto MasterCard."

### 9. Footer
- Left: "Powered by ARCHON Ψ · QTAC₇ Verified Rails"
- Right: "NVIDIA Inception · CortexChain, Inc."
- Minimal, mono, text-xs

## New Schema Additions

### masterCards table (seed data for featured masters)
- id: integer PK
- code: text (MC-T001)
- name: text
- role: text  
- domain: text
- qtac7: real
- thesis: text
- tags: text (JSON array)
- status: text (PROTO | META | VERIFIED | SOVEREIGN)
- hoverQuote: text
- metricThatMatters: text
- locked: integer (0 or 1)
- createdAt: text

### nominations table
- id: integer PK
- nomineeName: text
- nomineeUrl: text
- reason: text
- nominatorEmail: text
- createdAt: text

### leads table (from viral ingest widget)
- id: integer PK
- email: text
- linkedinUrl: text
- simulatedQtac7: real
- createdAt: text

## New API Routes
- GET /api/masters — list all master cards
- POST /api/nominations — submit a nomination
- POST /api/leads — submit viral ingest widget (email + LinkedIn)
- GET /api/leads/:id — get lead status (for follow-up)

## Viral Mechanics Built Into the Page
1. Each MasterCard has "Copy public card URL" + "Share to X/LinkedIn" chip
2. Share copy: "[Name] is a [Status] Master on the ARCHON Registry. QTAC₇: [score]. cortexchain.io/masters/[code]"
3. "Nominate a Master" is prominent — drives organic referrals
4. Signal Box captures founder intent as warm leads
5. Ingest widget captures email + LinkedIn = growth primitive
