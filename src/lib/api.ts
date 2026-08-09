import { Product, Category, Order, Wilaya, Review, StockMovement, ShopSettings } from '../types';

const API_BASE = '/api';

// Ajoute le token JWT admin (stocké au login) sur les requêtes qui en ont besoin.
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('elegance_admin_token');
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

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
  return await res.json();
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status })
  });
  return await res.json();
}

export async function uploadProductImage(imageBase64: string, filename?: string): Promise<string> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ imageBase64, filename })
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
