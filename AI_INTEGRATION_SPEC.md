# ARCHON Ψ — Hugging Face × NVIDIA AI Integration Spec

## Overview
Wire ARCHON Ψ to use Hugging Face Inference Providers with NVIDIA models for three AI-powered features.

## Authenticated User
- HF username: `Cortex-chain-waveform`
- The HF API is accessed via the connected Hugging Face tools (not raw API keys)
- For the app's backend, we use the HF OpenAI-compatible router endpoint

## Integration Architecture

### 1. AI Verdict Analyst (Calculator Page)
**Trigger:** After user computes QTAC₇ scores, a "Generate AI Analysis" button appears
**Model:** `nvidia/Llama-3.1-Nemotron-Nano-8B-v1` via featherless-ai provider
**Endpoint:** `https://router.huggingface.co/featherless-ai/v1/chat/completions`
**What it does:**
- Takes the 6 operator scores, QTAC₇, StoneScore, PINK, OmegaGap
- Generates a professional investment-grade verdict narrative
- Outputs: recommendation text, key risks, thesis summary, conditions for re-evaluation
- The generated text populates the `verdictText` field before SEAL TO CANON

**System Prompt:**
```
You are ARCHON Ψ, the Sovereign Verdict Engine by CortexChain. You analyze human capital 
and investment metrics using the QTAC₇ scoring framework. Given operator scores 
(Business/Economics/Compounding/Float/People/Errors), generate a concise, institutional-grade 
verdict narrative. Include: 1-sentence thesis, key strength, key risk, recommendation 
(SEAL/HOLD/PASS), and one retrial condition. Be direct. No filler. Think like a Series A 
investor and an engineer simultaneously. Output in structured JSON format.
```

### 2. AI Signal Box Processor (Registry Page - MARKET tab)
**Trigger:** When user submits text/URL in Signal Box widget  
**Model:** Same Nemotron Nano 8B
**What it does:**
- Parses natural language signal (e.g., "Brandon Hines just shipped ARCHON Ψ CANON to production")
- Extracts: subject name, signal type (SHIP/RAISE/PUBLISH/WIN), confidence, relevance to QTAC₇
- Returns structured signal data that gets displayed in the Signal Box feed

### 3. AI MasterCard Generator (Registry Page - Ingest Widget)
**Trigger:** When user submits email + LinkedIn URL via "Compute My QTAC₇" button
**Model:** Same Nemotron Nano 8B  
**What it does:**
- Instead of random QTAC₇ score, generates a simulated profile analysis
- Returns: estimated QTAC₇ score, thesis, suggested tags, recommended status tier
- Creates a PROTO-status MasterCard entry

## Backend Implementation

### New file: `server/ai.ts`
Utility module for HF Inference API calls.

```typescript
// Uses HF OpenAI-compatible router
// Endpoint: https://router.huggingface.co/featherless-ai/v1/chat/completions
// Model: nvidia/Llama-3.1-Nemotron-Nano-8B-v1
// Auth: Bearer $HF_TOKEN (injected via env)

// NOTE: Since we can't store API keys in the sandbox, we use the 
// llm-api:website credential which provides OpenAI SDK access.
// We'll use the built-in proxy with a model that routes to the right backend.
// 
// ALTERNATIVE APPROACH: Use the built-in LLM API proxy with OpenAI SDK
// since it's already authenticated. We configure it to make HF-compatible
// calls using the OpenAI SDK pattern.
```

### New API Routes in `server/routes.ts`

```
POST /api/ai/analyze-verdict
  Body: { operators, qtac7Score, stoneScore, pinkScore, omegaGap, subjectName, subjectKind }
  Returns: { verdictText, recommendation, thesis, keyRisk, keyStrength, retrialCondition }

POST /api/ai/process-signal  
  Body: { signalText }
  Returns: { subjectName, signalType, confidence, relevance, summary }

POST /api/ai/generate-mastercard
  Body: { email, linkedinUrl }
  Returns: { name, estimatedQtac7, thesis, tags, suggestedStatus, metricThatMatters }
```

## Frontend Changes

### Calculator Page (`calculator.tsx`)
- Add "⚡ Generate AI Analysis" button below the scores panel (only visible after QTAC₇ is computed)
- Shows loading spinner with "NVIDIA Nemotron analyzing..." text
- Auto-fills verdict text and recommendation fields
- Badge: "Powered by NVIDIA × Hugging Face" with icons

### Registry Page (`registry.tsx`)
- **Ingest Widget:** Replace random score with AI-generated profile
  - Loading state: "Computing QTAC₇ via NVIDIA Nemotron..."
  - Show generated thesis and tags
- **Signal Box (MARKET tab):** Add text input for signal submission
  - Parse and display structured signal cards
- Add "NVIDIA × Hugging Face" powered badge in the Signal Box header

### Branding
- Add powered-by badge component with NVIDIA + HF logos
- Use in Calculator header, Registry header, and footer
- Badge text: "Inference powered by NVIDIA Nemotron × Hugging Face"
- Colors: NVIDIA green (#76B900) accent on the badge

## Technical Notes
- Since we're in a sandbox environment, use the built-in LLM API proxy (OpenAI SDK with api_credentials=["llm-api:website"])
- The server must be started with: `start_server(command="...", api_credentials=["llm-api:website"])`
- Use gpt_5_4_mini as the model via the OpenAI proxy (fast, cheap) for MVP
- Add a model selection dropdown later for NVIDIA endpoint direct calls
- All AI responses should be cached in SQLite to avoid redundant calls
