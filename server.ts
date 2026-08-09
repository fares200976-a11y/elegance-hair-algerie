import 'dotenv/config';
import { createServer as createViteServer } from 'vite';
import { createApp } from './api/lib/app';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = createApp();

  // En développement local uniquement : Vite sert le frontend avec HMR.
  // En production (Vercel), le frontend est buildé en statique séparément (voir vercel.json)
  // et ce fichier n'est pas utilisé — c'est api/index.ts qui gère les requêtes /api/*.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur Élégance Hair (dev local) lancé sur http://localhost:${PORT}`);
  });
}

startServer();
