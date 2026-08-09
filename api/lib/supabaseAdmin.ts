import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

// Client Supabase "admin" utilisé UNIQUEMENT côté serveur (routes /api/*).
// Utilise la clé service_role : elle contourne les policies RLS, donc l'autorisation
// réelle (qui a le droit de modifier quoi) reste assurée par notre middleware requireAdmin
// (JWT), pas par Supabase Auth. Ne jamais importer ce fichier depuis du code exécuté
// dans le navigateur : la clé service_role donne un accès total à la base.
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      '❌ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants. ' +
      'Définissez-les dans .env (local) ou dans les variables d\'environnement Vercel (production).'
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cachedClient;
}
