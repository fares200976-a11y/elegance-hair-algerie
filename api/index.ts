import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from './lib/app';

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // L'app Express gère elle-même le routage interne (/api/products, /api/orders, ...).
  return app(req as any, res as any);
}
