# THE HARVESTOR — Canonical Spec
## Multi-Source Signal Engine · ARCHON Ψ Ingestion Layer
**Block:** CB-353 · **Status:** CANON_ELIGIBLE
**Date:** April 22, 2026 · **Author:** MASTER GLOSSARY · Ψ̂-001
**Drop targets:**
- `archon-psi-canon/docs/THE_HARVESTOR_SPEC_v1.0.md`
- SirPortal: `/TheHarvestor` (UI live)
- MASTER GLOSSARY: `/Perfectibilist` → 🔬 Harvestor tab

---

## 1. PRODUCT ROLE

The Harvestor is the **signal normalization and scoring engine** that sits between raw bio/operational data and ARCHON Ψ. It does not score opinions — it scores signals.

**One-sentence definition:**
> The Harvestor ingests EEG, HRV, and operational signals from multiple sources, normalizes them to a common schema, maps each to ARCHON Ψ operators, and emits a full ARCHON Ψ feature vector + Stone Score + VOLT mint status for every session.

**Position in stack:**
```
Raw Signal Sources
  → The Harvestor (normalize + map + score)
    → G(t) Engine
      → VOLT Mint Gate (CB-341)
        → Canon Ledger
          → ARCHON Ψ Feature Vector
            → Stone Score
```

**Two surfaces:**
- **SirPortal /TheHarvestor** — operator UI, tabbed by source
- **MASTER GLOSSARY /Perfectibilist → 🔬 tab** — investor/demo surface

---

## 2. PIPELINE (6 STAGES — CANONICAL)

Every signal, regardless of source, passes the same pipeline:

```
Stage 1: RAW SIGNAL
  Source data arrives (EEG bands, HRV metrics, GitHub results, calendar context)
  Validated for minimum field completeness

Stage 2: MANGLE (Score)
  Raw values mapped to G(t) operators: APR, CI, DCTV, DRL
  G(t) computed: Σ[APR×0.30 + CI×0.35 + DCTV×0.35] / DRL × 8
  μ-Purity computed
  State classified (FLOW / FOCUS / RECOVERY / FATIGUE / OVERLOAD / BASELINE)
  VOLT yield estimated

Stage 3: DOCBRICK
  Structured document record created
  Fields: session_id, source, timestamp, raw_inputs, derived_operators,
          g_t_score, mu_purity, state, volt_estimate, archon_vector

Stage 4: RED TEAM REVIEW
  Defensive analysis applied:
  - Artifact flags (signal quality check)
  - Contradiction detection (e.g., high G(t) with low HRV = inconsistency flag)
  - Exposure signals (GitHub OSINT) reviewed for severity
  - PROVISIONAL flag issued if drift_alert active or mu_purity 0.50–0.64

Stage 5: CANON SEAL
  Operator approves → PROMOTE TO CANON action
  Writes to JewelEntry entity + Canon Ledger
  volt_band assigned: BREAKTHROUGH / STRONG / STANDARD / REJECTED

Stage 6: COMPOUND
  Sealed session feeds longitudinal aggregates
  Updates: daily_gt_avg, peak_window, recovery_debt_index, cumulative_volts
  Available to: ARCHON Ψ vector, Stone Score, Brain Capital Profile
```

---

## 3. SOURCE CONTRACTS

### 3.1 Myndlift ψ Scorer

**Input fields (from Brain Snapshot / qEEG export):**
```json
{
  "alpha_peak_hz": "float — peak alpha frequency in Hz (optimal: 10–12Hz)",
  "alpha_peak_power": "float — absolute alpha power (μV²)",
  "TBR": "float — theta/beta ratio (optimal: 1.2–2.5)",
  "z_score_deviation": "float — population norm deviation (0 = average, neg = below norm)",
  "session_count": "integer — total Myndlift sessions logged",
  "alpha_asymmetry": "float — frontal L-R asymmetry (optional)",
  "SMR_power": "float — sensorimotor rhythm 12-15Hz (optional)"
}
```

**Transform to G(t) operators:**
```
CI  = normalize(alpha_peak_power, 0, 40) × (1 + alpha_peak_hz_bonus)
      alpha_peak_hz_bonus = 0.15 if alpha_peak_hz ∈ [10,12] else 0

DRL = normalize(TBR, 0.8, 5.0)
      // high TBR = attention dysregulation = higher recovery load denominator

APR_modifier = 1.0 + (z_score_deviation × 0.08)
               // clamped [-0.3, +0.3]: further from norm = assembly rate penalty

DCTV_modifier = min(1.0, 0.5 + (session_count / 60) × 0.5)
                // experience compounds cross-domain transfer up to 1.0 at 60+ sessions
```

**ARCHON Ψ slots:**
- A (Attention): TBR-derived attention regulation score
- C (Coherence): alpha_peak CI contribution
- V (Resilience): recovery_debt from DRL trajectory
- D (Compounding): session_count-based DCTV modifier

---

### 3.2 Neurosity Crown

**SDK integration:**
```javascript
import { Neurosity } from "@neurosity/sdk";
const neurosity = new Neurosity({
  deviceId: process.env.NEUROSITY_DEVICE_ID
});
await neurosity.login({
  email: process.env.NEUROSITY_EMAIL,
  password: process.env.NEUROSITY_PASSWORD
});

// Stream subscriptions → Harvestor input
neurosity.focus().subscribe(({ probability }) => harvestor.ingest("APR", probability));
neurosity.calm().subscribe(({ probability }) => harvestor.ingest("CI", probability));
neurosity.brainwaves("powerByBand").subscribe((bands) => harvestor.ingest("BANDS", bands));
```

**Transform to G(t) operators:**
```
APR  = focus_probability           // 0–1, direct map
CI   = calm_probability            // 0–1, direct map
DCTV = (gamma_power / 22)          // from powerByBand
DRL  = (delta_power / 32)          // from powerByBand
```

**Kinesis operator (optional, advanced):**
```
kinesis_score = kinesis_probability × 0.15
// Adds to G(t) as a cognition-to-action conversion term
// G(t)_extended = G(t)_base × (1 + kinesis_score)
```

**ARCHON Ψ slots:**
- A (Attention): focus probability time-series stability
- C (Coherence): calm probability
- T (Throughput): session G(t) average
- D (Compounding): longitudinal focus trend

---

### 3.3 Muse + Mind Monitor (OSC)

**Input (OSC over UDP port 5000):**
```
/muse/elements/delta_absolute    → delta_abs
/muse/elements/theta_absolute    → theta_abs
/muse/elements/alpha_absolute    → alpha_abs
/muse/elements/beta_absolute     → beta_abs
/muse/elements/gamma_absolute    → gamma_abs
/muse/elements/horseshoe         → signal_quality [1,2,3,4] per sensor
```

**Normalization to band_pct:**
```
total = delta_abs + theta_abs + alpha_abs + beta_abs + gamma_abs
band_pct[x] = (x_abs / total) × 100
```

**HRV input (Mind Monitor or Polar):**
```json
{
  "hrv_sdnn": "float ms",
  "hrv_rmssd": "float ms",
  "hrv_lf_hf": "float",
  "bpm_mean": "integer"
}
```

**Transform to G(t) operators:** (same as CB-352 Perfectibilist spec)
```
APR  = beta_pct / 48
CI   = alpha_pct / 45
DCTV = gamma_pct / 22
DRL  = delta_pct / 32

ANS_score = (alpha_pct/45)×0.50 + (hrv_readiness)×0.35 + (1 - delta_pct/32)×0.15
```

**Signal quality gate:**
```
signal_quality = mean(horseshoe_sensors) / 4.0
artifact_flag  = GREEN if signal_quality ≥ 0.75
               = AMBER if signal_quality ∈ [0.50, 0.75)
               = RED   if signal_quality < 0.50
// RED → mint REJECTED (session logged as evidence only)
```

**ARCHON Ψ slots:** All 7 dimensions (primary full-band source)

---

### 3.4 GitHub / OSINT Exposure Monitor

**Input (search patterns):**
```
CRITICAL:
  filename:.env password=
  filename:.env DB_PASSWORD
  "sk_live_" extension:env
  "AKIA" extension:json         // AWS access key
  "sk-proj-" extension:env      // OpenAI key

HIGH:
  filename:*.pem private
  "mongodb+srv://" extension:js
  "postgres://" extension:env
  filename:config.json "apiKey"

LOW:
  filename:.env.backup
  filename:.env.example password
  filename:wp-config.php DB_PASSWORD
```

**Transform to ARCHON Ψ:**
```
env_leak_risk_score = 0.0
  + 0.30 per CRITICAL pattern confirmed
  + 0.15 per HIGH pattern confirmed
  + 0.05 per LOW pattern confirmed
  (clamped 0.0–1.0)

infra_hygiene_score = 1.0 - env_leak_risk_score

commit_consistency = (commits_last_30d / 30) × signal_quality_modifier
                     // clamped 0.0–1.0
```

**ARCHON Ψ slots:**
- V (Resilience): infra_hygiene_score — inverse exposure risk
- Governance: env_leak_risk_score — separate governance signal (not in QTAC₇ core)

**Ethics rule:** OSINT scans are defensive only. Results route to RedTeamDossier, not exploitation. Operator consent required per scan session.

---

### 3.5 Calendar / Context Ingestion

**Input:**
```json
{
  "session_context": "enum — deep_work|fundraising|creative|recovery|morning|strategy|research|physical",
  "session_start_time": "HH:MM",
  "day_of_week": "integer 0–6",
  "meeting_count_day": "integer",
  "deep_work_blocks_day": "integer",
  "recovery_gap_min": "integer — minutes of unscheduled recovery between blocks"
}
```

**Transform to longitudinal features:**
```
meeting_fragmentation_index = meeting_count_day / max(1, deep_work_blocks_day)
peak_window_signal = (session_start_time, G(t)) pairs — accumulates over 30 days
recovery_debt_index = rolling delta-surge sessions / total sessions (7-day window)
context_yield[context] = avg G(t) per context label — identifies "pitch calls vs coding" yield delta
```

**ARCHON Ψ slots:**
- T (Throughput): deep_work_hours_avg, context_yield
- R (Reinvestment): session_frequency, peak_window_consistency

---

## 4. UNIFIED ARCHON Ψ OUTPUT VECTOR

Every session, regardless of source, emits this contract:

```json
{
  "session_id": "UUID",
  "subject_id": "Ψ identity code",
  "harvest_timestamp": "ISO 8601",
  "signal_sources": ["array of source_ids"],
  "pipeline_stage": "RAW | MANGLED | DOCBRICK | RED_TEAM | CANON | COMPOUND",

  "g_t_score": "float 1–10",
  "mu_purity": "float 0–1",
  "state_primary": "FLOW|FOCUS|RECOVERY|FATIGUE|SYMPATHETIC_OVERLOAD|BASELINE",
  "ANS_state": "parasympathetic|balanced|sympathetic",
  "bs_detected": "boolean",
  "artifact_flag": "GREEN|AMBER|RED",

  "operators": {
    "APR": "float 0–1",
    "CI": "float 0–1",
    "DCTV": "float 0–1",
    "DRL": "float 0–1"
  },

  "archon_psi_vector": {
    "Q_quality": "float 0–10",
    "T_throughput": "float 0–10",
    "A_attention": "float 0–10",
    "C_coherence": "float 0–10",
    "D_compounding": "float 0–10",
    "R_reinvestment": "float 0–10",
    "V_resilience": "float 0–10"
  },

  "stone_score": "float 0–10",
  "stone_band": "STRONG_YES|BUY|WATCH|PASS|REJECT",
  "omega_gap": "float — claimed_score minus stress_tested_score",

  "volt_estimate": "integer",
  "volt_band": "BREAKTHROUGH|STRONG|STANDARD|REJECTED",
  "mint_status": "OPEN|LOCKED|REJECTED|PROVISIONAL",
  "mint_gates": {
    "baseline_current": "boolean",
    "artifact_not_red": "boolean",
    "duration_gte_8min": "boolean",
    "gt_gte_4": "boolean",
    "mu_purity_gte_65": "boolean",
    "no_drift_alert": "boolean"
  },

  "canon_ref": "CB block reference if sealed",
  "confidence": "float 0–1",
  "notes": "string"
}
```

---

## 5. MYNDLIFT CSV PASTE PARSER — SPEC

**Next build for SirPortal.** Allows bulk historical scoring from a raw Myndlift export.

**Input format (Myndlift CSV columns):**
```
date, session_duration_min, alpha_peak_hz, alpha_peak_power,
theta_beta_ratio, alpha_asymmetry, smr_power, z_score_deviation,
session_notes
```

**Parser behavior:**
1. User pastes CSV text into textarea
2. Parser splits rows, maps columns to source contract fields
3. For each row: run Myndlift transform → compute G(t) → estimate VOLT → classify state
4. Output: table of sessions with G(t), VOLT, state, mint_status per row
5. Aggregate: 30-day G(t) trend, total VOLTs, peak sessions, brain capital profile
6. One-click "Seal all eligible" → writes all OPEN sessions to JewelEntry

**Build instruction for SirPortal:**
> "Build Myndlift CSV paste parser. User drops raw export, auto-scores full session history, emits G(t) + VOLT + state per session + 30-day aggregate. Use the Myndlift source contract from CB-353."

---

## 6. CROSS-REFERENCES

| Document | Location | Relationship |
|---|---|---|
| CB-352 Perfectibilist Spec | `.agents/memory/CB352_PERFECTIBILIST_V2_SPEC.md` | Parent product spec — Harvestor is its scoring engine |
| CB-341 State Desync Guard | `.agents/memory/CB341_STATE_DESYNC_GUARD_v1.0.md` | Governs artifact gating and calibration |
| QTAC₇ Schema v1.0 | `.agents/memory/QTAC7_SEVEN_FACTOR_CANONICAL_SPEC_v1.0.json` | Scoring rubric this feeds |
| SirPortal TheHarvestor | `https://sir-portal-app-2d3cd697.base44.app/TheHarvestor` | Live UI implementation |
| Perfectibilist v2.1 | `/Perfectibilist` → 🔬 tab | Demo surface |
| PSI001 Genesis Brand | `.agents/memory/PSI001_GENESIS_BRAND_ASSET_v1.0.md` | Identity layer |

---

*CB-353 · THE HARVESTOR CANONICAL SPEC v1.0 · PRE-CANON · April 22, 2026*
*MASTER GLOSSARY · ARCHON Ψ · CortexChain*
*Drop target: `archon-psi-canon/docs/THE_HARVESTOR_SPEC_v1.0.md`*
