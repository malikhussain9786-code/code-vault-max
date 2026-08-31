import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from '../../server/lib/http/helpers.js';
import { isAiConfigured } from '../../server/lib/services/aiProviderService.js';

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.status(200).json({ available: isAiConfigured() });
});
