# CB-373 · Crown Score Engine v1.0
**Sealed:** May 2026 | **Author:** Brandon Hines [Ψ-001] | **Status:** CANON_SEALED

## The Formula

```
CrownScore = VC×0.20 + NT×0.15 + PA×0.15 + DA×0.15 + TC×0.15 + WD×0.10 + RH×0.10
```

All dimensions 0–100. CrownScore 0–100.

## Seven Dimensions

| Code | Name | Weight | Definition |
|------|------|--------|------------|
| VC | Volitional Clarity | 0.20 | Directedness, purpose, unambiguous thesis |
| NT | Novelty Transmission | 0.15 | Embedding-space distance from prior work |
| PA | Precision Architecture | 0.15 | Technical rigor, falsifiability, exactness |
| DA | Depth of Argument | 0.15 | Multi-layer reasoning, first-principle derivation |
| TC | Temporal Coherence | 0.15 | Narrative flow, logical continuity |
| WD | World Density | 0.10 | Conceptual payload per word |
| RH | Resonance Hook | 0.10 | Memorability, signal salience |

## VOLTS Minting Rule
- Crown ≥ 70: VOLTS = floor(CrownScore × 1.5)
- Crown < 70: 0 VOLTS
- Crown ≥ 85: Canon-eligible

## Implementation
- Backend function: `scoreCrownRun.ts` — deployed to Magic Genius Superagent
- Input: `chapter_id` or raw `text`
- Output: 7 dimension scores + composite + block_hash + run_timestamp
- Persistence: `CrownRun` entity, `Chapter` entity updated

## Thesis
The Crown Score is the first verifiable, deterministic scoring rubric for written intellectual output. VC carries highest weight (0.20) because directionless writing is structurally unfixable. The 7-dimension structure mirrors the 7-signal Microgravity ranking.
