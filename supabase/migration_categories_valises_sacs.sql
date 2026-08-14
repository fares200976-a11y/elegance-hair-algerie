-- =========================================================
-- ÉLÉGANCE HAIR ALGÉRIE - MIGRATION : CATÉGORIES VALISES & SACS
-- À exécuter dans Supabase → SQL Editor
-- =========================================================

INSERT INTO public.categories (name, slug, description, image)
VALUES
  ('Valises', 'valises', 'Valises de voyage rigides et souples, toutes tailles.', ''),
  ('Sacs à Main', 'sacs-a-main', 'Sacs à main élégants pour toutes les occasions.', ''),
  ('Sacs à Dos', 'sacs-a-dos', 'Sacs à dos pratiques et résistants, quotidien et voyage.', '')
ON CONFLICT (slug) DO NOTHING;
