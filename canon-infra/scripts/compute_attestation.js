#!/usr/bin/env node
/**
 * compute_attestation.js
 *
 * Lane-Neutral Manifest Attestation Primitive · v1.0
 * Ratified 2026-05-16 (Day II Post-Sigillvm) under Cross-Thread Bleed Protocol.
 *
 * Canonicalizes a manifest JSON (sort-keys-deep + compact JSON),
 * nulls provenance.this_hash, removes provenance.this_hash_asserted,
 * computes SHA-256, compares to asserted digest, writes attestation
 * record, embeds one-line receipt string, exits non-zero on mismatch.
 *
 * Usage:
 *   node compute_attestation.js <manifest_path> [receipt_path]
 *
 * Exit codes:
 *   0  asserted == computed (PASS)
 *   1  asserted != computed OR asserted missing (FAIL, strict mode)
 *   2  manifest file not found OR missing argv
 *   3  manifest parse error
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* ── canonicalization ──────────────────────────────────────────── */

function sortKeysDeep(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj && typeof obj === "object" && obj !== null) {
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = sortKeysDeep(obj[k]);
    return out;
  }
  return obj;
}

function canonicalize(obj) {
  // RFC-8785-direction: deep-sort keys, JSON.stringify compact (no whitespace).
  return JSON.stringify(sortKeysDeep(obj));
}

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

/* ── receipt-line construction ─────────────────────────────────── */

function buildReceiptLine({
  receipt_id = "RCPT-UNKNOWN",
  lane = "UNKNOWN",
  currens = "UNKNOWN",
  state_from = "DRAFT",
  state_to = "UNKNOWN",
  evidence_ref = "sha256:UNKNOWN",
  commit = "null",
  manifest_path = "UNKNOWN",
  computed_digest = "UNKNOWN",
}) {
  return [
    receipt_id,
    lane,
    currens,
    `${state_from}→${state_to}`,
    `evidence ${evidence_ref}`,
    `commit ${commit}`,
    `manifest ${manifest_path}`,
    `digest ${computed_digest}`,
  ].join(" | ");
}

function loadReceipt(receiptPath) {
  try {
    if (!fs.existsSync(receiptPath)) return null;
    return JSON.parse(fs.readFileSync(receiptPath, "utf8"));
  } catch (e) {
    console.warn(`Failed to parse receipt JSON at ${receiptPath}: ${e.message}`);
    return null;
  }
}

/* ── main ──────────────────────────────────────────────────────── */

function main() {
  const manifestPathArg = process.argv[2];
  const receiptPathArg = process.argv[3] || null;

  if (!manifestPathArg) {
    console.error("Usage: node compute_attestation.js <manifest_path> [receipt_path]");
    process.exit(2);
  }

  const manifestPath = path.resolve(manifestPathArg);
  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(2);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (e) {
    console.error(`Failed to parse manifest: ${e.message}`);
    process.exit(3);
  }

  // Build canonicalization copy with provenance scrubbed.
  const copy = JSON.parse(JSON.stringify(manifest));
  copy.provenance = { ...(copy.provenance || {}) };
  copy.provenance.this_hash = null;
  if ("this_hash_asserted" in copy.provenance) {
    delete copy.provenance.this_hash_asserted;
  }

  const canonical = canonicalize(copy);
  const digest = sha256Hex(canonical);

  const asserted =
    manifest.provenance &&
    (manifest.provenance.this_hash_asserted || manifest.provenance.this_hash)
      ? manifest.provenance.this_hash_asserted || manifest.provenance.this_hash
      : null;

  const pass = asserted ? asserted === digest : false;

  /* ── receipt-line ──────────────────────────────────────────── */

  let receipt_line;
  if (receiptPathArg) {
    const receipt = loadReceipt(path.resolve(receiptPathArg));
    if (receipt) {
      receipt_line = buildReceiptLine({
        receipt_id: receipt.receipt_id || "RCPT-UNKNOWN",
        lane: receipt.lane || "UNKNOWN",
        currens:
          (receipt.currens && receipt.currens.lemma) ||
          receipt.currens ||
          "UNKNOWN",
        state_from:
          (receipt.state_change && receipt.state_change.from) || "DRAFT",
        state_to:
          (receipt.state_change && receipt.state_change.to) || "UNKNOWN",
        evidence_ref:
          (receipt.evidence && receipt.evidence.evidence_ref) ||
          "sha256:UNKNOWN",
        commit:
          (receipt.context && receipt.context.commit) ||
          process.env.GITHUB_SHA ||
          "null",
        manifest_path: manifestPathArg,
        computed_digest: digest,
      });
    } else {
      console.warn(`Receipt path supplied but unloadable: ${receiptPathArg}`);
    }
  }

  if (!receipt_line) {
    // Fallback: auto-receipt derived from manifest itself.
    receipt_line = buildReceiptLine({
      receipt_id: "RCPT-AUTO",
      lane: "UNSPECIFIED",
      currens: path.basename(manifestPathArg, ".json"),
      state_from: "ASSERTED",
      state_to: pass ? "ATTESTED" : "ASSERTED",
      evidence_ref: asserted ? `sha256:${asserted}` : "sha256:NONE",
      commit: process.env.GITHUB_SHA || "null",
      manifest_path: manifestPathArg,
      computed_digest: digest,
    });
  }

  /* ── attestation record ────────────────────────────────────── */

  const attestation = {
    schema_version: "1.0",
    manifest_path: manifestPathArg,
    repository: process.env.GITHUB_REPOSITORY || null,
    ref: process.env.GITHUB_REF || null,
    commit: process.env.GITHUB_SHA || null,
    computed_digest: digest,
    asserted_digest: asserted,
    pass,
    timestamp_utc: new Date().toISOString(),
    canonicalization:
      "sort_keys_deep + JSON.stringify(compact); provenance.this_hash=null; remove provenance.this_hash_asserted",
    receipt_line,
  };

  const outName = `attestation-${digest}.json`;
  fs.writeFileSync(outName, JSON.stringify(attestation, null, 2), "utf8");
  console.log(`Wrote attestation: ${outName}`);
  console.log(receipt_line);

  if (!pass) {
    console.error(
      asserted
        ? `MISMATCH · asserted ${asserted} != computed ${digest} · strict-mode FAIL`
        : `NO ASSERTED DIGEST in manifest · strict-mode FAIL`
    );
    process.exit(1);
  }
  process.exit(0);
}

main();
