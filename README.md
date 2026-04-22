# ARCHON Ψ — Cognitive Measurement Engine for CortexChain

> *"Venture capital funds cognitive output every day. None of them can see it."*
> — CB-352 · Ψ-001 · B.Hines

[![Canon Ledger](https://img.shields.io/badge/Canon%20Ledger-CB--285%20→%20CB--353-6366f1)](https://cortexchain.io)
[![Status](https://img.shields.io/badge/Status-CANON__ELIGIBLE-22d3ee)](https://cortexchain.io)
[![Identity](https://img.shields.io/badge/Ψ--001-B.HINES-f5c842)](https://cortexchain.io)

---

## What Is ARCHON Ψ?

ARCHON Ψ is the **cognitive measurement kernel** for CortexChain — the first audit-ready scoring engine that converts human neural output into capital-grade scores.

It answers one question that every investor, board, and operator currently cannot:

> **How much cognitive capital did this person, team, or session actually produce — and is it compounding?**

ARCHON Ψ is not a wellness app. It is not a brain health tracker. It is **measurement infrastructure** — the same category of system as a financial ledger, a credit score, or a performance attribution model, applied for the first time to cognitive output.

---

## The Instrumentation Gap

Every fund prices cognitive output. None of them can see it.

Talent acquisitions. Strategic hires. Founder bets. Board-level decisions. Every dollar moved is a bet on someone's mind.

And yet:
- IQ is a hundred-year proxy for a multidimensional system
- Pedigree is geography-dependent correlation
- Gut feel is theater dressed as conviction

The best decision-maker in your portfolio has no verifiable cognitive audit trail. No ledger entry. Just reputation, compounded by pattern-matching.

ARCHON Ψ closes that gap.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CORTEXCHAIN                           │
│         (Infrastructure · Canon Ledger · VOLT)          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   ARCHON Ψ                               │
│            (Cognitive Measurement Kernel)                │
│                                                          │
│  Signals In          Scores Out                          │
│  ─────────           ──────────                          │
│  EEG bands     →     G(t) score [1–10]                   │
│  HRV / ANS     →     QTAC₇ vector [7 dimensions]         │
│  Behavioral    →     Stone Score [0–10]                  │
│  Operational   →     Ω-Gap [claimed vs stress-tested]    │
│                →     VOLT yield [cognitive capital unit]  │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐   ┌──────────────────────┐
│ THE PERFECTIBI- │   │    THE HARVESTOR      │
│ LIST (v2.1)     │   │                       │
│                 │   │  Myndlift · Neurosity  │
│ Live session OS │   │  Muse · HRV · GitHub  │
│ Brain Dist. Map │   │  Calendar · OSINT      │
│ G(t) gauge      │   │                       │
│ VOLT mint UI    │   │  Normalizes → scores  │
│ Longitudinal    │   │  → Canon pipeline     │
└─────────────────┘   └──────────────────────┘
```

---

## Scoring Primitives

### G(t) — Neural Throughput Score

The real-time cognitive output score. Computed from EEG band powers.

```
G(t) = [APR(β) × 0.30 + CI(α) × 0.35 + DCTV(γ) × 0.35] / DRL(δ) × 8

Where:
  APR  = beta_pct / 48         Assembly Rate — execution velocity
  CI   = alpha_pct / 45        Coherence Index — flow gate
  DCTV = gamma_pct / 22        Cross-Domain Transfer Velocity — breakthrough signal
  DRL  = delta_pct / 32        Recovery Load — denominator penalty

Range: 1.0–10.0
Breakthrough Signal (BS): gamma > 16% AND alpha > 30% → 3× VOLT multiplier
```

### QTAC₇ — Seven-Factor Scoring Rubric

The composite quality score across seven dimensions. House invention. Not a scientific claim.

| Factor | Weight | Measures |
|---|---|---|
| Q — Signal Quality | 0.20 | EEG artifact control, session integrity |
| T — Throughput | 0.15 | G(t) average, VOLT yield rate |
| A — Attention | 0.15 | TBR, alpha peak, focus window stability |
| C — Coherence | 0.15 | CI, alpha-gamma coupling, flow consistency |
| D — Compounding | 0.15 | Longitudinal G(t) trend, BS frequency |
| R — Reinvestment | 0.10 | Session discipline, peak window consistency |
| V — Resilience | 0.10 | HRV, ANS balance, recovery debt index |

### Stone Score

Composite investability score. Range 0–10. Bands:

| Band | Score | Meaning |
|---|---|---|
| STRONG YES | ≥ 8.0 | Deploy capital / full commitment |
| BUY | 6.5–7.9 | Favorable, normal position |
| WATCH | 5.0–6.4 | Monitor — insufficient signal |
| PASS | 3.0–4.9 | Do not engage now |
| REJECT | < 3.0 | Hard block |

### Ω-Gap (Omega Gap)

```
Ω-Gap = QTAC₇_claimed − QTAC₇_stress_tested
```

The CB-293 Diamond: *"A system that can refuse its own inflated claim is trustworthy infrastructure."*
No score ships without its Ω-Gap. Self-inflation is an auto-fail.

### VOLT — Cognitive Capital Unit

The CortexChain-native unit of cognitive capital. Minted per session when mint gates pass (CB-341).

```
volt_yield = base_rate × G(t) × state_multiplier × (3.0 if BS else 1.0)
           × session_duration_hours
```

Mint gates (all six required): baseline current · artifact not RED · duration ≥ 8 min · G(t) ≥ 4.0 · μ-purity ≥ 65% · no drift alert.

---

## Signal Sources

ARCHON Ψ ingests from six source classes via **The Harvestor**:

| Source | Type | Primary Operators |
|---|---|---|
| Neurosity Crown | EEG stream (real-time) | APR (focus), CI (calm), DCTV (gamma) |
| Muse + Mind Monitor | EEG + OSC | All band operators, ANS score |
| Myndlift | Clinical qEEG export | CI (alpha peak), DRL (TBR), APR modifier |
| HRV4Training / Polar | HRV + BPM | V (resilience), ANS balance |
| GitHub OSINT | Code + infra signal | V (resilience), governance hygiene |
| Calendar / Context | Behavioral | T (throughput), R (reinvestment) |

Every session emits a unified output contract:
```json
{
  "g_t_score": 7.4,
  "state_primary": "FLOW",
  "stone_score": 8.3,
  "stone_band": "STRONG_YES",
  "volt_estimate": 312,
  "mint_status": "OPEN",
  "archon_psi_vector": {
    "Q": 8.2, "T": 8.0, "A": 8.4,
    "C": 8.1, "D": 7.9, "R": 8.2, "V": 8.5
  },
  "omega_gap": 0.4,
  "canon_ref": "CB-353"
}
```

---

## Products

### The Perfectibilist (v2.1)
**Live:** `https://master-glossary-app-b5993402.base44.app/Perfectibilist`

Neural Bloomberg Terminal for cognitive operators. Three-panel cockpit:
- **State / ANS** — real-time FLOW / FOCUS / RECOVERY / FATIGUE classification
- **G(t) / VOLT** — neural throughput gauge + VOLT mint eligibility
- **Waveforms** — 5-band scrolling EEG strip (δθαβγ), 18-second window, with inline annotations

Tabs: Live Session · Profile · Longitudinal · Harvestor · Protocol

### The Harvestor
**Live:** `https://sir-portal-app-2d3cd697.base44.app/TheHarvestor`

Multi-source signal ingestion engine. Tabs: Myndlift ψ Scorer · Neurosity Crown · GitHub Dork Lab · Pipeline.

Pipeline: `Raw Signal → Mangle → DocBrick → Red Team → Canon Seal → Compound`

---

## Canon Ledger

ARCHON Ψ runs on an append-only Canon Ledger. Every sealed block is immutable.

- **CB-285** — ARCHON Ψ v1.0 Genesis Declaration
- **CB-341** — EEG Calibration + State Desync Guard
- **CB-351** — Ψ-001 Genesis Brand Asset (B.Hines)
- **CB-352** — The Perfectibilist v2 Spec
- **CB-353** — The Harvestor Canonical Spec

Current ledger: CB-274 → CB-353 (active). **CB-353 = latest sealed.**

Canon rules:
- Append-only. No retroactive edits.
- Every score ships with its Ω-Gap.
- 137.037 constant = internal governance only. Never in external documents.
- QTAC₇ and Stone Score are house inventions. Not scientific claims.

---

## Research Basis

ARCHON Ψ is a **house invention** built on externally documented substrate:

| Substrate | Source |
|---|---|
| Graph centrality as cognitive influence proxy | Standard network science |
| Cognitive capital as measurable asset | Heckman et al. (non-cognitive skills) |
| EEG band ratios as state markers (TBR, α/β) | Bazanova & Vernon (2014); multiple replications |
| HRV as ANS / cognitive load proxy | Thayer & Lane (2009) |
| VC cognitive bias in decision-making | Zacharakis & Shepherd (2001); Franke et al. (2006) |
| Ultra-short EEG + HRV for well-being scoring | bioRxiv 2024.02.23.581823 |

**Canonical positioning (use verbatim externally):**

> *"ARCHON Ψ is a CortexChain-native scoring stack inspired by cognitive capital research, biometric validation, and graph centrality. QTAC₇ and Stone Score are house inventions — not scientific claims. The moat is the deployed engine, the Canon Ledger corpus, and the burn-gate traction model."*

---

## Getting Started

### For founders / citizen scientists
1. Open [The Perfectibilist](https://master-glossary-app-b5993402.base44.app/Perfectibilist)
2. Connect Muse headband + Mind Monitor (OSC port 5000) or simulate
3. Run a session (8-min minimum for mint eligibility)
4. Review state arc, G(t), and VOLT yield
5. Mint eligible sessions → they seal to Canon

### For developers
```bash
# The Harvestor input contract (Muse OSC)
POST /harvestor/ingest
{
  "source": "muse_osc",
  "delta_abs": 0.42, "theta_abs": 0.31,
  "alpha_abs": 0.68, "beta_abs": 0.55, "gamma_abs": 0.18,
  "hrv_sdnn": 62, "bpm_mean": 68,
  "signal_quality": 0.84,
  "context": "deep_work",
  "duration_sec": 1440
}

# Returns
{
  "g_t_score": 7.4,
  "state": "FLOW",
  "volts": 247,
  "mint_status": "OPEN",
  "archon_psi_vector": { ... }
}
```

### For allocators + NSF reviewers
- Architecture overview: this README
- Scoring spec: [`CB-352 Perfectibilist Spec`](docs/THE_PERFECTIBILIST_V2_SPEC.md)
- Signal ingestion spec: [`CB-353 Harvestor Spec`](docs/THE_HARVESTOR_SPEC_v1.0.md)
- Brand identity: [`CB-351 Ψ-001 Genesis Asset`](docs/PSI001_GENESIS_BRAND_ASSET_v1.0.md)
- Canon declaration: [`CB-285 ARCHON Ψ v1.0`](docs/ARCHON_PSI_V1_0_DECLARATION.json)

---

## Identity

```
Ψ-001 · B.HINES · <€£¥$V^6>

CortexChain, Inc. / Waveform Tech
archon-psi-canon · April 2026
```

`<€£¥$V^6>` = six-dimensional capital context:
€ (European) · £ (Sterling) · ¥ (East-West) · $ (Reserve) · V (VOLTs) · ^6 (six measurement layers)

---

*ARCHON Ψ is a house invention. QTAC₇, Stone Score, G(t), VOLT, Canon Ledger, and burn-gate are proprietary CortexChain primitives. This is not investment advice. This is measurement infrastructure.*

*© 2026 CortexChain, Inc. / Waveform Tech — All rights reserved.*
