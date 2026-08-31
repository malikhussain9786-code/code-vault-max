import type { VercelRequest, VercelResponse } from '@vercel/node';

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Wraps a serverless function handler with consistent error handling. Every /api/ai
 * handler is wrapped with this, without exception, so no single bug can leak a raw
 * stack trace or crash silently without a clean response.
 */
export function withErrorHandling(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void | VercelResponse>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message, details: err.details });
        return;
      }
      console.error('Unhandled error in request', { path: req.url, error: (err as Error).message, stack: (err as Error).stack });
      res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
    }
  };
}
