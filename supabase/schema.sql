-- =========================================================
-- ÉLÉGANCE HAIR ALGÉRIE - SCHÉMA DE BASE DE DONNÉES SUPABASE
-- =========================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE DES CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE DES PRODUITS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand VARCHAR(100) DEFAULT 'Élégance Pro',
    sku_ref VARCHAR(100) UNIQUE,
    short_desc TEXT,
    full_desc TEXT,
    price NUMERIC(12,2) NOT NULL,
    old_price NUMERIC(12,2),
    is_promo BOOLEAN DEFAULT false,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    min_stock INT DEFAULT 5,
    warranty VARCHAR(100) DEFAULT '2 ans',
    power VARCHAR(50),
    color VARCHAR(50),
    temperature VARCHAR(100),
    speed VARCHAR(100),
    tech_specs JSONB DEFAULT '[]'::jsonb,
    box_content JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE DES WILAYAS ET TARIFS DE LIVRAISON
CREATE TABLE IF NOT EXISTS public.wilayas (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    home_price NUMERIC(10,2) DEFAULT 500,
    agency_price NUMERIC(10,2) DEFAULT 300,
    active BOOLEAN DEFAULT true
);

-- 4. TABLE DES COMMANDES
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    wilaya_code VARCHAR(2) REFERENCES public.wilayas(code),
    wilaya_name VARCHAR(100),
    commune VARCHAR(100),
    address TEXT NOT NULL,
    delivery_type VARCHAR(20) DEFAULT 'domicile' CHECK (delivery_type IN ('domicile', 'agence')),
    delivery_fee NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Paiement à la livraison',
    status VARCHAR(30) DEFAULT 'Nouvelle' CHECK (status IN (
        'Nouvelle', 'À confirmer', 'Confirmée', 'En préparation', 'Expédiée', 'En livraison', 'Livrée', 'Annulée'
    )),
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES MOUVEMENTS DE STOCK
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    new_stock INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    admin_name VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE DES AVIS CLIENTS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_wilaya VARCHAR(100),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE DES PARAMÈTRES BOUTIQUE
CREATE TABLE IF NOT EXISTS public.settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(255) DEFAULT 'Élégance Hair Algérie',
    tagline TEXT,
    logo_url TEXT,
    phone VARCHAR(100),
    whatsapp_phone VARCHAR(100),
    email VARCHAR(100),
    address TEXT,
    wilaya VARCHAR(100),
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    default_home_shipping_fee NUMERIC(10,2) DEFAULT 500,
    default_agency_shipping_fee NUMERIC(10,2) DEFAULT 300,
    free_shipping_min_amount NUMERIC(10,2) DEFAULT 25000,
    terms_and_conditions TEXT,
    privacy_policy TEXT
);

-- CONFIGURATION ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- POLITIQUES RLS PUBLIQUES (Lecture seule pour catalogue, Création de commande autorisée)
CREATE POLICY "Lecture publique des catégories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Lecture publique des produits" ON public.products FOR SELECT USING (true);
CREATE POLICY "Lecture publique des wilayas" ON public.wilayas FOR SELECT USING (true);
CREATE POLICY "Lecture publique des avis approuvés" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Lecture publique des paramètres" ON public.settings FOR SELECT USING (true);

-- POLITIQUES RLS CLIENTS
CREATE POLICY "Création de commande par client" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Suivi de commande par numéro" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Ajout d'un avis client" ON public.reviews FOR INSERT WITH CHECK (true);

-- POLITIQUES ADMIN (Tout pouvoir pour utilisateurs authentifiés via Supabase Auth)
-- Non utilisées actuellement : le backend (api/lib/db.ts) accède à Postgres avec la
-- clé service_role, qui contourne RLS. L'autorisation admin réelle est assurée par
-- le middleware requireAdmin (JWT maison), pas par ces policies. Elles restent en
-- place par sécurité en profondeur si un jour le frontend interroge Supabase directement.
CREATE POLICY "Accès complet Admin Catégories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Produits" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Wilayas" ON public.wilayas FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Commandes" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Mouvements Stock" ON public.stock_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Avis" ON public.reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet Admin Paramètres" ON public.settings FOR ALL TO authenticated USING (true);

-- BUCKET DE STOCKAGE DES IMAGES PRODUITS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Images publiques accessibles" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Pas de policy INSERT publique ici volontairement : les uploads d'images passent
-- uniquement par la route serveur POST /api/upload (protégée par requireAdmin, JWT),
-- qui utilise la clé service_role et contourne donc RLS. Un accès direct au bucket
-- depuis le navigateur avec la clé anonyme n'est ni prévu ni autorisé.
