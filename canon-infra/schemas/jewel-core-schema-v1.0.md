# Jewel-Core Schema · v1.0
## Lane-Neutral Primitive · Ratified 2026-05-16

---

## I. Status & Scope

Jewel-Core is **substrate-level**. It sits *below* every lane, not inside any one. Lane K may use it. A-MONEY may score against it. Neither owns it. This avoids dependency inversion: a primitive cannot be owned by something it underlies.

Authority of this doc: ratified by Architect Ψ-001 on Day III.f under disposition `PRIMITIVE`. Adopted under canon-infra v1.0 as a companion schema (alongside `receipt-line-v1.md`).

## II. The Two Variables

### S — Sovereignty
The object's ability to **command reality across time**.

- Confers legitimacy, authority, succession (crowning, sealing, enthroning)
- Cannot be trivially substituted; presence is irreplaceable
- "Changes the room" — alters the calculus of every other object near it

**Operational proxy signals:**
- Exclusivity of use (state-ritual linkage, ceremonial monopoly)
- Legal custody constraints (export prohibitions, sovereign claim)
- Coercive legitimacy (the object's withdrawal would destabilize the system)
- Substitution cost (no near-equivalent exists at acceptable cost)

### M — Mensura (Measure)
The object's ability to **prove reality**.

- Legible structure, repeatable verification
- Provenance chain, inscriptions, calibration, standards adherence
- "Survives audit" without myth carrying the weight

**Operational proxy signals:**
- Documentation depth (chain-of-custody continuity, gap density)
- Attestation density (number and independence of witnesses)
- Reproducible tests (canonicalization, hash, recomputation)
- Unambiguous identifiers (URN, sha256, museum accession, mint mark)

## III. The Gate

```
Jewel-Core = min(S, M)
```

The weaker pillar sets the ceiling. There is no compensation rule: a strong S does not offset a weak M, and a strong M does not offset a weak S.

This is **the strict gate**. Pass-through scoring (averages, weighted sums, geometric means) are explicitly out of canon for Jewel-Core determination.

## IV. Failure Modes — Rejection Rules

| Configuration | Diagnosis | Disposition |
|---|---|---|
| S high · M low | **Tyranny** — authority without proof | REJECT from Jewel-Core; may still be canon under a different rubric (e.g., mythic-only) |
| S low · M high | **Vanity** — measurement without command | REJECT from Jewel-Core; may still be canon as analytical artifact |
| S low · M low | **Mass good** | REJECT; ordinary artifact |
| S high · M high | **Jewel-Core eligible** | Proceed to tier classification (Section V) |

These are *first-pass rejection rules*. They do not erase the object — they reroute it.

## V. Tiers

| Tier | Condition | Operational Reading |
|---|---|---|
| **Foundation** | One pillar above threshold, other present but weak | Object is *of the class* but not *at the apex* — useful, not civilization-grade |
| **Sealed Jewel** | Both pillars above threshold | Civilization-grade; eligible for canon centerpiece status |
| **Crowned Jewel** | Both pillars high AND tightly coupled (S and M reinforce each other) | Apex; civilization primitive; anchor of law, succession, memory |

Threshold values are scale-dependent and set per-lane on adoption. Lane K (0–20 Kingmakers register) and A-MONEY (0–100 Currents register) will set thresholds at adoption time.

## VI. The Hermes Interpreter Layer (optional)

```
Hermes = Da Vincian × Thothian
```

Where:

- **Da Vincian** — builder's intelligence (systems, mechanics, design, interoperability)
- **Thothian** — scribe's intelligence (measurement, language, records, cosmic order)
- **Hermes** — the synthesis layer: communication, commerce, verification; the messenger who carries value across domains; the protocol that makes sovereignty *portable* without becoming counterfeit

Hermes is the **scoring interpreter**: it converts mythic authority (S) and measurable proof (M) into a transferable, ledgerable artifact class. It is *optional* — Jewel-Core scoring works without Hermes. Adoption of Hermes adds an explicit transfer/translation protocol layer.

## VII. ApexValue Operator (optional, sixfold compounding)

For canon work that needs an amplifier beyond the strict gate:

```
HermesFactor = clamp(0, 100, (S + M) / 2)
JewelCore    = min(S, M)
ApexValue    = JewelCore × (1 + HermesFactor / 100) ^ 6
```

The exponent `6` reflects the sixfold lifecycle (DRAFT → PROBATION → SEALED → ISSUED → ATTESTED → SETTLED) and the Six-Word Chain governance discipline.

ApexValue is *derived*, not foundational. The strict gate `min(S, M)` remains the canon definition of Jewel-Core. ApexValue is for ordering above the gate, not for substituting it.

## VIII. Application Guidance Per Lane

### Lane K · KINGMAKERS_CODEX
Map QJR-PV1 four-axis (Doctrinal weight, Materials density, Provenance chain length, Current legibility) onto S and M:
- **S ←** Doctrinal weight + Current legibility (combined; both relate to command/authority)
- **M ←** Materials density + Provenance chain length (combined; both relate to provable structure)

Re-tier the 60 objects under `min(S, M)`. Crowned Jewels at the apex; Sealed Jewels mid; Foundation at the floor.

### Lane A · A-MONEY
The 6-axis composite (C/K/A/T/D/S) may be collapsed:
- **S-pillar ←** Sovereignty (S) + Dominance (D) + Constraint Power (K)
- **M-pillar ←** Auditability (A) + Compression (C) + Transferability (T)

Day Crown computation can then apply `min(S, M)` as the gate, with the existing 6-axis indices preserved as sub-scores for granularity.

**Note (per disposition H on A-MONEY React app):** the React app's alternate 6-axis schema must reconcile against this primitive before entering canon. Reconciliation is the Schema Migration Proposal blocker.

### Lane NC · NEURAL_CAPITAL / HPBI
Map onto HPBI Index Family:
- **S-pillar ←** HPBI-Ψ (sovereign cognitive structure) + HPBI-Ω (operational dominance)
- **M-pillar ←** HPBI-Δ (learning velocity, auditable trajectory) + IMCM evidence chain density

Jewel-Core eligibility at HPBI-Level 3 (ANCHORED) required for `Sealed Jewel` and above.

### Other lanes (B, V, T, S, R when opened)
Adopt as needed. Schema is lane-agnostic by design.

## IX. Tyranny/Vanity Rejection — Operating Discipline

Before any canon claim asserts apex status, the rejection check runs:

```
if S > threshold and M <= threshold:
    diagnose: TYRANNY
    reroute: alternative rubric or Antechamber
    do not award Jewel-Core tier

if M > threshold and S <= threshold:
    diagnose: VANITY
    reroute: analytical archive
    do not award Jewel-Core tier
```

This discipline is *non-negotiable* under PRIMITIVE disposition. A measurement system that does not enforce it is not running Jewel-Core canon, regardless of what scores it computes.

## X. Version & Provenance

- **Version:** Jewel-Core Schema v1.0
- **Sealed at:** 2026-05-16 (Day III.f)
- **Disposition:** PRIMITIVE (lane-neutral)
- **Companion to:** canon-infra v1.0 · `receipt-line-v1.md` · `compute_attestation.js` · `attest-manifest.yml`
- **Architect:** Brandon Mark Hines / Psi-001
- **House:** House of Orange / ARCHON Ψ Atelier
- **Provenance chain:** ratified Day III.f under VOTE `Jewel-Core=PRIMITIVE` following sibling proposal across two iterations
- **Hash:** computed on save (separate from in-doc reference)

---

*End of Jewel-Core Schema v1.0.*
