import { Product, Category, Order, Wilaya, Review, StockMovement, ShopSettings, TeamMember, Expense } from '../types';

const API_BASE = '/api';

// Ajoute le token JWT (admin en priorité, sinon staff) sur les requêtes qui en ont besoin.
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('elegance_admin_token') || localStorage.getItem('elegance_staff_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProducts(params?: { category?: string; search?: string; promo?: boolean; featured?: boolean }): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.promo) query.append('promo', 'true');
    if (params?.featured) query.append('featured', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Échec récupération produits');
    return await res.json();
  } catch (err) {
    console.error('API fetchProducts error:', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('API fetchProductBySlug error:', err);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Échec récupération catégories');
    return await res.json();
  } catch (err) {
    console.error('API fetchCategories error:', err);
    return [];
  }
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(category)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erreur création catégorie');
  }
  return await res.json();
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Erreur modification catégorie');
  return await res.json();
}

export async function deleteCategory(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}

export async function fetchWilayas(): Promise<Wilaya[]> {
  try {
    const res = await fetch(`${API_BASE}/wilayas`);
    if (!res.ok) throw new Error('Échec récupération wilayas');
    return await res.json();
  } catch (err) {
    console.error('API fetchWilayas error:', err);
    return [];
  }
}

export async function fetchSettings(): Promise<ShopSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Échec récupération paramètres');
    return await res.json();
  } catch (err) {
    console.error('API fetchSettings error:', err);
    throw err;
  }
}

export async function updateSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  return data.settings;
}

export async function createOrder(orderData: any): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur lors de la création de la commande');
  }
  return await res.json();
}

export async function trackOrder(orderNumber: string, phone: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, phone })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Commande introuvable');
  }
  return await res.json();
}

// Suivi simplifié : juste le numéro de téléphone, renvoie toutes les commandes du client.
export async function trackOrdersByPhone(phone: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Aucune commande trouvée pour ce numéro');
  }
  return await res.json();
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
  return await res.json();
}

export async function updateOrderStatus(orderId: string, status: string, handledByName?: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status, handledByName })
  });
  return await res.json();
}

export async function uploadProductImage(imageBase64: string, filename?: string, bucket?: 'products' | 'invoices'): Promise<string> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ imageBase64, filename, bucket })
  });
  if (!res.ok) throw new Error('Erreur upload image');
  const data = await res.json();
  return data.url;
}

export async function uploadImages(base64List: string[]): Promise<string[]> {
  const urls: string[] = [];
  for (const b64 of base64List) {
    const url = await uploadProductImage(b64);
    urls.push(url);
  }
  return urls;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Erreur création produit');
  return await res.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Erreur modification produit');
  return await res.json();
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  if (product.id) {
    return updateProduct(product.id, product);
  } else {
    return createProduct(product);
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/products/${productId}`, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}

export async function updateStock(productId: string, quantityChange: number, reason: string): Promise<{ newStock: number }> {
  const res = await fetch(`${API_BASE}/stock-movements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, quantityChange, reason, adminName: 'Admin' })
  });
  if (!res.ok) throw new Error('Erreur mise à jour stock');
  return await res.json();
}

export async function fetchStockMovements(): Promise<StockMovement[]> {
  const res = await fetch(`${API_BASE}/stock-movements`, { headers: authHeaders() });
  return await res.json();
}

export async function fetchReviews(productId?: string): Promise<Review[]> {
  const url = productId ? `${API_BASE}/reviews?productId=${productId}` : `${API_BASE}/reviews`;
  const res = await fetch(url);
  return await res.json();
}

export async function submitReview(review: { productId: string; customerName: string; customerWilaya?: string; rating: number; comment: string }): Promise<Review> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  return await res.json();
}

export async function fetchCustomers(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/customers`, { headers: authHeaders() });
  return await res.json();
}

// --- ÉQUIPE ---
export async function staffLogin(code: string): Promise<{ success: boolean; token?: string; name?: string; message?: string }> {
  const res = await fetch(`${API_BASE}/team/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  const data = await res.json();
  if (!res.ok || !data.success) return { success: false, message: data.message || 'Code invalide' };
  return { success: true, token: data.token, name: data.user?.name };
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE}/team`, { headers: authHeaders() });
  return await res.json();
}

export async function createTeamMember(input: { name: string; phone?: string; whatsapp?: string; email?: string }): Promise<TeamMember> {
  const res = await fetch(`${API_BASE}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("Erreur création membre d'équipe");
  return await res.json();
}

export async function updateTeamMember(id: string, input: Partial<TeamMember>): Promise<TeamMember> {
  const res = await fetch(`${API_BASE}/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Erreur mise à jour du membre');
  return await res.json();
}

// Signal léger utilisé par l'alarme sonore (polling fréquent, réponse minimale).
export async function fetchLatestOrderSignal(): Promise<{ count: number; latestId: string | null; latestCreatedAt: string | null }> {
  const res = await fetch(`${API_BASE}/orders/latest-signal`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Erreur signal commandes');
  return await res.json();
}

export async function regenerateTeamMemberCode(id: string): Promise<TeamMember> {
  const res = await fetch(`${API_BASE}/team/${id}/regenerate`, { method: 'PUT', headers: authHeaders() });
  if (!res.ok) throw new Error('Erreur régénération du code');
  return await res.json();
}

export async function setTeamMemberActive(id: string, active: boolean): Promise<TeamMember> {
  const res = await fetch(`${API_BASE}/team/${id}/active`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ active })
  });
  if (!res.ok) throw new Error('Erreur mise à jour du membre');
  return await res.json();
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}

// --- DÉPENSES / FACTURES D'ACHAT ---
export async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch(`${API_BASE}/expenses`, { headers: authHeaders() });
  return await res.json();
}

export async function createExpense(expense: Partial<Expense>): Promise<Expense> {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(expense)
  });
  if (!res.ok) throw new Error('Erreur création dépense');
  return await res.json();
}

export async function deleteExpense(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}
