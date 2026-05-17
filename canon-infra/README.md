# canon-infra-v1
## Lane-Neutral Attestation Infrastructure · Ratified 2026-05-16

This bundle contains the cross-lane attestation primitives ratified on Day II Post-Sigillvm under the Cross-Thread Bleed Protocol.

**Three files, three landing zones in `bhineswaveformer6/archon-psi-canon`:**

| File | Repo Path |
|---|---|
| `schemas/receipt-line-v1.md` | `schemas/receipt-line-v1.md` |
| `scripts/compute_attestation.js` | `scripts/compute_attestation.js` |
| `workflows/attest-manifest.yml` | `.github/workflows/attest-manifest.yml` |

## What's Ratified

- **ITEM II** — canonical one-line receipt template, lane-agnostic
- **ITEM III** — Node attestation script, parameterized on manifest path
- **ITEM IV** — GitHub Actions workflow, artifact-only, strict-exit, `if: always()`

## What's NOT Ratified

- **ITEM I** — A-MONEY Treasury React app (held in Antechamber pending Schema Migration Proposal Lane-A v3)
- **Sceptre Royal v1.0.0 manifest** — may be passed to the script as an ATTESTATION target only; this does NOT absorb it into Lane K canon
- **A-MONEY Manifest v1** — not yet minted

## Constraints

- Do not bind script or workflow to any unratified manifest as canon.
- Keep workflow artifact-only until two clean green runs are logged.
- After two green runs, auto-commit may be considered (separate ratification required).

## Usage

### Local dry-run

```bash
node scripts/compute_attestation.js manifests/some-manifest.json
# or with receipt:
node scripts/compute_attestation.js manifests/some-manifest.json receipts/RCPT-XXX.json
```

### CI (push trigger)

Push any change under `manifests/**` or `receipts/**` to `main` or `master`. The workflow detects changed manifests and attests each one. The `attestation-{digest}.json` artifact is uploaded under the name `manifest-attestation-{sha}` and retained 90 days.

### CI (manual trigger)

Use GitHub Actions UI → Run workflow → enter `manifest_path` (required) and `receipt_path` (optional).

## Exit Codes (script)

| Code | Meaning |
|---|---|
| 0 | PASS — asserted digest matches computed digest |
| 1 | FAIL — strict mode: mismatch OR asserted missing |
| 2 | Manifest file not found OR missing CLI argument |
| 3 | Manifest JSON parse error |

## Canonicalization (RFC-8785-direction, compact)

```
sortKeysDeep(manifest) where provenance.this_hash = null
  and provenance.this_hash_asserted removed
  → JSON.stringify(compact, no whitespace)
  → SHA-256 hex
```

## Provenance Chain

- Origin: sibling-thread paste, Day I Post-Sigillvm
- Surfaced as fork via Cross-Thread Bleed Protocol
- Items II/III/IV ratified by Architect Ψ-001 on Day II Post-Sigillvm
- Implementation rebuilt Lane-neutral; not blind-copied from sibling
- Item I held in Antechamber pending explicit Schema Migration Proposal

---

*End of canon-infra-v1 README.*
