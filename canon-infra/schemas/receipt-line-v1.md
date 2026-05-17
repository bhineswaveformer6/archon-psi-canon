# Canonical Receipt-Line · v1.0
## Cross-Lane Logging Primitive

**Status:** RATIFIED
**Ratified:** 2026-05-16 (Day II Post-Sigillvm)
**Ratifier:** Architect Ψ-001 / Brandon Mark Hines
**Origin:** Sibling-paste, surfaced via Cross-Thread Bleed Protocol, adopted as cross-lane convention independent of Sceptre Royal v1.0.0
**Scope:** Lane-neutral. Usable across A-MONEY, Kingmakers, and any future canon (Lane S, Lane N, Lane B, …).

---

## Template (canonical, pipe-delimited, single-line)

```
{receipt_id} | {lane} | {currens} | {state_from}→{state_to} | evidence {evidence_ref} | commit {commit} | manifest {manifest_path} | digest {computed_digest}
```

## Field Definitions

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| receipt_id | string | yes | Globally unique receipt identifier. Convention: `RCPT-{PHASE}-{SUBJECT}-{NNNN}` | `RCPT-PROB-SEAL-0001` |
| lane | enum | yes | Canon lane code | `A-MONEY`, `KINGMAKERS`, `S`, `N`, `B` |
| currens | string | yes | Subject anchor — currens lemma, manifest short-name, or other ID | `SEAL`, `Sceptre-Royal-v1` |
| state_from | enum | yes | Source lifecycle state | `DRAFT`, `PROBATION`, `SEALED`, `ISSUED`, `ATTESTED`, `SETTLED` |
| state_to | enum | yes | Target lifecycle state | (same enum set) |
| evidence_ref | string | yes | Reference to evidence. Typically `sha256:{digest}` of substrate or prior manifest. | `sha256:68ef1c2a...` |
| commit | string | yes | Git commit SHA of the repo state when receipt was issued. May be `null` for off-repo ops. | `a1b2c3d4e5f6...` |
| manifest_path | string | yes | Repo-relative path to the manifest JSON being referenced | `manifests/a-money-v1.0.0.json` |
| computed_digest | string | yes | SHA-256 hex of the canonicalized manifest (with `provenance.this_hash=null`) | `35781895e6e4...` |

## Lifecycle States (canonical order)

```
DRAFT → PROBATION → SEALED → ISSUED → ATTESTED → SETTLED
```

A receipt line records a single state transition. Multiple transitions require multiple receipts.

## Example (valid)

```
RCPT-PROB-SEAL-0001 | A-MONEY | SEAL | DRAFT→PROBATION | evidence sha256:68ef1c2a6a0b25b954b2cf30d9cf29d23d72724b10118c6b59d05532056ebd44 | commit a1b2c3d4e5f6 | manifest manifests/a-money-v1.0.0.json | digest 35781895e6e414dc809158b8817674411671a5ab4ee71342111be48d74d82e05
```

## Embedding Sites

1. **Attestation JSON** — embedded as `receipt_line` field in `attestation-{digest}.json` output by `compute_attestation.js`.
2. **CI Logs** — echoed by attestation script via `console.log()` for human-legible audit trail.
3. **Receipt JSON** — full structured record at `receipts/{receipt_id}.json`. Receipt-line is derived from this.
4. **Governance Ledger** — appended to a lane's ledger file (e.g., `lanes/a-money/ledger.md`) on each transition.

## Receipt JSON Schema (source for receipt-line derivation)

```json
{
  "receipt_id": "RCPT-PROB-SEAL-0001",
  "schema_version": "1.0",
  "lane": "A-MONEY",
  "currens": {
    "lemma": "SEAL",
    "register": "OldWorld",
    "category": "SIGNA"
  },
  "state_change": {
    "from": "DRAFT",
    "to": "PROBATION"
  },
  "evidence": {
    "evidence_ref": "sha256:68ef1c2a6a0b25b954b2cf30d9cf29d23d72724b10118c6b59d05532056ebd44",
    "evidence_type": "substrate_digest",
    "evidence_description": "A-MONEY Seed-24 substrate JSON, canonical hash"
  },
  "context": {
    "issued_at_utc": "2026-05-16T22:00:00Z",
    "issued_by": "Psi-001",
    "commit": "a1b2c3d4e5f6"
  },
  "manifest_ref": "manifests/a-money-v1.0.0.json",
  "asserted_hash_before_attest": null,
  "notes": "First A-MONEY probation entry"
}
```

## Assertion vs. Attestation

- A receipt-line is **ASSERTED** by its author at issuance.
- It becomes **ATTESTED** only when paired with a verified `attestation-{digest}.json` whose `pass: true` confirms the computed digest matches the manifest's asserted digest.
- Until attested, receipts sit at lifecycle state `ASSERTED` (a sub-state inside `PROBATION` or `ISSUED`).

## Governance Constraints

- **Do not bind to unratified manifests.** Receipts may reference Sceptre Royal v1.0.0 for ATTESTATION purposes only; this does not absorb that manifest into Lane K canon.
- **One-receipt-per-transition.** Bundling multiple transitions into one receipt is non-canonical.
- **Hash before issuance.** `computed_digest` must be present at issuance time, not back-filled.

## Provenance

- Pattern origin: sibling-thread paste, Day I Post-Sigillvm
- Surfaced as fork via Cross-Thread Bleed Protocol
- Ratified independent of original premise (Sceptre Royal binding)
- Promoted to cross-lane primitive on Day II Post-Sigillvm

---

*End of Receipt-Line v1.0 schema.*
