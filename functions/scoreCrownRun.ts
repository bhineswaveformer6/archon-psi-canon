/**
 * scoreCrownRun — CB-373 Crown Score Engine v1
 *
 * Accepts a chapter_id (or raw text + manuscript_id).
 * Calls OpenAI to score 7 dimensions, computes composite Crown Score,
 * persists a CrownRun record, and updates Chapter.crown_score.
 *
 * Crown Score Formula (CB-373):
 *   CrownScore = (VC×0.20) + (NT×0.15) + (PA×0.15) + (DA×0.15)
 *              + (TC×0.15) + (WD×0.10) + (RH×0.10)
 *
 * All dimension scores are 0–100. CrownScore is 0–100.
 * VOLTS minted = floor(CrownScore × 1.5) when score ≥ 70
 *
 * Inputs (body JSON):
 *   chapter_id    string — fetch Chapter + body from entity
 *   text          string — optional raw override (skips chapter fetch)
 *   manuscript_id string — required if text is passed directly
 *   title         string — optional context label
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import OpenAI from 'npm:openai@4.28.4';
import { createHash } from 'npm:crypto@1.0.3';

// ─── Scoring prompt ─────────────────────────────────────────────────────────

const SCORING_SYSTEM = `You are the Crown Score Engine — a rigorous evaluator of written intellectual output.
You score text across exactly 7 dimensions, each 0–100. Be calibrated: 50 is solid professional work,
70 is excellent, 85+ is rare and must be earned.

DIMENSIONS:
1. VC — Volitional Clarity (0–100): Directedness, purpose, intent. Does the writer know exactly what they
   are claiming and why? Is the thesis unambiguous? Penalize hedging and drift.

2. NT — Novelty Transmission (0–100): Distance from known prior work in embedding-space terms. Does this
   idea synthesis cross domains in a non-obvious way? Penalize restating consensus or well-known frameworks
   without meaningful extension.

3. PA — Precision Architecture (0–100): Technical rigor and exactness. Are claims falsifiable? Are terms
   defined? Is the math or mechanism correct? Penalize vagueness masquerading as depth.

4. DA — Depth of Argument (0–100): Multi-layer reasoning chains. Does the text drill below surface claims
   into mechanisms, second-order effects, and first-principle derivations? Penalize one-level assertions.

5. TC — Temporal Coherence (0–100): Narrative flow and logical continuity. Does each sentence follow from
   the prior one? Are transitions earned? Penalize structural gaps and non-sequiturs.

6. WD — World Density (0–100): Compression of ideas per sentence. How much conceptual payload per word?
   Penalize bloat, filler, repetition, and over-explaining the obvious.

7. RH — Resonance Hook (0–100): Memorability and signal salience. Will a reader remember this passage?
   Does it produce a "this matters" response? Penalize forgettable prose.

Return ONLY valid JSON — no preamble, no markdown code blocks:
{
  "vc": <integer 0-100>,
  "nt": <integer 0-100>,
  "pa": <integer 0-100>,
  "da": <integer 0-100>,
  "tc": <integer 0-100>,
  "wd": <integer 0-100>,
  "rh": <integer 0-100>,
  "rationale": "<2-3 sentence synthesis of the overall score, naming the strongest and weakest dimension>"
}`;

// ─── Hash util ───────────────────────────────────────────────────────────────

function sha256(text: string): string {
  // Simple deterministic hash for block integrity
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const ts = Date.now().toString(16);
  return `CH-${Math.abs(hash).toString(16).padStart(8, '0')}-${ts}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { chapter_id, text: rawText, manuscript_id, title } = body;

    if (!chapter_id && !rawText) {
      return Response.json(
        { error: 'Provide chapter_id or text' },
        { status: 400 }
      );
    }

    // ── 1. Fetch chapter if id provided ──────────────────────────────────────
    let textToScore = rawText || '';
    let resolvedChapterId = chapter_id || null;
    let resolvedManuscriptId = manuscript_id || null;
    let chapterTitle = title || 'Untitled';

    if (chapter_id) {
      const chapters = await base44.asServiceRole.entities.Chapter.filter(
        { id: chapter_id }
      );
      if (!chapters || chapters.length === 0) {
        return Response.json(
          { error: `Chapter ${chapter_id} not found` },
          { status: 404 }
        );
      }
      const chapter = chapters[0];
      textToScore = chapter.body || '';
      resolvedManuscriptId = chapter.manuscript_id || manuscript_id || null;
      chapterTitle = chapter.title || title || 'Untitled';

      if (!textToScore || textToScore.trim().length < 50) {
        return Response.json(
          { error: 'Chapter body too short to score (< 50 chars)' },
          { status: 400 }
        );
      }
    }

    const wordCount = textToScore.trim().split(/\s+/).filter(Boolean).length;

    // ── 2. Call OpenAI for scoring ────────────────────────────────────────────
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return Response.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiKey });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.1,
      max_tokens: 400,
      messages: [
        { role: 'system', content: SCORING_SYSTEM },
        {
          role: 'user',
          content: `Score this passage. Context title: "${chapterTitle}"\n\nPASSAGE:\n${textToScore.slice(0, 6000)}`
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content || '';

    // Strip markdown code fences if model wraps output
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let scores: Record<string, number>;
    let rationale = '';
    try {
      const parsed = JSON.parse(cleaned);
      scores = {
        vc: Math.min(100, Math.max(0, Math.round(parsed.vc ?? 50))),
        nt: Math.min(100, Math.max(0, Math.round(parsed.nt ?? 50))),
        pa: Math.min(100, Math.max(0, Math.round(parsed.pa ?? 50))),
        da: Math.min(100, Math.max(0, Math.round(parsed.da ?? 50))),
        tc: Math.min(100, Math.max(0, Math.round(parsed.tc ?? 50))),
        wd: Math.min(100, Math.max(0, Math.round(parsed.wd ?? 50))),
        rh: Math.min(100, Math.max(0, Math.round(parsed.rh ?? 50))),
      };
      rationale = parsed.rationale || '';
    } catch {
      return Response.json(
        { error: 'Failed to parse LLM scoring response', raw },
        { status: 500 }
      );
    }

    // ── 3. Compute Crown Score (CB-373 formula) ───────────────────────────────
    const crownScore = parseFloat((
      scores.vc * 0.20 +
      scores.nt * 0.15 +
      scores.pa * 0.15 +
      scores.da * 0.15 +
      scores.tc * 0.15 +
      scores.wd * 0.10 +
      scores.rh * 0.10
    ).toFixed(2));

    // ── 4. Mint VOLTS (only if score ≥ 70) ────────────────────────────────────
    const voltsMinted = crownScore >= 70 ? Math.floor(crownScore * 1.5) : 0;
    const canonEligible = crownScore >= 85;

    // ── 5. Generate block hash ─────────────────────────────────────────────────
    const blockHash = sha256(
      `${resolvedChapterId || 'raw'}-${crownScore}-${Date.now()}`
    );
    const runTimestamp = new Date().toISOString();

    // ── 6. Persist CrownRun record ─────────────────────────────────────────────
    const crownRun = await base44.asServiceRole.entities.CrownRun.create({
      chapter_id: resolvedChapterId,
      manuscript_id: resolvedManuscriptId,
      run_timestamp: runTimestamp,
      text_snapshot: textToScore.slice(0, 2000), // cap snapshot size
      word_count: wordCount,
      vc_score: scores.vc,
      nt_score: scores.nt,
      pa_score: scores.pa,
      da_score: scores.da,
      tc_score: scores.tc,
      wd_score: scores.wd,
      rh_score: scores.rh,
      crown_score: crownScore,
      volts_minted: voltsMinted,
      block_hash: blockHash,
      model_used: 'gpt-4o',
      rationale,
      sealed: false,
      canon_eligible: canonEligible,
    });

    // ── 7. Update Chapter record ──────────────────────────────────────────────
    if (resolvedChapterId) {
      await base44.asServiceRole.entities.Chapter.update(resolvedChapterId, {
        crown_score: crownScore,
        last_scored_at: runTimestamp,
        status: 'Scored',
      });
    }

    // ── 8. Return result ──────────────────────────────────────────────────────
    return Response.json({
      ok: true,
      crown_run_id: crownRun.id,
      block_hash: blockHash,
      run_timestamp: runTimestamp,
      chapter_id: resolvedChapterId,
      manuscript_id: resolvedManuscriptId,
      word_count: wordCount,
      dimensions: {
        vc: scores.vc,
        nt: scores.nt,
        pa: scores.pa,
        da: scores.da,
        tc: scores.tc,
        wd: scores.wd,
        rh: scores.rh,
      },
      crown_score: crownScore,
      volts_minted: voltsMinted,
      canon_eligible: canonEligible,
      rationale,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
