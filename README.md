# Élégance Hair Algérie

Boutique e-commerce (React 19 + Vite + Express) avec paiement à la livraison, prête pour un déploiement sur **Vercel** avec une base de données **Supabase (Postgres)**.

## Architecture

- `src/` — frontend React (inchangé, appelle `/api/*`)
- `api/lib/app.ts` — toutes les routes API (Express), partagées entre dev local et prod
- `api/lib/db.ts` — accès aux données via Supabase (remplace l'ancienne DB en fichier JSON)
- `api/lib/auth.ts` — authentification admin par JWT
- `api/index.ts` — point d'entrée serverless Vercel (gère `/api/*`)
- `server.ts` — point d'entrée pour le développement local uniquement (Express + Vite middleware)
- `supabase/schema.sql` — schéma de base de données (tables + RLS)
- `scripts/seed-supabase.ts` — insère les données de démonstration (produits, catégories, wilayas)

## 1. Créer le projet Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécuter le contenu de `supabase/schema.sql`
3. Dans **Project Settings > API**, récupérer :
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configuration locale

```bash
cp .env.example .env
```

Remplir dans `.env` :
- `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (étape 1)
- `JWT_SECRET` : générer avec `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL` : l'email de connexion admin souhaité
- `ADMIN_PASSWORD_HASH` : générer avec `node -e "console.log(require('bcryptjs').hashSync('VOTRE_MDP', 10))"`

## 3. Peupler la base avec les données de démonstration

```bash
npm install
npm run seed
```

(Ne s'exécute qu'une fois — le script n'insère rien si des produits existent déjà.)

## 4. Lancer en local

```bash
npm run dev
```
→ http://localhost:3000 (admin : `/admin`, avec l'email/mot de passe configurés)

## 5. Déployer sur Vercel

1. Pousser le projet sur GitHub
2. Importer le repo dans [vercel.com](https://vercel.com/new)
3. Vercel détecte `vercel.json` automatiquement (build = `vite build`, sortie = `dist`, API = `api/index.ts`)
4. Dans **Settings > Environment Variables** du projet Vercel, ajouter :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `APP_URL` (l'URL Vercel finale, ex: `https://elegance-hair.vercel.app`)
5. Déployer

Les images uploadées depuis l'admin sont stockées dans le bucket Supabase Storage `products` (créé automatiquement par `schema.sql`), pas sur le disque du serveur — indispensable en environnement serverless.
