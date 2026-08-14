-- =========================================================
-- ÉLÉGANCE HAIR ALGÉRIE - MIGRATION : CONTACTS ÉQUIPE (ALARME COMMANDE)
-- À exécuter dans Supabase → SQL Editor (après migration_team_expenses.sql)
-- =========================================================

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS email VARCHAR(255);
