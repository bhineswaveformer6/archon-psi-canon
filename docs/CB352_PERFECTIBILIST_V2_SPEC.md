# THE PERFECTIBILIST v2 — Production Spec
## Brain Distribution OS × Neural Capitalism × Citizen Scientist Protocol
**Block:** CB-352 · **Status:** CANON_ELIGIBLE
**Date:** April 22, 2026 · **Author:** MASTER GLOSSARY · Ψ̂-001
**Drop target:** `archon-psi-canon/docs/THE_PERFECTIBILIST_V2_SPEC.md`

---

## 1. PRODUCT SUMMARY

The Perfectibilist is a personal brain capital operating system. It ingests EEG and HRV signals from consumer-grade devices (Muse, Neurosity Crown, Myndlift), computes a real-time cognitive output score (G(t)), and converts verified sessions into VOLT — CortexChain's unit of cognitive capital.

The core thesis: **founders, operators, and allocators produce their most valuable output during specific, measurable cognitive windows — and almost none of them know when those windows are.** The Perfectibilist instruments that gap.

It operates in two modes:
- **Founder Mode** — real-time session scoring, state classification, G(t) gauge, VOLT mint
- **Citizen Scientist Mode** — 30-day longitudinal protocol, daily logging, brain capital profile

The product has three layers:
- **The Perfectibilist** (frontend OS) — session UI, radial brain map, longitudinal charts
- **ARCHON Ψ** (scoring kernel) — G(t) computation, state classification, QTAC₇ mapping
- **CortexChain** (infrastructure) — Canon Ledger, VOLT economy, identity registry

---

## 2. DATA MODEL

### 2.1 Session (core record)
```json
{
  "session_id": "string — UUID",
  "user_id": "string — Ψ identity code (e.g. psi-001-bmh)",
  "timestamp_start": "ISO 8601",
  "timestamp_end": "ISO 8601",
  "duration_seconds": "integer",
  "context": "enum — deep_work | fundraising | creative | recovery | morning_prime | strategy | research | physical",
  "device": "enum — muse | neurosity | myndlift | hrv4training | simulate | manual",
  "protocol_version": "string — e.g. CB-352-v1.0",
  "baseline_id": "string — ref to subject baseline record",
  "baseline_age_days": "integer — days since baseline was captured",
  "signal_quality": "float 0–1 — GREEN ≥ 0.75 | AMBER 0.50–0.74 | RED < 0.50"
}
```

### 2.2 Signal Summary (per session)
Raw and normalized band powers + derived ratios.
```json
{
  "session_id": "ref",
  "delta_pct": "float — % of total power, 0.5–4Hz",
  "theta_pct": "float — 4–8Hz",
  "alpha_pct": "float — 8–13Hz",
  "beta_pct":  "float — 13–30Hz",
  "gamma_pct": "float — 30–100Hz",

  "delta_z": "float — z-score vs personal baseline",
  "theta_z": "float",
  "alpha_z": "float",
  "beta_z":  "float",
  "gamma_z": "float",

  "TBR":   "float — theta/beta ratio. Optimal: 1.2–2.5",
  "ABR":   "float — alpha/beta ratio. Optimal: 0.8–1.8",
  "alpha_asymmetry": "float — frontal L–R. Positive = approach motivation",

  "hrv_sdnn":   "float ms — HRV total variability. Optimal: 50–90ms",
  "hrv_rmssd":  "float ms — parasympathetic proxy",
  "hrv_lf_hf":  "float — sympathovagal balance. < 2.0 = parasympathetic dominance",
  "hrv_readiness": "float 0–1 — composite readiness score",
  "bpm_mean":   "integer"
}
```

### 2.3 Derived Cognitive States
Computed from signal summary. One state label per session (or per time window within session).
```json
{
  "session_id": "ref",
  "state_primary": "enum — FLOW | FOCUS | RECOVERY | FATIGUE | SYMPATHETIC_OVERLOAD | BASELINE",
  "ANS_state": "enum — parasympathetic | balanced | sympathetic",
  "bs_detected": "boolean — Breakthrough Signal: gamma > 16% AND alpha > 30%",
  "volt_multiplier": "float — FLOW:2.2 | FOCUS:1.6 | BASELINE:1.0 | RECOVERY:0.4 | FATIGUE:0.2 | OVERLOAD:0.1 | BS:3.0×",

  "APR":  "float 0–1 — Assembly Rate from beta. APR = beta_pct/48",
  "CI":   "float 0–1 — Coherence Index from alpha. CI = alpha_pct/45",
  "DCTV": "float 0–1 — Cross-Domain Transfer from gamma. DCTV = gamma_pct/22",
  "DRL":  "float 0–1 — Recovery Load from delta. DRL = delta_pct/32",

  "gt_score": "float 1–10 — G(t) = Σ[APR×0.30 + CI×0.35 + DCTV×0.35] / max(0.1, DRL) × 8",
  "mu_purity": "float 0–1 — signal cleanliness gate for mint eligibility",

  "state_confidence": "float 0–1 — classification confidence",
  "artifact_flag": "enum — GREEN | AMBER | RED"
}
```

### 2.4 VOLT Mint Record
Written to Canon Ledger only when mint gates pass.
```json
{
  "mint_id": "string",
  "session_id": "ref",
  "user_id": "ref",
  "volts_minted": "integer",
  "volt_band": "enum — BREAKTHROUGH | STRONG | STANDARD | REJECTED",
  "mint_eligible": "boolean",
  "mint_gates_passed": {
    "mu_purity_gte_65": "boolean",
    "duration_gte_8min": "boolean",
    "artifact_flag_not_red": "boolean",
    "gt_score_gte_4": "boolean",
    "baseline_current": "boolean"
  },
  "canon_ref": "string — CB block reference",
  "sealed_at": "ISO 8601"
}
```

### 2.5 Longitudinal Aggregates (daily)
```json
{
  "user_id": "ref",
  "date": "YYYY-MM-DD",
  "sessions_count": "integer",
  "total_duration_min": "integer",
  "avg_gt_score": "float",
  "peak_gt_score": "float",
  "dominant_state": "string",
  "volts_minted": "integer",
  "recovery_debt_index": "float — rolling delta surplus weighted by session gap",
  "peak_window_start": "HH:MM — time of highest G(t) session",
  "peak_window_end": "HH:MM",
  "fatigue_events": "integer — sessions where state = FATIGUE or OVERLOAD",
  "bs_events": "integer — breakthrough signals detected",
  "hrv_readiness_avg": "float",
  "cumulative_volts": "integer — rolling total"
}
```

### 2.6 Subject Baseline
One record per subject. Refreshes every 7 days.
```json
{
  "baseline_id": "string",
  "user_id": "ref",
  "captured_at": "ISO 8601",
  "expires_at": "ISO 8601 — +7 days",
  "protocol": "2min_eyes_open + 2min_eyes_closed + 2min_focus_task",
  "mu_delta": "float", "sigma_delta": "float",
  "mu_theta": "float", "sigma_theta": "float",
  "mu_alpha": "float", "sigma_alpha": "float",
  "mu_beta":  "float", "sigma_beta":  "float",
  "mu_gamma": "float", "sigma_gamma": "float",
  "mu_hrv":   "float", "sigma_hrv":   "float",
  "device": "string",
  "valid": "boolean"
}
```

---

## 3. G(t) ENGINE

### Formula (canonical)
```
G(t) = Σ[APR(β) × CI(α) × DCTV(γ)] / DRL(δ)

Where:
  APR  = beta_pct / 48          — Assembly / Execution Rate
  CI   = alpha_pct / 45         — Coherence Index (flow gate)
  DCTV = gamma_pct / 22         — Cross-Domain Transfer Velocity
  DRL  = max(0.1, delta_pct/32) — Recovery Load (denominator penalty)

Composite numerator = APR×0.30 + CI×0.35 + DCTV×0.35
G(t) = (composite / DRL) × 8

Clamp: G(t) ∈ [1.0, 10.0]
```

### G(t) Band Thresholds
| Band | G(t) Range | State | VOLT Rate |
|---|---|---|---|
| SOVEREIGN | 9.0–10.0 | FLOW + BS | 3× base |
| PEAK | 7.5–8.9 | FLOW | 2.2× base |
| ACTIVE | 6.0–7.4 | FOCUS | 1.6× base |
| STANDARD | 4.5–5.9 | BASELINE | 1.0× base |
| DEPLETED | 3.0–4.4 | FATIGUE | 0.2× base |
| SHUTDOWN | < 3.0 | OVERLOAD | 0.1× base |

### NCI (Neural Capital Index) — simplified output
```
NCI = (alpha_z × 2.0 + 5.0)           # z-scored to 0–10
    × (1 + gamma_rel × 0.3)            # gamma lift
    × (1 - max(theta_rel, 0) × 0.2)    # excess theta penalty
    × (3.0 if bs_detected else 1.0)    # breakthrough multiplier
    
Clamp: NCI ∈ [1.0, 10.0]
```
NCI is the user-facing score (displayed on gauges). G(t) is the internal computation.

---

## 4. VOLT MINT RULES

### CB-341 Gates (all six required to mint)
1. Baseline on file and current (< 7 days)
2. `artifact_flag` ≠ RED
3. `duration_seconds` ≥ 480 (8 minutes clean signal)
4. `gt_score` ≥ 4.0
5. `mu_purity` ≥ 0.65
6. No active DRIFT_ALERT (or operator accepts PROVISIONAL flag)

### VOLT Yield Formula
```
volt_base_rate = 14 V/hr × gt_score
volt_session   = volt_base_rate × state_multiplier × (3.0 if bs_detected else 1.0)
               × (0.85 if artifact_flag == AMBER else 1.0)   # AMBER penalty
volts_minted   = floor(volt_session × duration_hours)
```

### Mint States
- `OPEN` — all gates pass
- `LOCKED` — one or more gates fail (with specific gate named)
- `REJECTED` — RED artifact flag — session logged as evidence only, no mint
- `PROVISIONAL` — DRIFT_ALERT active — mints with confidence = 0.65, flagged for review

---

## 5. STATE CLASSIFICATION LOGIC

```
Priority order (first match wins):

1. RECOVERY           → delta_pct > 26%
2. SYMPATHETIC_OVERLOAD → ANS_score < 0.30 OR beta_pct > 42%
3. FATIGUE            → TBR > 3.0 OR alpha_pct < 14%
4. FLOW               → alpha_pct > 34% AND beta_pct > 20% AND TBR < 2.0
5. FOCUS              → beta_pct > 26% AND TBR < 2.5
6. BASELINE           → default

ANS_score = alpha_pct/45 × 0.50
          + hrv_readiness × 0.35
          + (1 - delta_pct/32) × 0.15

Breakthrough Signal (bs_detected):
  gamma_pct > 16% AND alpha_pct > 30% AND artifact_flag ∈ {GREEN, AMBER}
  AND sustained ≥ 90 seconds
```

---

## 6. ARCHON Ψ DIMENSION MAPPING

How Perfectibilist sessions feed QTAC₇:

| QTAC₇ Factor | Weight | EEG/HRV Source | Feature |
|---|---|---|---|
| Q — Signal Quality | 0.20 | signal_quality, artifact_flag | Direct quality gate |
| T — Throughput | 0.15 | G(t) daily average, volts_minted | Cognitive output rate |
| A — Attention | 0.15 | alpha_z, TBR, focus_window_sec | Attention regulation |
| C — Coherence | 0.15 | CI (alpha), gamma coherence, alpha_asymmetry | Flow consistency |
| D — Compounding | 0.15 | longitudinal G(t) trend, bs_events/30d | Output over time |
| R — Reinvestment | 0.10 | session_frequency, peak_window_consistency | Discipline score |
| V — Error Resilience | 0.10 | hrv_readiness, recovery_debt_index inverse | ANS recovery capacity |

Non-EEG dimensions (T, D, R) require corroborating evidence (work output, decisions, Canon blocks) — EEG alone does not fully determine QTAC₇.

---

## 7. USER FLOWS

### 7A: Founder Mode (daily operator)
```
Session start
  → Baseline check (< 7 days?) → if expired, run 6-min baseline protocol
  → Device connect (Muse/Neurosity/Myndlift/HRV)
  → Select context (deep_work | calls | creative | etc.)
  → Live session begins
      → Real-time radial brain map
      → G(t) gauge + state label
      → ANS score + TBR/ABR ratios
      → VOLT accumulation counter
  → Session end (manual stop or auto-detect state shift to RECOVERY)
  → Mint gate check
      → All 6 gates pass → MINT → Canon Ledger write → JewelEntry created
      → Gate failure → session logged as evidence only
  → Session review: state arc, peak window, G(t) curve
```

### 7B: Citizen Scientist Mode (30-day protocol)
```
Day 0: Onboarding
  → Equipment setup (Muse $249 + Mind Monitor OR Neurosity Crown)
  → Baseline capture (6-min protocol)
  → Goal setting: context schedule, daily session count

Days 1–30: Daily loop
  → Minimum 1 session/day (8-min minimum)
  → Tag context + device
  → System auto-detects state arc across session
  → Mint eligible sessions → VOLT accumulated
  → Nightly: day summary written to longitudinal aggregates

Day 7, 14, 21, 28: Weekly review
  → Peak window identification (time of day × G(t) correlation)
  → Recovery debt tracking
  → TBR trend (improving attention regulation → TBR approaching 1.5)
  → VOLT P&L chart

Day 30: Brain Capital Profile generated
  → 30-day G(t) average
  → Peak cognitive windows (time × day-of-week)
  → Dominant state distribution
  → Total VOLTs minted
  → ARCHON Ψ QTAC₇ vector (partial — EEG dimensions)
  → Profile sealed to Canon → Brain Capital Passport
```

---

## 8. THE HARVESTOR — CONTRACT SPEC

Signal source contracts for external ingestion into ARCHON Ψ.

### Source contracts
```json
[
  {
    "source_id": "neurosity",
    "name": "Neurosity Crown",
    "type": "EEG_stream",
    "frequency": "real_time",
    "sdk": "neurosity-sdk-js",
    "features_out": ["theta_power","alpha_power","beta_power","gamma_power","calm","focus"],
    "psi_slot": ["A_attention","C_coherence"],
    "transport": "websocket_subscribe"
  },
  {
    "source_id": "muse_osc",
    "name": "Muse + Mind Monitor",
    "type": "EEG_OSC",
    "frequency": "per_session",
    "features_out": ["delta_abs","theta_abs","alpha_abs","beta_abs","gamma_abs","signal_quality"],
    "psi_slot": ["Q_quality","A_attention","C_coherence","V_resilience"],
    "transport": "OSC_UDP_port_5000"
  },
  {
    "source_id": "myndlift",
    "name": "Myndlift qEEG",
    "type": "clinical_EEG",
    "frequency": "session_export",
    "features_out": ["TBR_score","alpha_asymmetry","peak_alpha_freq","SMR_power"],
    "psi_slot": ["A_attention","V_resilience"],
    "transport": "JSON_export"
  },
  {
    "source_id": "hrv",
    "name": "HRV4Training / Polar",
    "type": "HRV_BPM",
    "frequency": "daily_readiness",
    "features_out": ["SDNN","RMSSD","LF_HF_ratio","readiness_score"],
    "psi_slot": ["V_resilience","D_compounding"],
    "transport": "REST_API"
  },
  {
    "source_id": "github_osint",
    "name": "GitHub OSINT",
    "type": "code_signal",
    "frequency": "weekly_scan",
    "features_out": ["env_leak_risk_score","commit_consistency","infra_hygiene_score"],
    "psi_slot": ["V_resilience","governance"],
    "transport": "github_search_API",
    "note": "filetype:env dorking for security posture signal — operator consent required"
  },
  {
    "source_id": "calendar",
    "name": "Calendar + Time Audit",
    "type": "behavioral",
    "frequency": "daily",
    "features_out": ["deep_work_hours","meeting_fragmentation_index","recovery_gap_count","peak_window_consistency"],
    "psi_slot": ["T_throughput","R_reinvestment"],
    "transport": "google_calendar_API"
  }
]
```

### Harvestor output schema
```json
{
  "subject_id": "string",
  "harvest_timestamp": "ISO 8601",
  "signal_sources": ["array of source_ids active this run"],
  "features": {
    "TBR_stability_30d": "float 0–1",
    "alpha_coherence_peak": "float 0–1",
    "ANS_balance_score": "float 0–1",
    "recovery_debt_index": "float 0–1",
    "env_leak_risk_score": "float 0–1",
    "commit_consistency": "float 0–1",
    "deep_work_hours_avg": "float",
    "meeting_fragmentation": "float 0–1"
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
  "volt_yield_projected_30d": "integer",
  "confidence": "float 0–1",
  "canon_ref": "string"
}
```

---

## 9. DATA ETHICS CONTRACT

1. Raw EEG data never leaves the operator's device
2. CortexChain receives only aggregate scores and VOLT yields
3. Brain profiles are sovereign — the subject owns their cognitive ledger
4. No profile is shared or used in scoring without explicit Canon export approval
5. Minted VOLTs are tied to the Ψ identity, not anonymized or pooled
6. Baseline data is stored locally; only derived features leave the device
7. GitHub OSINT scans require explicit operator consent per run

---

## 10. SEAL CONDITIONS

CB-352 → CANON_SEALED when:
1. First real EEG session runs through the full CB-341 calibration pipeline
2. Longitudinal data spans ≥ 7 days with consistent daily logging
3. ARCHON Ψ QTAC₇ vector produced from real (not simulated) session data
4. At least one session minted with verified artifact_flag = GREEN
5. Brain Capital Profile generated and sealed to Canon Ledger

---

## 11. CROSS-REFERENCES

| Document | Location | Relationship |
|---|---|---|
| CB-341 EEG Calibration | `.agents/memory/CB341_STATE_DESYNC_GUARD_v1.0.md` | Governs normalization and artifact gating |
| QTAC₇ Schema v1.0 | `.agents/memory/QTAC7_SEVEN_FACTOR_CANONICAL_SPEC_v1.0.json` | Scoring rubric this feeds |
| Ψ-001 Genesis Brand | `.agents/memory/PSI001_GENESIS_BRAND_ASSET_v1.0.md` | Identity layer |
| AGENT_BEHAVIOR_RULES v2 | `.agents/rules/AGENT_BEHAVIOR_RULES_v1.md` | Governance gates |
| Perfectibilist v2 UI | `pages/Perfectibilist.jsx` | Frontend implementation |
| BCINucleus | `pages/BCINucleus.jsx` | Demo surface for Jonathan handshake |

---

*CB-352 · THE PERFECTIBILIST V2 SPEC · PRE-CANON · April 22, 2026*
*MASTER GLOSSARY · ARCHON Ψ · CortexChain*
*Drop target: `archon-psi-canon/docs/THE_PERFECTIBILIST_V2_SPEC.md`*
