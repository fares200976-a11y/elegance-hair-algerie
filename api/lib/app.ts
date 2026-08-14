import express from 'express';
import { requireAdmin, verifyAdminLogin, requireStaffOrAdmin, issueStaffToken } from './auth.js';
import { getSupabaseAdmin } from './supabaseAdmin.js';
import * as db from './db.js';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Petit wrapper pour éviter un try/catch répété dans chaque route async
  const h = (fn: (req: express.Request, res: express.Response) => Promise<void>) =>
    (req: express.Request, res: express.Response) => {
      fn(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
      });
    };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Admin Auth Login
  app.post('/api/admin/login', h(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return void res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }
    const result = await verifyAdminLogin(email, password);
    if (!result) {
      return void res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    res.json({ success: true, token: result.token, user: { name: 'Administrateur', email: result.email, role: 'admin' } });
  }));

  // Connexion Équipe (staff) — juste un code, accès limité aux commandes.
  app.post('/api/team/login', h(async (req, res) => {
    const { code } = req.body;
    if (!code) return void res.status(400).json({ success: false, message: 'Code requis' });
    const member = await db.verifyTeamCode(String(code));
    if (!member) return void res.status(401).json({ success: false, message: 'Code invalide ou inactif' });
    const token = issueStaffToken(member.id, member.name);
    res.json({ success: true, token, user: { name: member.name, role: 'staff' } });
  }));

  // Équipe — gestion réservée à l'admin
  app.get('/api/team', requireAdmin, h(async (req, res) => {
    res.json(await db.listTeamMembers());
  }));

  app.post('/api/team', requireAdmin, h(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return void res.status(400).json({ message: 'Nom requis' });
    const member = await db.createTeamMember(name.trim());
    res.status(201).json(member);
  }));

  app.put('/api/team/:id/regenerate', requireAdmin, h(async (req, res) => {
    const updated = await db.regenerateTeamMemberCode(req.params.id);
    if (!updated) return void res.status(404).json({ message: 'Membre non trouvé' });
    res.json(updated);
  }));

  app.put('/api/team/:id/active', requireAdmin, h(async (req, res) => {
    const updated = await db.setTeamMemberActive(req.params.id, !!req.body.active);
    if (!updated) return void res.status(404).json({ message: 'Membre non trouvé' });
    res.json(updated);
  }));

  app.delete('/api/team/:id', requireAdmin, h(async (req, res) => {
    await db.deleteTeamMember(req.params.id);
    res.json({ success: true });
  }));

  // Dépenses / Factures d'achat — réservé à l'admin
  app.get('/api/expenses', requireAdmin, h(async (req, res) => {
    res.json(await db.listExpenses());
  }));

  app.post('/api/expenses', requireAdmin, h(async (req, res) => {
    const { title, amount } = req.body;
    if (!title || !amount) return void res.status(400).json({ message: 'Titre et montant requis' });
    const expense = await db.createExpense(req.body);
    res.status(201).json(expense);
  }));

  app.delete('/api/expenses/:id', requireAdmin, h(async (req, res) => {
    await db.deleteExpense(req.params.id);
    res.json({ success: true });
  }));

  // Settings
  app.get('/api/settings', h(async (req, res) => {
    res.json(await db.getSettings());
  }));

  app.put('/api/settings', requireAdmin, h(async (req, res) => {
    const settings = await db.updateSettings(req.body);
    res.json({ success: true, settings });
  }));

  // Products
  app.get('/api/products', h(async (req, res) => {
    const { category, search, promo, featured } = req.query;
    const list = await db.listProducts({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      promo: promo === 'true',
      featured: featured === 'true'
    });
    res.json(list);
  }));

  app.get('/api/products/:idOrSlug', h(async (req, res) => {
    const prod = await db.getProductByIdOrSlug(req.params.idOrSlug);
    if (!prod) return void res.status(404).json({ message: 'Produit non trouvé' });
    res.json(prod);
  }));

  app.post('/api/products', requireAdmin, h(async (req, res) => {
    const newProduct = await db.createProduct(req.body);
    res.status(201).json(newProduct);
  }));

  app.put('/api/products/:id', requireAdmin, h(async (req, res) => {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) return void res.status(404).json({ message: 'Produit non trouvé' });
    res.json(updated);
  }));

  app.delete('/api/products/:id', requireAdmin, h(async (req, res) => {
    await db.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Produit supprimé' });
  }));

  // Categories
  app.get('/api/categories', h(async (req, res) => {
    res.json(await db.listCategories());
  }));

  app.post('/api/categories', requireAdmin, h(async (req, res) => {
    const newCat = await db.createCategory(req.body);
    res.status(201).json(newCat);
  }));

  app.put('/api/categories/:id', requireAdmin, h(async (req, res) => {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) return void res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(updated);
  }));

  app.delete('/api/categories/:id', requireAdmin, h(async (req, res) => {
    await db.deleteCategory(req.params.id);
    res.json({ success: true });
  }));

  // Wilayas
  app.get('/api/wilayas', h(async (req, res) => {
    res.json(await db.listWilayas());
  }));

  app.put('/api/wilayas/:code', requireAdmin, h(async (req, res) => {
    const updated = await db.updateWilaya(req.params.code, req.body);
    if (!updated) return void res.status(404).json({ message: 'Wilaya non trouvée' });
    res.json(updated);
  }));

  // Orders
  app.get('/api/orders', requireStaffOrAdmin, h(async (req, res) => {
    res.json(await db.listOrders());
  }));

  // Volontairement public : utilisé par la page de confirmation de commande et la facture
  // juste après l'achat (le client n'est pas connecté).
  app.get('/api/orders/:id', h(async (req, res) => {
    const order = await db.getOrderByIdOrNumber(req.params.id);
    if (!order) return void res.status(404).json({ message: 'Commande non trouvée' });
    res.json(order);
  }));

  app.post('/api/orders/track', h(async (req, res) => {
    const { orderNumber, phone } = req.body;
    if (!phone) {
      return void res.status(400).json({ message: 'Veuillez saisir votre numéro de téléphone' });
    }
    if (!orderNumber) {
      // Suivi simplifié : juste le téléphone, renvoie toutes les commandes du client.
      const orders = await db.trackOrdersByPhone(phone);
      if (!orders.length) return void res.status(404).json({ message: 'Aucune commande trouvée pour ce numéro' });
      return void res.json(orders);
    }
    const order = await db.trackOrder(orderNumber, phone);
    if (!order) return void res.status(404).json({ message: 'Aucune commande trouvée pour ces informations' });
    res.json(order);
  }));

  app.post('/api/orders', h(async (req, res) => {
    const { customerName, customerPhone, wilayaCode, wilayaName, commune, address, deliveryType, items, notes } = req.body;
    if (!items || !items.length || !customerName || !customerPhone || !wilayaCode) {
      return void res.status(400).json({ message: 'Données de commande incomplètes' });
    }
    const order = await db.createOrder({ customerName, customerPhone, wilayaCode, wilayaName, commune, address, deliveryType, items, notes });
    res.status(201).json(order);
  }));

  app.put('/api/orders/:id/status', requireStaffOrAdmin, h(async (req, res) => {
    const actor = (req as any).actor as { role: 'admin' | 'staff'; name: string };
    // Le staff signe automatiquement avec son nom ; l'admin peut préciser un nom (dropdown équipe) ou laisser vide.
    const handledByName = actor.role === 'staff' ? actor.name : (req.body.handledByName || undefined);
    const updated = await db.updateOrderStatus(req.params.id, req.body.status, handledByName);
    if (!updated) return void res.status(404).json({ message: 'Commande non trouvée' });
    res.json(updated);
  }));

  // Stock Movements
  app.get('/api/stock-movements', requireAdmin, h(async (req, res) => {
    res.json(await db.listStockMovements());
  }));

  app.post('/api/stock-movements', requireAdmin, h(async (req, res) => {
    const { productId, quantityChange, reason, adminName } = req.body;
    const result = await db.recordManualStockMovement(productId, quantityChange, reason || 'Correction', adminName || 'Admin');
    if (!result) return void res.status(404).json({ message: 'Produit non trouvé' });
    res.status(201).json(result);
  }));

  // Reviews
  app.get('/api/reviews', h(async (req, res) => {
    const { productId, approvedOnly } = req.query;
    res.json(await db.listReviews({
      productId: typeof productId === 'string' ? productId : undefined,
      approvedOnly: approvedOnly === 'true'
    }));
  }));

  app.post('/api/reviews', h(async (req, res) => {
    const { productId, customerName, customerWilaya, rating, comment } = req.body;
    const review = await db.createReview({ productId, customerName, customerWilaya, rating, comment });
    res.status(201).json(review);
  }));

  app.put('/api/reviews/:id/approve', requireAdmin, h(async (req, res) => {
    const updated = await db.approveReview(req.params.id, !!req.body.approved);
    if (!updated) return void res.status(404).json({ message: 'Avis non trouvé' });
    res.json(updated);
  }));

  app.delete('/api/reviews/:id', requireAdmin, h(async (req, res) => {
    await db.deleteReview(req.params.id);
    res.json({ success: true });
  }));

  // Image Upload — envoie vers Supabase Storage (bucket "products"), réservé à l'admin.
  const ALLOWED_EXT: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif'
  };
  const ALLOWED_BUCKETS = new Set(['products', 'invoices']);
  app.post('/api/upload', requireAdmin, h(async (req, res) => {
    const { imageBase64, filename, bucket } = req.body;
    if (!imageBase64) return void res.status(400).json({ message: 'Image base64 requise' });

    const targetBucket = ALLOWED_BUCKETS.has(bucket) ? bucket : 'products';

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = filename && filename.includes('.') ? ('.' + filename.split('.').pop()!.toLowerCase()) : '.jpg';
    if (!ALLOWED_EXT[ext]) ext = '.jpg';
    const cleanName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

    const sb = getSupabaseAdmin();
    const { error } = await sb.storage.from(targetBucket).upload(cleanName, buffer, {
      contentType: ALLOWED_EXT[ext],
      upsert: false
    });
    if (error) {
      console.error('Erreur upload Supabase Storage:', error);
      return void res.status(500).json({ message: "Échec de l'upload d'image" });
    }

    const { data: publicUrlData } = sb.storage.from(targetBucket).getPublicUrl(cleanName);
    res.json({ success: true, url: publicUrlData.publicUrl });
  }));

  // Customers
  app.get('/api/customers', requireAdmin, h(async (req, res) => {
    res.json(await db.listCustomers());
  }));

  // Dynamic Sitemap XML
  app.get('/sitemap.xml', h(async (req, res) => {
    const baseUrl = process.env.APP_URL || 'https://elegancehair.dz';
    const [categories, products] = await Promise.all([db.listCategories(), db.listProducts({})]);
    const urls = [
      '', '/boutique', '/suivi-commande', '/contact',
      ...categories.map(c => `/boutique?category=${c.slug}`),
      ...products.map(p => `/produit/${p.slug}`)
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${baseUrl}${u}</loc><changefreq>daily</changefreq></url>`).join('\n')}\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  }));

  // Dynamic Robots.txt
  app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${(process.env.APP_URL || 'https://elegancehair.dz')}/sitemap.xml`);
  });

  return app;
}
