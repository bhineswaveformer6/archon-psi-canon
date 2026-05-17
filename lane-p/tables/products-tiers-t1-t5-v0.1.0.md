# ARCHON Ψ Offer Ladder · Lane P · v0.1.0

**Sealed 2026-05-17 (Day III.h) · CLAVSUS**

---

## Tier Summary

| Tier | Designation | Vehicle Type | Edition Model |
|---|---|---|---|
| **T1** | Sealed Unit (editioned physical vehicle + Jewel Core) | garment | editioned |
| **T2** | Lens Brief (document deliverable) | document | capacity_limited |
| **T3** | Reality Lens Sprint (72h) | service + Sealed Writ | capacity_limited |
| **T4** | Standing Ledger | service (retainer) | capacity_limited |
| **T5** | Sovereign Commission | institutional deployment | capacity_limited |

---

## T1 — Sealed Unit (Anchor) · CANON-LOCKED

| Field | Value |
|---|---|
| `sku_id` | `A4-SU-HD01-T1` |
| `asset_name` | T1 Sealed Unit: The Settlement Pattern |
| `vehicle_type` | garment |
| `edition_type` | editioned |
| `price_usd` | **480** (locked Day III.h) |
| `edition_cap` | **250** (locked Day III.h) |
| `unit_serial_format` | `"###/250"` |
| `access_rights` | `["PRIORITY_TIER_1_WINDOW", "COUNCIL_ADMISSION_ELIGIBILITY"]` |
| `mark_layout_rule` | `ONE_PRIMARY_MARK_PER_SURFACE` |
| `sealing_protocol` | Seal is final. `receipt_id` + `submission_hash` + `seal_hash` + `unit_serial` emitted before fulfillment. |
| `invariants` | (a) Seal is final. (b) One primary mark per surface. (c) No re-issue without new SKU + new receipt + public notice. |

**Lifecycle:** PROBATION → SEALED → ISSUED per Six-State ladder.

---

## T2 — Lens Brief (Bridge)

| Field | Value |
|---|---|
| `sku_id` | `A4-LB-WR01-T2` |
| `asset_name` | Lens Brief: Receipted Decision Audit |
| `vehicle_type` | document |
| `edition_type` | capacity_limited |
| `price_usd` | 750 |
| `access_rights` | `["SPRINT_PRIORITY_QUEUE_ELIGIBILITY"]` |
| `deliverable` | `brief.pdf` + `receipt.json` |
| `weekly_capacity_cap` | TBD (defer to first cohort; record in v0.2.0) |

---

## T3 — Reality Lens Sprint (72h)

| Field | Value |
|---|---|
| `sku_id` | `A4-RLS-72-T3` |
| `asset_name` | Reality Lens Sprint (72h) |
| `vehicle_type` | service |
| `edition_type` | capacity_limited |
| `price_usd` | 5000 |
| `deliverable` | `sealed_writ.pdf` + `action_plan.pdf` + `receipt.json` |
| `lifecycle` | PROBATION → SEALED |
| `weekly_capacity_cap` | TBD |

---

## T4 — Standing Ledger (Retainer)

| Field | Value |
|---|---|
| `sku_id` | `A4-SL-RET-T4` |
| `asset_name` | Standing Ledger (Monthly) |
| `vehicle_type` | service |
| `edition_type` | capacity_limited |
| `price_usd` | 3500 (monthly) |
| `cadence` | weekly receipts + quarterly roll-ups |
| `concurrent_seat_cap` | TBD |

---

## T5 — Sovereign Commission

| Field | Value |
|---|---|
| `sku_id` | `A4-SC-ORG-T5` |
| `asset_name` | Sovereign Commission |
| `vehicle_type` | service |
| `edition_type` | capacity_limited |
| `price_usd_floor` | 25000 |
| `note` | Scope drives pricing above floor. Lifecycle: PROBATION → SEALED → ISSUED → ATTESTED → SETTLED. |

---

## Reserved Terms

- **"Jewel Core"** — provenance engine only (NOT the garment).
- **"Vehicle"** — the physical or digital carrier of the Jewel Core.

## Deferred Items (NOT in v0.1.0)

- **T1-H Headwear Unit (The Crown Protocol, $210 / 500 cap)** — sub-tier or T0 Accessory designation pending Architect ratification. Sibling-thread spec proposed but Lane P does not absorb without explicit one-word vote (`T1-H` or `T0`). Held in antechamber.
- Weekly capacity caps for T2 / T3 / T4 — pending first-cohort throughput data.
- Council-admission policy receipts — pending governance lane.

---

*End of Tier Table v0.1.0.*
