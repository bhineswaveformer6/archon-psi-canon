# NC-WORD-0001 · HPBI: Definitions, Evidence Levels, and Receipt Requirements

**Lane NC · v0.1 · DRAFT · Sealed 2026-05-16**
**Architect: Brandon Mark Hines / Psi-001 · House of Orange · ARCHON Ψ Atelier**

---

## I. What HPBI Is (and Is Not)

**HPBI — Human Potential Balance Sheet Intelligence** — is the financial grammar that translates measurable human–AI cognitive production into auditable enterprise signal. It is *not* a single score, a generic talent index, or an HR competency framework.

HPBI is the *family of indices* that emerges from a disciplined proof sequence (IMCM) and is curated by a coherence layer (ARCHON Ψ). It supports compensation, talent allocation, diligence, and — at scale — assetization rails.

**What HPBI is not:**
- Not a vague-trait score ("creativity," "intelligence," "potential")
- Not surveillance: it requires consent, transparency, and auditability
- Not pseudo-science: it scores observable, timestamped, economically relevant cognitive events only
- Not a master number: it is a *family* of indices, never a single composite

## II. The Three Constructs

| Construct | Role | Function |
|---|---|---|
| **IMCM** | Evidence Sequence | Defines what counts as evidence in a cognitive event |
| **HPBI Index Family** | Indices | Converts evidence into Δ, Ω, Ψ scores |
| **ARCHON Ψ** | Coherence Layer | Tracks score evolution over time across people, teams, systems |

## III. The IMCM Proof Sequence

**IMCM = Intent · Motion · Conversion · Monetization.** Every canonical HPBI event must pass through these four stages.

| Stage | Question | Evidence to Capture |
|---|---|---|
| **Intent** | What problem was the subject trying to solve? | Objective, context, strategic purpose, success criteria |
| **Motion** | What cognitive work actually occurred? | Reading, synthesis, prompting, editing, judgment, design, decision, revision trace |
| **Conversion** | What artifact or decision came out of the work? | Draft, playbook, recommendation, code, deal memo, plan, revised decision |
| **Monetization** | Did the output create persistent value? | Revenue, margin, risk reduction, speed gain, reuse, cost savings, durable asset |

An event missing any stage is a *partial event*. Partial events may be captured for context but cannot be scored at the highest evidence level.

## IV. The HPBI Index Family

Three indices. Greek-letter naming reflects ARCHON Ψ lineage (Δ for change, Ω for output magnitude, Ψ for sovereign coherence).

| Index | Measures | Why It Matters |
|---|---|---|
| **HPBI-Δ** | Learning velocity and adaptation rate | Who compounds capability in an AI-native environment |
| **HPBI-Ω** | Operational output tied to revenue, margin, and risk | Who converts cognition into organizational performance |
| **HPBI-Ψ** | Coherence, originality, sovereign cognitive structure | Whether output is durable, differentiated, strategically reusable |

A complete HPBI claim names which index it scores, the evidence chain that supports the score, and the lifecycle state of the underlying receipt.

## V. Evidence Levels

Every HPBI claim is graded by the strength of its receipt chain. Three levels.

### Level 1 · ASSERTED
- **Capture only.** Event recorded as raw activity log with timestamp + author + context.
- **No external witness.** Self-report or single-source trace.
- **Use:** internal exploration, prototype scoring, calibration.
- **What scoring is permitted:** none. Level 1 events feed the capture pipeline but cannot be quoted as HPBI scores externally.

### Level 2 · OBSERVED
- **Capture + Normalize.** Event passes through normalization: tagged event stream, evidence class assigned, outcome type tagged, confidence interval recorded.
- **At least one external trace.** An artifact (draft, code commit, doc revision, transcript) exists outside the subject's own self-report.
- **Use:** internal HPBI scoring, team-level dashboards, longitudinal trajectory analysis.
- **What scoring is permitted:** HPBI-Δ and HPBI-Ψ may be reported with `confidence: medium`. HPBI-Ω requires Level 3.

### Level 3 · ANCHORED
- **Capture + Normalize + Score + Ledger.** Event is anchored to a verifiable outcome with attribution.
- **Receipt chain complete.** All four IMCM stages have evidence. Outcome is third-party-checkable (revenue line, shipped artifact, citation, signed memo).
- **Use:** external claims, market-facing scoring, diligence, compensation logic, assetization rails.
- **What scoring is permitted:** all three indices, full `confidence: high`. Eligible for Neural Capital Pool inclusion.

## VI. Receipt Requirements per Level

| Field | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Timestamp | required | required | required |
| Author / subject identity | required | required | required |
| Intent statement | optional | required | required |
| Motion trace (artifact link) | optional | required | required |
| Conversion artifact | optional | required (≥1) | required (≥1) |
| Monetization outcome | — | optional | required |
| External witness | — | ≥1 | ≥2 OR third-party signature |
| Cross-lane anchor | — | recommended | required for any neural/legal claim |
| Hash + canon-infra attestation | optional | required | required |

## VII. Cross-Lane Anchoring Rules

- A Level-3 HPBI claim that asserts a **neural or biosignal** effect **must** anchor to a **Lane N** asset by sha256 reference. The Lane N asset stays in Lane N; Lane NC carries only the citation hash.
- A Level-3 HPBI claim that makes a **market or pricing** claim **must** anchor to a **canon-infra attestation receipt**.
- A Level-3 HPBI claim that quotes **voice or lexicon doctrine** **must** anchor to a **Lane V** asset by sha256.
- A Level-3 HPBI claim that asserts a **legal or contractual** structure **must** anchor to a **Lane R** asset (when Lane R opens).

Unanchored Level-3 claims are demoted to Level 2 until the anchor is supplied.

## VIII. Governance Principles

Five hard constraints, drawn from brain-capital governance literature and ARCHON Ψ doctrine:

1. **Voluntary.** No capture without explicit subject consent.
2. **Auditable.** Every score change carries a logged reason.
3. **Transparent in attribution.** Subjects can read all their own receipts.
4. **Explicit data rights.** Retention period, use scope, and revocation rights defined per receipt.
5. **AI as cognitive ally, not authority.** AI participates inside governance boundaries, never as the final judge of a human's own cognition.

A measurement system that violates any of these is *not* HPBI under this canon, regardless of what indices it computes.

## IX. Open Problems

Substrate ingested at Lane NC v0.1 names the following active gaps. NC-WORD-0001 inherits them as the working problem set:

- Live event capture across real workflows (not lab simulation)
- Threshold rules and calibration for index normalization
- Verification hierarchy and receipt-quality scoring (a meta-receipt for receipts)
- Stability of scores across people, domains, and time
- Third-party-checkable trace from output to real source
- Longitudinal calibration (is cognition improving or decaying?)
- Verification rules that survive contradiction and revision
- Institution-ready governance with consent + transparency + bounded rights
- A single canonical scoring primitive across all surfaces

## X. Version & Provenance

- **Version:** NC-WORD-0001 v0.1 · DRAFT
- **Sealed at:** 2026-05-16
- **Lane:** NC (Neural Capital / HPBI)
- **Charter reference:** `charters/lane-nc-charter-v0.1.md`
- **Substrate references (sha256, partial list):**
  - `NC-DOC-0012` (LinkedIn Whitepaper): `ea45decfc564b98ad4050cb2fab650aeb7f0e088761701b805f29bb97958a79a`
  - `NC-DOC-0015` (HPBI as a Measurement Stack): `451051829881c44ee4b87062198eed65d6c0936fcc397ba762a2257ada02c125`
  - Plus 14 additional substrate items per Lane NC v0.1.0 ingestion manifest
- **Promotion gate:** this document moves DRAFT → PROBATION upon architect ratification.

---

*End of NC-WORD-0001 v0.1 DRAFT.*
