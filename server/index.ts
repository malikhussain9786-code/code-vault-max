import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Local dev only: wires the same api/ai/*.ts handler files to Express routes so
// `npm run dev` works exactly like the real deployment. Production uses the api/
// files directly as individual Vercel serverless functions — no database, no auth,
// just stateless calls to Groq, matching the same simple, proven pattern used
// elsewhere for AI features.

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

function adapt(vercelHandler: (req: VercelRequest, res: VercelResponse) => Promise<void>) {
  return async (req: Request, res: Response) => {
    await vercelHandler(req as unknown as VercelRequest, res as unknown as VercelResponse);
  };
}

async function mount() {
  const routes: { path: string; file: string }[] = [
    { path: '/api/ai/status', file: '../api/ai/status.js' },
    { path: '/api/ai/generate', file: '../api/ai/generate.js' },
    { path: '/api/ai/find-errors', file: '../api/ai/find-errors.js' },
    { path: '/api/ai/fix-errors', file: '../api/ai/fix-errors.js' },
    { path: '/api/ai/explain', file: '../api/ai/explain.js' },
    { path: '/api/ai/improve', file: '../api/ai/improve.js' },
    { path: '/api/ai/document', file: '../api/ai/document.js' },
    { path: '/api/ai/learn', file: '../api/ai/learn.js' },
  ];

  for (const route of routes) {
    const mod = await import(route.file);
    app.all(route.path, adapt(mod.default));
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Code Vault Max local AI server listening on port ${PORT}`);
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY is not set — AI features will report as unavailable until it is.');
    }
  });
}

mount().catch((err) => {
  console.error('Failed to start local AI server:', err);
  process.exit(1);
});
