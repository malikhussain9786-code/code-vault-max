import axios from 'axios';
import { logger } from '../utils/logger.js';

// Groq — chosen over Gemini because Gemini's free tier was cut by up to 92% in
// December 2025 (as low as ~20 requests/day on some models). Groq's free tier remains
// generous (thousands of requests/day) and needs no credit card. Uses an OpenAI-compatible
// chat completions format, which is why the request/response shape here differs from a
// typical Gemini integration.
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
// REAL BUG FOUND AND FIXED: llama-3.3-70b-versatile (the previous default here) was
// retired by Groq in June 2026 — every single AI call was hitting a "model
// decommissioned" error, which is why nothing worked no matter how many times it was
// retried. openai/gpt-oss-120b is Groq's current officially recommended general-purpose
// model. If AI features ever stop working again with a "model not found" or
// "decommissioned" error, check https://console.groq.com/docs/models for the current
// recommendation and set GROQ_MODEL in the environment — no code change needed.
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_API_BASE = process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1';

// Balanced deliberately: Groq's free tier shares a per-minute token budget (TPM) across
// ALL requests hitting the app, not per-user — a response set too high could eat most
// of that shared budget in one call and starve other users in the same minute. 3072 is
// enough for a genuinely detailed explanation or a full corrected code block, without
// being wasteful of a shared, limited resource.
const MAX_OUTPUT_TOKENS = 3072;

export class AiNotConfiguredError extends Error {
  constructor() {
    super('AI features are optional and are not configured on this server. Set GROQ_API_KEY to enable them.');
  }
}

export class AiUnavailableError extends Error {}

export function isAiConfigured(): boolean {
  return GROQ_API_KEY.length > 0;
}

/**
 * Calls Groq's OpenAI-compatible chat completions endpoint. Kept as a thin, swappable
 * layer — switching providers again later means changing this one file, not every call site.
 */
export async function generateContent(prompt: string): Promise<string> {
  if (!isAiConfigured()) {
    throw new AiNotConfiguredError();
  }

  try {
    const response = await axios.post(
      `${GROQ_API_BASE}/chat/completions`,
      {
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        // openai/gpt-oss-120b is a reasoning model — REAL bug found and fixed here:
        // (1) it's documented by Groq to use `max_completion_tokens`, not the older
        // `max_tokens` this was sending before, which some reasoning models ignore or
        // handle inconsistently. (2) reasoning models spend part of their token budget
        // on hidden internal "thinking" before the visible answer — if that runs out
        // mid-thought, the real answer never gets generated, which produces exactly
        // the "doesn't work no matter how many times you click" symptom. Setting
        // reasoning_effort to 'low' keeps that hidden overhead small (code review/
        // generation doesn't need deep multi-step reasoning) and also finishes faster,
        // which matters given Vercel's Hobby plan kills any function after 10 seconds.
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        reasoning_effort: 'low',
        include_reasoning: false, // gpt-oss models don't support reasoning_format — this is the documented way to skip emitting unused reasoning text, keeping responses faster and leaner
        temperature: 0.3, // lower temperature — reliable, consistent code analysis, not creative variation
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new AiUnavailableError('AI returned an empty response. Please try again.');
    }
    return text;
  } catch (err) {
    if (err instanceof AiUnavailableError) throw err;
    logger.error('Groq API request failed', { error: (err as Error).message });
    throw new AiUnavailableError('Could not reach the AI service right now. Please try again shortly.');
  }
}
