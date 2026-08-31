import type { VercelResponse } from '@vercel/node';
import { AiNotConfiguredError, AiUnavailableError } from '../services/aiProviderService.js';

/** Runs an AI service call and maps its errors to the right HTTP response — shared by all 6 AI endpoints. */
export async function runAiCall<T>(res: VercelResponse, fn: () => Promise<T>): Promise<void> {
  try {
    const result = await fn();
    res.status(200).json(result as object);
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      res.status(200).json({ available: false, message: err.message });
      return;
    }
    if (err instanceof AiUnavailableError) {
      res.status(503).json({ error: err.message });
      return;
    }
    throw err;
  }
}
