# T1 Writ of Issuance · Template v0.1

**Lane P · ARCHON Ψ Atelier · CLAVSUS**
**Print-ready · oxblood seal · debossed**

---

## Title

**T1 SEALED UNIT — WRIT OF ISSUANCE**

## Asset Line

| | |
|---|---|
| Asset | The Settlement Pattern |
| SKU | `A4-SU-HD01-T1` |
| Edition | `___ / 250` |
| Issue Date (UTC) | `____-__-__T__:__:__Z` |

## Statement

This garment is issued as a **Sealed Unit** of ARCHON Ψ Atelier.

Its value is governed by:
- (i) a fixed edition cap,
- (ii) a minimal mark discipline,
- (iii) a reproducible receipt chain.

## Invariants

- **Seal is final.**
- **One primary mark per surface.**
- **No re-issue without a new SKU and a new receipt.**

## Provenance (public-redacted)

```
receipt_id       : ℒ-T1.ISSUE.________
seal_status      : SEALED
sku              : A4-SU-HD01-T1
price_usd        : 480
edition_cap      : 250
unit_serial      : ___/250
submission_hash  : sha256:________________________________
seal_hash        : sha256:________________________________
attested_git_ref : ________________________________
issuer           : ARCHON Ψ Atelier (archon-ledger-emit)
signing_entity   : CortexChain, Inc. (Waveform Tech LLC)
```

## Rights (T1)

The Holder receives **Priority Tier-1 Access Window** for future ARCHON Ψ issuance and **Council admissions** as defined by current House policy.

Policy changes affecting Holder rights are themselves emitted as policy receipts.

## Verification

A unique short-code and QR are printed on the inside tag. Scanning opens a **signed lookup URL** that:
1. Verifies `seal_hash` matches the canonical receipt
2. Confirms `unit_serial` is unique to this Holder
3. Grants access claim via email verification

No blockchain. No NFC required for T1. The chain is: attested git history + receipt hashes.

## Signature Block

| | |
|---|---|
| Curator (alias) | ________ |
| Seal Timestamp (UTC) | ____-__-__T__:__:__Z |

**(Seal mark / emboss area)**

---

## Production Notes

- **Print:** 80–100 lb cream / vellum stock; oxblood seal sticker, debossed.
- **Layout:** A5 or letter half-page; House mark top-center; statement and provenance flow to bottom; signature block bottom.
- **Type:** Tudor register (UnifrakturMaguntia for title, Cormorant Garamond for body, Space Mono for hash blocks).
- **Distribution:** one copy ships in unit container; one copy archived to `lane-p/writs/issued/` with receipt JSON.

## Drift Rules (per Lane P canon)

- Writ template version changes require a NEW template SKU + NEW receipt.
- Per-unit Writ instances are issued at `SEALED` lifecycle and never re-issued.
- If a Writ is lost, the Holder receives a `WRIT_REPLACEMENT_AFFIDAVIT` (not a re-issuance of the original).

---

*End of T1 Writ of Issuance Template v0.1.*
