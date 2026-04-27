# CB-365 — GATEHUB ENFORCEMENT SPEC
**Status:** CANON_SEALED  **Date:** April 27, 2026  **Author:** Ψ-001 · B.Hines

## What GateHub Is
Not a dashboard. An enforcer. The active gate enforcement layer between ScoringHub metrics and any capital action.

**Architecture:** ScoringHub → GateHub → L7 → Capital Policy (CB-364)

## Four Gates
| Gate | Question | Hard Block Condition |
|---|---|---|
| ⚡ VOLT GATE | Can I mint VOLTs now? | Band 3 < 5.0 OR Ω-Gap > 1.5 with HW < 30% OR Ψ < 6.0 |
| 🔨 BUILD GATE | Can I start a new build? | Band 3 < 5.0 OR incidents ≥ 2 OR Ψ < 6.0 |
| 📡 OUTBOUND GATE | Can I post or send externally? | Band 3 < 5.0 OR incidents ≥ 2 OR Ψ < 6.0 |
| 🔒 SEAL GATE | Can I create a Canon seal? | Band 3 < 5.0 OR Ψ < 6.0 OR Ω-Gap > 1.5 |

## Verdicts
PASS · CONDITIONAL (with explicit constraints) · HOLD · BLOCK

## Governance Integration
Every gate check creates a HarnessRun record. GateHub is the audit trail for every capital decision. A gate that cannot say no is not a gate.

*Live: https://master-glossary-app-b5993402.base44.app/GateHub*
