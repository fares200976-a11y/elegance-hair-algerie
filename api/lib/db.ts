import { getSupabaseAdmin } from './supabaseAdmin.js';
import {
  categoryFromDb, categoryToDb,
  productFromDb, productToDb,
  wilayaFromDb, wilayaToDb,
  orderFromDb,
  reviewFromDb,
  stockMovementFromDb,
  settingsFromDb, settingsToDb,
  teamMemberFromDb,
  expenseFromDb, expenseToDb
} from './mappers.js';
import { Product, Category, Order, Wilaya, Review, StockMovement, ShopSettings, Customer, TeamMember, Expense } from '../../src/types';

// --- CATEGORIES ---
export async function listCategories(): Promise<Category[]> {
  const sb = getSupabaseAdmin();
  const { data: cats, error } = await sb.from('categories').select('*').order('created_at');
  if (error) throw error;

  const { data: products, error: prodErr } = await sb.from('products').select('id, category_id, is_promo');
  if (prodErr) throw prodErr;

  return (cats || []).map(c => {
    const count = (products || []).filter(p => p.category_id === c.id || (c.slug === 'promotions' && p.is_promo)).length;
    return { ...categoryFromDb(c), productCount: count };
  });
}

export async function createCategory(input: Partial<Category>): Promise<Category> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('categories').insert(categoryToDb(input)).select().single();
  if (error) throw error;
  return categoryFromDb(data);
}

export async function updateCategory(id: string, input: Partial<Category>): Promise<Category | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('categories').update(categoryToDb(input)).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return categoryFromDb(data);
}

export async function deleteCategory(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// --- PRODUCTS ---
export async function listProducts(params: { category?: string; search?: string; promo?: boolean; featured?: boolean }): Promise<Product[]> {
  const sb = getSupabaseAdmin();
  let query = sb.from('products').select('*, categories(slug)');

  if (params.promo) query = query.eq('is_promo', true);
  if (params.featured) query = query.eq('is_featured', true);
  if (params.search) {
    const q = params.search;
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,sku_ref.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let list = (data || []).map(productFromDb);

  // category peut être un id (uuid) ou un slug — filtré côté app pour éviter une 2e requête
  if (params.category) {
    const rowsBySlug = new Map((data || []).map((r: any) => [r.id, r.categories?.slug]));
    list = list.filter(p => p.categoryId === params.category || rowsBySlug.get(p.id) === params.category);
  }

  return list;
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('products').select('*').or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).maybeSingle();
  if (error) throw error;
  return data ? productFromDb(data) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  if (ids.length === 0) return new Map();
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('products').select('*').in('id', ids);
  if (error) throw error;
  return new Map((data || []).map(row => [row.id, productFromDb(row)]));
}

export async function createProduct(input: Partial<Product>): Promise<Product> {
  const sb = getSupabaseAdmin();
  const row = productToDb({
    status: 'active',
    isNew: true,
    minStock: 5,
    techSpecs: [],
    boxContent: [],
    images: [],
    ...input
  });
  const { data, error } = await sb.from('products').insert(row).select().single();
  if (error) throw error;
  return productFromDb(data);
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('products').update(productToDb(input)).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return productFromDb(data);
}

export async function adjustProductStock(id: string, delta: number): Promise<Product | null> {
  const sb = getSupabaseAdmin();
  const current = await getProductByIdOrSlug(id);
  if (!current) return null;
  const newStock = Math.max(0, current.stock + delta);
  const { data, error } = await sb.from('products').update({ stock: newStock }).eq('id', id).select().single();
  if (error) throw error;
  return productFromDb(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) throw error;
}

// --- WILAYAS ---
export async function listWilayas(): Promise<Wilaya[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('wilayas').select('*').order('code');
  if (error) throw error;
  return (data || []).map(wilayaFromDb);
}

export async function getWilaya(code: string): Promise<Wilaya | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('wilayas').select('*').eq('code', code).maybeSingle();
  if (error) throw error;
  return data ? wilayaFromDb(data) : null;
}

export async function updateWilaya(code: string, input: Partial<Wilaya>): Promise<Wilaya | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('wilayas').update(wilayaToDb(input)).eq('code', code).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return wilayaFromDb(data);
}

// --- ORDERS ---
export async function listOrders(): Promise<Order[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(orderFromDb);
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('orders').select('*').or(`id.eq.${idOrNumber},order_number.eq.${idOrNumber}`).maybeSingle();
  if (error) throw error;
  return data ? orderFromDb(data) : null;
}

export async function trackOrder(orderNumber: string, phone: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  const cleanNum = orderNumber.trim().toUpperCase();
  const cleanPhoneSuffix = phone.trim().replace(/\s+/g, '').slice(-8);

  const { data, error } = await sb.from('orders').select('*').ilike('order_number', cleanNum);
  if (error) throw error;

  const match = (data || []).find(o => o.customer_phone.replace(/\s+/g, '').endsWith(cleanPhoneSuffix));
  return match ? orderFromDb(match) : null;
}

// Suivi client par numéro de téléphone seul : renvoie toutes les commandes liées à ce numéro.
export async function trackOrdersByPhone(phone: string): Promise<Order[]> {
  const sb = getSupabaseAdmin();
  const cleanPhoneSuffix = phone.trim().replace(/\s+/g, '').slice(-8);
  if (cleanPhoneSuffix.length < 8) return [];

  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;

  return (data || [])
    .filter(o => o.customer_phone.replace(/\s+/g, '').endsWith(cleanPhoneSuffix))
    .map(orderFromDb);
}

export async function createOrder(input: {
  customerName: string;
  customerPhone: string;
  wilayaCode: string;
  wilayaName?: string;
  commune: string;
  address: string;
  deliveryType?: 'domicile' | 'agence';
  items: { productId: string; quantity: number; productName?: string; productImage?: string; brand?: string; unitPrice?: number }[];
  notes?: string;
}): Promise<Order> {
  const sb = getSupabaseAdmin();

  const { count, error: countErr } = await sb.from('orders').select('id', { count: 'exact', head: true });
  if (countErr) throw countErr;
  const orderNumber = `CMD-2026-${String((count || 0) + 1).padStart(6, '0')}`;

  const wilaya = await getWilaya(input.wilayaCode);
  const deliveryType = input.deliveryType || 'domicile';
  const deliveryFee = deliveryType === 'agence' ? (wilaya?.agencyPrice ?? 300) : (wilaya?.homePrice ?? 500);

  const productIds = input.items.map(i => i.productId);
  const productsById = await getProductsByIds(productIds);

  let subtotal = 0;
  const validatedItems = input.items.map(item => {
    const prod = productsById.get(item.productId);
    const unitPrice = prod ? prod.price : (item.unitPrice || 0);
    const total = unitPrice * item.quantity;
    subtotal += total;
    return {
      productId: item.productId,
      productName: prod ? prod.name : (item.productName || ''),
      productImage: prod?.images?.[0] || item.productImage || '',
      brand: prod?.brand || item.brand || 'Élégance',
      unitPrice,
      quantity: item.quantity,
      totalPrice: total
    };
  });

  const { data, error } = await sb.from('orders').insert({
    order_number: orderNumber,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    wilaya_code: input.wilayaCode,
    wilaya_name: wilaya ? wilaya.name : input.wilayaName,
    commune: input.commune,
    address: input.address,
    delivery_type: deliveryType,
    delivery_fee: deliveryFee,
    subtotal,
    total_amount: subtotal + deliveryFee,
    payment_method: 'Paiement à la livraison',
    status: 'Nouvelle',
    notes: input.notes,
    items: validatedItems
  }).select().single();
  if (error) throw error;

  // Déduction du stock + journal des mouvements (best-effort, après création de la commande)
  for (const item of input.items) {
    const prod = productsById.get(item.productId);
    if (!prod) continue;
    const updated = await adjustProductStock(prod.id, -item.quantity);
    if (updated) {
      await createStockMovement({
        productId: prod.id,
        productName: prod.name,
        quantityChange: -item.quantity,
        newStock: updated.stock,
        reason: 'Vente',
        adminName: 'Système Commande'
      });
    }
  }

  return orderFromDb(data);
}

export async function updateOrderStatus(id: string, status: string, handledByName?: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  const update: Record<string, any> = { status, updated_at: new Date().toISOString() };
  if (handledByName) update.handled_by_name = handledByName;
  const { data, error } = await sb.from('orders')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return orderFromDb(data);
}

// --- STOCK MOVEMENTS ---
export async function listStockMovements(): Promise<StockMovement[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('stock_movements').select('*, products(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => stockMovementFromDb({ ...row, product_name: row.products?.name || row.product_name }));
}

export async function createStockMovement(input: {
  productId: string;
  productName?: string;
  quantityChange: number;
  newStock: number;
  reason: string;
  adminName?: string;
}): Promise<StockMovement> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('stock_movements').insert({
    product_id: input.productId,
    quantity_change: input.quantityChange,
    new_stock: input.newStock,
    reason: input.reason,
    admin_name: input.adminName || 'Admin'
  }).select().single();
  if (error) throw error;
  return stockMovementFromDb({ ...data, product_name: input.productName });
}

export async function recordManualStockMovement(productId: string, quantityChange: number, reason: string, adminName?: string): Promise<{ movement: StockMovement; newStock: number } | null> {
  const product = await getProductByIdOrSlug(productId);
  if (!product) return null;
  const updated = await adjustProductStock(productId, quantityChange);
  if (!updated) return null;
  const movement = await createStockMovement({
    productId,
    productName: product.name,
    quantityChange,
    newStock: updated.stock,
    reason,
    adminName
  });
  return { movement, newStock: updated.stock };
}

// --- REVIEWS ---
export async function listReviews(params: { productId?: string; approvedOnly?: boolean }): Promise<Review[]> {
  const sb = getSupabaseAdmin();
  let query = sb.from('reviews').select('*, products(name)').order('created_at', { ascending: false });
  if (params.productId) query = query.eq('product_id', params.productId);
  if (params.approvedOnly) query = query.eq('approved', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row: any) => reviewFromDb({ ...row, product_name: row.products?.name }));
}

export async function createReview(input: { productId: string; customerName: string; customerWilaya?: string; rating: number; comment: string }): Promise<Review> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('reviews').insert({
    product_id: input.productId,
    customer_name: input.customerName,
    customer_wilaya: input.customerWilaya || 'Algérie',
    rating: Number(input.rating) || 5,
    comment: input.comment,
    approved: false // Modération requise avant publication
  }).select().single();
  if (error) throw error;
  return reviewFromDb(data);
}

export async function approveReview(id: string, approved: boolean): Promise<Review | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('reviews').update({ approved }).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return reviewFromDb(data);
}

export async function deleteReview(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

// --- SETTINGS ---
export async function getSettings(): Promise<ShopSettings> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return settingsFromDb(data);
}

export async function updateSettings(input: Partial<ShopSettings>): Promise<ShopSettings> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('settings').update(settingsToDb(input)).eq('id', 1).select().single();
  if (error) throw error;
  return settingsFromDb(data);
}

// --- CUSTOMERS (agrégés depuis les commandes) ---
export async function listCustomers(): Promise<Customer[]> {
  const orders = await listOrders();
  const map = new Map<string, Customer>();

  for (const order of orders) {
    const key = order.customerPhone.trim();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        id: 'cust-' + Buffer.from(key).toString('base64').slice(0, 8),
        name: order.customerName,
        phone: order.customerPhone,
        wilayaCode: order.wilayaCode,
        wilayaName: order.wilayaName,
        ordersCount: 1,
        totalSpent: order.totalAmount,
        lastOrderDate: order.createdAt
      });
    } else {
      existing.ordersCount += 1;
      existing.totalSpent += order.totalAmount;
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
      }
    }
  }

  return Array.from(map.values());
}

// --- ÉQUIPE ---
function generateTeamCode(): string {
  // Code numérique simple à 6 chiffres, facile à communiquer par téléphone.
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('team_members').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(teamMemberFromDb);
}

export async function createTeamMember(name: string): Promise<TeamMember> {
  const sb = getSupabaseAdmin();
  let code = generateTeamCode();
  // Évite (rarement) une collision de code.
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await sb.from('team_members').select('id').eq('code', code).maybeSingle();
    if (!existing) break;
    code = generateTeamCode();
  }
  const { data, error } = await sb.from('team_members').insert({ name, code, active: true }).select().single();
  if (error) throw error;
  return teamMemberFromDb(data);
}

export async function regenerateTeamMemberCode(id: string): Promise<TeamMember | null> {
  const sb = getSupabaseAdmin();
  const code = generateTeamCode();
  const { data, error } = await sb.from('team_members').update({ code }).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return teamMemberFromDb(data);
}

export async function setTeamMemberActive(id: string, active: boolean): Promise<TeamMember | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('team_members').update({ active }).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return teamMemberFromDb(data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('team_members').delete().eq('id', id);
  if (error) throw error;
}

// Vérifie un code d'accès équipe et renvoie le membre s'il est actif.
export async function verifyTeamCode(code: string): Promise<TeamMember | null> {
  const sb = getSupabaseAdmin();
  const cleanCode = code.trim();
  const { data, error } = await sb.from('team_members').select('*').eq('code', cleanCode).eq('active', true).maybeSingle();
  if (error) throw error;
  return data ? teamMemberFromDb(data) : null;
}

// --- DÉPENSES / FACTURES D'ACHAT ---
export async function listExpenses(): Promise<Expense[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('expenses').select('*').order('expense_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(expenseFromDb);
}

export async function createExpense(input: Partial<Expense>): Promise<Expense> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('expenses').insert(expenseToDb(input)).select().single();
  if (error) throw error;
  return expenseFromDb(data);
}

export async function deleteExpense(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('expenses').delete().eq('id', id);
  if (error) throw error;
}
