import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_REVIEWS } from '../src/data/initialData';
import { INITIAL_WILAYAS } from '../src/data/wilayas';
import { categoryToDb, productToDb, wilayaToDb, settingsToDb } from '../api/lib/mappers';

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans .env');
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });

  console.log('→ Vérification des données existantes...');
  const { count: existingProducts } = await sb.from('products').select('id', { count: 'exact', head: true });
  if (existingProducts && existingProducts > 0) {
    console.log(`⚠️  ${existingProducts} produit(s) déjà présent(s) en base. Le seed n'insère que si les tables sont vides, pour éviter les doublons.`);
    console.log('   Pour réinitialiser : videz les tables products/categories/wilayas/settings dans le SQL Editor Supabase, puis relancez.');
    process.exit(0);
  }

  console.log('→ Insertion des catégories...');
  const oldIdToSlug = new Map(INITIAL_CATEGORIES.map(c => [c.id, c.slug]));
  const { data: insertedCats, error: catErr } = await sb
    .from('categories')
    .insert(INITIAL_CATEGORIES.map(c => categoryToDb(c)))
    .select();
  if (catErr) throw catErr;
  const slugToNewId = new Map((insertedCats || []).map((c: any) => [c.slug, c.id]));

  console.log('→ Insertion des wilayas...');
  const { error: wilErr } = await sb.from('wilayas').upsert(INITIAL_WILAYAS.map(w => ({ code: w.code, ...wilayaToDb(w) })));
  if (wilErr) throw wilErr;

  console.log('→ Insertion des produits...');
  const productsToInsert = INITIAL_PRODUCTS.map(p => {
    const slug = oldIdToSlug.get(p.categoryId);
    const newCategoryId = slug ? slugToNewId.get(slug) : undefined;
    return productToDb({ ...p, categoryId: newCategoryId });
  });
  const { data: insertedProducts, error: prodErr } = await sb.from('products').insert(productsToInsert).select();
  if (prodErr) throw prodErr;

  console.log('→ Insertion des paramètres boutique...');
  const { error: setErr } = await sb.from('settings').upsert({ id: 1, ...settingsToDb(INITIAL_SETTINGS) });
  if (setErr) throw setErr;

  console.log('→ Insertion des avis de démonstration...');
  // Associe les avis de démo au premier produit disponible (données d'exemple uniquement)
  const firstProductId = insertedProducts?.[0]?.id;
  if (firstProductId && INITIAL_REVIEWS.length > 0) {
    const { error: revErr } = await sb.from('reviews').insert(
      INITIAL_REVIEWS.map(r => ({
        product_id: firstProductId,
        customer_name: r.customerName,
        customer_wilaya: r.customerWilaya,
        rating: r.rating,
        comment: r.comment,
        approved: r.approved
      }))
    );
    if (revErr) throw revErr;
  }

  console.log('✅ Seed terminé avec succès.');
  console.log(`   ${insertedCats?.length || 0} catégories, ${insertedProducts?.length || 0} produits, ${INITIAL_WILAYAS.length} wilayas.`);
}

main().catch(err => {
  console.error('❌ Erreur pendant le seed:', err);
  process.exit(1);
});
