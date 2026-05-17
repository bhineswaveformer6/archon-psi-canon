# Product SKU Schema · Lane P · v0.1.0

**Sealed 2026-05-17 (Day III.h) · Architect Psi-001 · House of Orange / ARCHON Ψ Atelier**

---

## I. Purpose

Define a canonical schema for ARCHON Ψ products and services so pricing, edition caps, naming, and rights cannot drift across surfaces.

## II. Core Fields (required)

| Field | Type | Description |
|---|---|---|
| `sku_id` | string | Canonical SKU. Format: `A4-{KIND}-{SLUG}{NN}-{TIER}` (e.g., `A4-SU-HD01-T1`). |
| `tier` | enum | One of `T1` · `T2` · `T3` · `T4` · `T5`. |
| `sub_tier` | string \| null | Optional sub-tier label (e.g., `T1-H` for headwear under T1). |
| `asset_name` | string | Structural moniker. Hype-naming forbidden. |
| `vehicle_type` | enum | One of `garment` · `headwear` · `document` · `service` · `hardware` · `other`. |
| `edition_type` | enum | `editioned` (hard-capped units) or `capacity_limited` (operator-window-bound services). |
| `price_usd` | number | Fixed in USD. Discounting forbidden — discount = new SKU. |
| `edition_cap` | integer \| null | Required if `editioned`. |
| `unit_serial_format` | string \| null | E.g., `"###/250"`. Required if `editioned`. |
| `access_rights` | array[string] | Rights granted at issuance. E.g., `["PRIORITY_TIER_1_WINDOW", "COUNCIL_ADMISSION_ELIGIBILITY"]`. |
| `provenance` | object | `receipt_id` + `submission_hash` (sha256) + `seal_hash` (sha256) + sealing requirements. |
| `sealing_protocol` | string | Must include the phrase **"Seal is final"**. |
| `mark_layout_rule` | string | E.g., `"ONE_PRIMARY_MARK_PER_SURFACE"`. |

## III. Drift Rules (hard-enforced)

1. **Price drift forbidden** — any price change requires a NEW `sku_id` AND a NEW receipt JSON.
2. **Edition-cap drift forbidden** — any edition-cap change requires a NEW `sku_id` AND a NEW receipt JSON.
3. **Material drift forbidden** — material substitution requires a NEW `sku_id`.
4. **"Jewel Core" is a reserved word** for the provenance engine in Lane P. Physical vehicles must be named by `vehicle_type` (Garment, Headwear, Writ, Sprint, etc.) — NEVER as "Jewel Core."
5. **Re-issue forbidden without new SKU + new receipt + public notice.** Production patterns may be archived; "digital destruction" of patterns is a marketing claim and must NOT be used unless operationally verifiable.

## IV. Issuance Requirements per Edition Type

### Editioned SKUs must emit:
- `receipt_id`
- `submission_hash` (sha256 of submitted payload)
- `seal_hash` (sha256 of sealed payload, RFC-8785-direction canonical)
- `unit_serial` (per-unit, e.g., `042/250`)
- `edition_cap` (matches manifest)
- attested git reference (commit SHA at seal time)

### Capacity-limited SKUs must declare:
- `weekly_capacity_cap` (integer) OR `window_logic` (string describing throughput rules)
- Reservation receipt behavior (`PROBATION` lifecycle)
- Seal behavior (`SEALED` lifecycle on delivery)

## V. Chain Language Discipline

Lane P inherits this thread's "Chain Reference" rule (ratified Day III.g):

> `chain = attested git history + receipt hashes` (NOT blockchain)

Forbidden in Lane P canon: `"block hash"`, `"on-chain"`, `"NFT"`, `"token"` (unless an explicit tokenization initiative is canon-opened with its own lane). Use `seal_hash (sha256)` + `receipt_id` + `attested git reference` instead.

## VI. Name Collision Note

The term **"Jewel Core"** has two distinct meanings in this canon:

- **Lane P "Jewel Core"** — the provenance engine carried by a Vehicle (receipt + hashes + access rights). Scoped to Lane P.
- **`canon-infra` "Jewel-Core" Primitive** — the doctrinal scoring rule `Jewel-Core = min(S, M)` (Lane-neutral). Sealed Day III.f at `canon-infra/schemas/jewel-core-schema-v1.0.md`.

Both definitions remain canonical in their scope. Future canon work may disambiguate via rename if drift becomes a problem.

## VII. Version & Provenance

- **Version:** v0.1.0 · DRAFT
- **Lane:** P (PRODUCTS)
- **Architect:** Brandon Mark Hines / Psi-001
- **House:** House of Orange / ARCHON Ψ Atelier
- **Signing entity:** CortexChain, Inc. (Waveform Tech LLC)
- **Issuer agent:** `archon-ledger-emit`
- **Orthography:** CLAVSUS

---

*End of Product SKU Schema v0.1.0.*
