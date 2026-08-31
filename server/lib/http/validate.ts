import type { ZodSchema } from 'zod';
import { HttpError } from './helpers.js';

/** Validates a request body against a schema, throwing a structured 400 HttpError on failure. */
export function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, 'Validation failed', {
      details: result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
  }
  return result.data;
}

export function validateQuery<T>(schema: ZodSchema<T>, query: unknown): T {
  const result = schema.safeParse(query);
  if (!result.success) {
    throw new HttpError(400, 'Invalid query parameters', {
      details: result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
  }
  return result.data;
}
