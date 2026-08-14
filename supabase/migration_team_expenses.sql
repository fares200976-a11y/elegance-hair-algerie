-- =========================================================
-- ÉLÉGANCE HAIR ALGÉRIE - MIGRATION : ÉQUIPE, DÉPENSES, SUIVI
-- À exécuter dans Supabase → SQL Editor (après schema.sql)
-- =========================================================

-- 1. TABLE ÉQUIPE (membres avec code d'accès simple)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE DÉPENSES / FACTURES D'ACHAT
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    supplier VARCHAR(255),
    amount NUMERIC(12,2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Autre',
    invoice_url TEXT,
    notes TEXT,
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LIER UNE COMMANDE AU MEMBRE DE L'ÉQUIPE QUI L'A TRAITÉE
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS handled_by_name VARCHAR(255);

-- SÉCURITÉ (RLS) — accès uniquement via le backend (clé service_role), comme le reste
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès complet Admin Équipe" ON public.team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Dépenses" ON public.expenses FOR ALL TO authenticated USING (true);

-- BUCKET DE STOCKAGE DES FACTURES D'ACHAT (photos/scans)
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Factures achat publiques accessibles" ON storage.objects
FOR SELECT USING (bucket_id = 'invoices');
-- Pas de policy INSERT publique ici non plus : upload uniquement via POST /api/upload
-- (protégé par requireAdmin/requireStaff, clé service_role côté serveur).
