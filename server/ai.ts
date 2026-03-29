import OpenAI from "openai";

const client = new OpenAI();

const VERDICT_SYSTEM_PROMPT = `You are ARCHON Ψ, the Sovereign Verdict Engine by CortexChain. You analyze human capital and investment metrics using the QTAC₇ scoring framework. Given operator scores (Business/Economics/Compounding/Float/People/Errors), generate a concise, institutional-grade verdict narrative. Include: 1-sentence thesis, key strength, key risk, recommendation (SEAL/HOLD/PASS), and one retrial condition. Be direct. No filler. Think like a Series A investor and an engineer simultaneously. Output valid JSON with these exact keys: verdictText, recommendation, thesis, keyRisk, keyStrength, retrialCondition. No markdown, no code fences, just raw JSON.`;

const SIGNAL_SYSTEM_PROMPT = `You are ARCHON Ψ Signal Processor. Parse natural language signals about people, companies, or events into structured data. Extract: the subject name, signal type (one of: SHIP, RAISE, PUBLISH, WIN, HIRE, EXIT, LAUNCH), confidence score (0-100), relevance to human capital assessment, and a one-sentence summary. Output valid JSON with these exact keys: subjectName, signalType, confidence, relevance, summary. No markdown, no code fences, just raw JSON.`;

const MASTERCARD_SYSTEM_PROMPT = `You are ARCHON Ψ MasterCard Generator. Given an email and LinkedIn URL, generate a simulated AI profile analysis for a human capital MasterCard. Produce: an estimated QTAC₇ score (6.0-9.5 range), a one-sentence thesis about their human capital value, an array of 3-5 tags (from: ARCHITECTURE, COGNITION, CAPITAL, MOAT, COMPOUNDING, NETWORK, SYSTEMS, IMPACT, FRAMEWORK, SCIENCE, RESULTS, ENGAGE, ALIGNMENT), a suggested status (PROTO or META), one metric that matters for this person, and their likely role title. Output valid JSON with these exact keys: estimatedQtac7, thesis, tags, suggestedStatus, metricThatMatters, role. No markdown, no code fences, just raw JSON.`;

function parseJsonResponse(text: string): any {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```(?:json)?\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

export async function analyzeVerdict(data: {
  subjectName: string;
  subjectKind: string;
  operators: any;
  qtac7Score: number;
  stoneScore: number;
  pinkScore: number;
  omegaGap: number;
}): Promise<{
  verdictText: string;
  recommendation: string;
  thesis: string;
  keyRisk: string;
  keyStrength: string;
  retrialCondition: string;
}> {
  const inputText = `${VERDICT_SYSTEM_PROMPT}

Analyze the following subject and operator data:

Subject: ${data.subjectName} (${data.subjectKind})
QTAC₇ Score: ${data.qtac7Score.toFixed(3)}
StoneScore: ${data.stoneScore.toFixed(3)}
PINK Risk: ${data.pinkScore.toFixed(3)}
Omega Gap: ${data.omegaGap.toFixed(3)}

Operators: ${JSON.stringify(data.operators, null, 2)}

Generate your verdict as JSON.`;

  const response = await client.responses.create({
    model: "gpt5_mini",
    input: inputText,
  });

  const parsed = parseJsonResponse(response.output_text);
  return {
    verdictText: parsed.verdictText || "Verdict analysis complete.",
    recommendation: parsed.recommendation || "HOLD",
    thesis: parsed.thesis || "Analysis pending.",
    keyRisk: parsed.keyRisk || "Insufficient data.",
    keyStrength: parsed.keyStrength || "Subject shows potential.",
    retrialCondition: parsed.retrialCondition || "Reassess in 90 days.",
  };
}

export async function processSignal(signalText: string): Promise<{
  subjectName: string;
  signalType: string;
  confidence: number;
  relevance: string;
  summary: string;
}> {
  const inputText = `${SIGNAL_SYSTEM_PROMPT}

Parse this signal:
"${signalText}"

Output as JSON.`;

  const response = await client.responses.create({
    model: "gpt5_mini",
    input: inputText,
  });

  const parsed = parseJsonResponse(response.output_text);
  return {
    subjectName: parsed.subjectName || "Unknown",
    signalType: parsed.signalType || "SHIP",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 75,
    relevance: parsed.relevance || "Relevant to human capital assessment.",
    summary: parsed.summary || signalText.slice(0, 100),
  };
}

export async function generateMasterCardProfile(email: string, linkedinUrl: string): Promise<{
  estimatedQtac7: number;
  thesis: string;
  tags: string[];
  suggestedStatus: string;
  metricThatMatters: string;
  role: string;
}> {
  const inputText = `${MASTERCARD_SYSTEM_PROMPT}

Generate a MasterCard profile analysis for:
Email: ${email}
LinkedIn: ${linkedinUrl}

Output as JSON.`;

  const response = await client.responses.create({
    model: "gpt5_mini",
    input: inputText,
  });

  const parsed = parseJsonResponse(response.output_text);
  return {
    estimatedQtac7: typeof parsed.estimatedQtac7 === "number" ? parsed.estimatedQtac7 : 7.5,
    thesis: parsed.thesis || "Human capital profile under analysis.",
    tags: Array.isArray(parsed.tags) ? parsed.tags : ["CAPITAL", "SYSTEMS"],
    suggestedStatus: parsed.suggestedStatus || "PROTO",
    metricThatMatters: parsed.metricThatMatters || "Cognitive output per capita",
    role: parsed.role || "Operator",
  };
}
