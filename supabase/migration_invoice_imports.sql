-- =========================================================
-- ÉLÉGANCE HAIR ALGÉRIE - MIGRATION : SCAN FACTURE (ANTI-DOUBLON)
-- À exécuter dans Supabase → SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS public.invoice_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) NOT NULL,
    total_amount NUMERIC(12,2),
    items_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(invoice_number, total_amount)
);

ALTER TABLE public.invoice_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accès complet Admin Factures" ON public.invoice_imports FOR ALL TO authenticated USING (true);
