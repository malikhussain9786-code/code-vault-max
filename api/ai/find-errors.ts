import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../../server/lib/http/helpers.js';
import { validateBody } from '../../server/lib/http/validate.js';
import { runAiCall } from '../../server/lib/http/aiHandler.js';
import { aiCodeOnlySchema } from '../../server/lib/validators/aiValidators.js';
import { findErrors } from '../../server/lib/services/aiService.js';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const input = validateBody(aiCodeOnlySchema, req.body);
  await runAiCall(res, () => findErrors(input));
});
