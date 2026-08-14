import { Product, Category, Order, OrderItem, Wilaya, Review, StockMovement, ShopSettings, TeamMember, Expense } from '../../src/types';

// --- CATEGORIES ---
export function categoryFromDb(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image || '',
    productCount: row.productCount
  };
}
export function categoryToDb(c: Partial<Category>): Record<string, any> {
  const row: Record<string, any> = {};
  if (c.name !== undefined) row.name = c.name;
  if (c.slug !== undefined) row.slug = c.slug;
  if (c.description !== undefined) row.description = c.description;
  if (c.image !== undefined) row.image = c.image;
  return row;
}

// --- PRODUCTS ---
export function productFromDb(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.category_id,
    brand: row.brand,
    skuRef: row.sku_ref,
    shortDesc: row.short_desc || '',
    fullDesc: row.full_desc || '',
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    isPromo: !!row.is_promo,
    stock: row.stock,
    minStock: row.min_stock,
    warranty: row.warranty,
    power: row.power || undefined,
    color: row.color || undefined,
    temperature: row.temperature || undefined,
    speed: row.speed || undefined,
    techSpecs: row.tech_specs || [],
    boxContent: row.box_content || [],
    images: row.images || [],
    isFeatured: !!row.is_featured,
    isNew: !!row.is_new,
    status: row.status,
    createdAt: row.created_at
  };
}
export function productToDb(p: Partial<Product>): Record<string, any> {
  const row: Record<string, any> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.categoryId !== undefined) row.category_id = p.categoryId;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.skuRef !== undefined) row.sku_ref = p.skuRef;
  if (p.shortDesc !== undefined) row.short_desc = p.shortDesc;
  if (p.fullDesc !== undefined) row.full_desc = p.fullDesc;
  if (p.price !== undefined) row.price = p.price;
  if (p.oldPrice !== undefined) row.old_price = p.oldPrice;
  if (p.isPromo !== undefined) row.is_promo = p.isPromo;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.minStock !== undefined) row.min_stock = p.minStock;
  if (p.warranty !== undefined) row.warranty = p.warranty;
  if (p.power !== undefined) row.power = p.power;
  if (p.color !== undefined) row.color = p.color;
  if (p.temperature !== undefined) row.temperature = p.temperature;
  if (p.speed !== undefined) row.speed = p.speed;
  if (p.techSpecs !== undefined) row.tech_specs = p.techSpecs;
  if (p.boxContent !== undefined) row.box_content = p.boxContent;
  if (p.images !== undefined) row.images = p.images;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.isNew !== undefined) row.is_new = p.isNew;
  if (p.status !== undefined) row.status = p.status;
  return row;
}

// --- WILAYAS ---
export function wilayaFromDb(row: any): Wilaya {
  return {
    code: row.code,
    name: row.name,
    nameAr: row.name_ar || undefined,
    homePrice: Number(row.home_price),
    agencyPrice: Number(row.agency_price),
    active: !!row.active
  };
}
export function wilayaToDb(w: Partial<Wilaya>): Record<string, any> {
  const row: Record<string, any> = {};
  if (w.name !== undefined) row.name = w.name;
  if (w.nameAr !== undefined) row.name_ar = w.nameAr;
  if (w.homePrice !== undefined) row.home_price = w.homePrice;
  if (w.agencyPrice !== undefined) row.agency_price = w.agencyPrice;
  if (w.active !== undefined) row.active = w.active;
  return row;
}

// --- ORDERS ---
export function orderFromDb(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    wilayaCode: row.wilaya_code,
    wilayaName: row.wilaya_name,
    commune: row.commune,
    address: row.address,
    deliveryType: row.delivery_type,
    deliveryFee: Number(row.delivery_fee),
    subtotal: Number(row.subtotal),
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method,
    status: row.status,
    notes: row.notes || undefined,
    items: (row.items || []) as OrderItem[],
    handledByName: row.handled_by_name || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// --- REVIEWS ---
export function reviewFromDb(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    customerName: row.customer_name,
    customerWilaya: row.customer_wilaya || undefined,
    rating: row.rating,
    comment: row.comment || '',
    approved: !!row.approved,
    createdAt: row.created_at
  };
}

// --- STOCK MOVEMENTS ---
export function stockMovementFromDb(row: any): StockMovement {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantityChange: row.quantity_change,
    newStock: row.new_stock,
    reason: row.reason,
    adminName: row.admin_name,
    createdAt: row.created_at
  };
}

// --- SETTINGS ---
export function settingsFromDb(row: any): ShopSettings {
  return {
    storeName: row.store_name,
    tagline: row.tagline || '',
    logoUrl: row.logo_url || undefined,
    phone: row.phone || '',
    whatsappPhone: row.whatsapp_phone || '',
    email: row.email || '',
    address: row.address || '',
    wilaya: row.wilaya || '',
    facebookUrl: row.facebook_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    tiktokUrl: row.tiktok_url || undefined,
    defaultHomeShippingFee: Number(row.default_home_shipping_fee),
    defaultAgencyShippingFee: Number(row.default_agency_shipping_fee),
    freeShippingMinAmount: Number(row.free_shipping_min_amount),
    termsAndConditions: row.terms_and_conditions || '',
    privacyPolicy: row.privacy_policy || ''
  };
}
export function settingsToDb(s: Partial<ShopSettings>): Record<string, any> {
  const row: Record<string, any> = {};
  if (s.storeName !== undefined) row.store_name = s.storeName;
  if (s.tagline !== undefined) row.tagline = s.tagline;
  if (s.logoUrl !== undefined) row.logo_url = s.logoUrl;
  if (s.phone !== undefined) row.phone = s.phone;
  if (s.whatsappPhone !== undefined) row.whatsapp_phone = s.whatsappPhone;
  if (s.email !== undefined) row.email = s.email;
  if (s.address !== undefined) row.address = s.address;
  if (s.wilaya !== undefined) row.wilaya = s.wilaya;
  if (s.facebookUrl !== undefined) row.facebook_url = s.facebookUrl;
  if (s.instagramUrl !== undefined) row.instagram_url = s.instagramUrl;
  if (s.tiktokUrl !== undefined) row.tiktok_url = s.tiktokUrl;
  if (s.defaultHomeShippingFee !== undefined) row.default_home_shipping_fee = s.defaultHomeShippingFee;
  if (s.defaultAgencyShippingFee !== undefined) row.default_agency_shipping_fee = s.defaultAgencyShippingFee;
  if (s.freeShippingMinAmount !== undefined) row.free_shipping_min_amount = s.freeShippingMinAmount;
  if (s.termsAndConditions !== undefined) row.terms_and_conditions = s.termsAndConditions;
  if (s.privacyPolicy !== undefined) row.privacy_policy = s.privacyPolicy;
  return row;
}

// --- ÉQUIPE ---
export function teamMemberFromDb(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    active: !!row.active,
    phone: row.phone || undefined,
    whatsapp: row.whatsapp || undefined,
    email: row.email || undefined,
    createdAt: row.created_at
  };
}
export function teamMemberToDb(m: Partial<TeamMember>): Record<string, any> {
  const row: Record<string, any> = {};
  if (m.name !== undefined) row.name = m.name;
  if (m.phone !== undefined) row.phone = m.phone;
  if (m.whatsapp !== undefined) row.whatsapp = m.whatsapp;
  if (m.email !== undefined) row.email = m.email;
  return row;
}

// --- DÉPENSES ---
export function expenseFromDb(row: any): Expense {
  return {
    id: row.id,
    title: row.title,
    supplier: row.supplier || undefined,
    amount: Number(row.amount),
    category: row.category || 'Autre',
    invoiceUrl: row.invoice_url || undefined,
    notes: row.notes || undefined,
    expenseDate: row.expense_date,
    createdAt: row.created_at
  };
}
export function expenseToDb(e: Partial<Expense>): Record<string, any> {
  const row: Record<string, any> = {};
  if (e.title !== undefined) row.title = e.title;
  if (e.supplier !== undefined) row.supplier = e.supplier;
  if (e.amount !== undefined) row.amount = e.amount;
  if (e.category !== undefined) row.category = e.category;
  if (e.invoiceUrl !== undefined) row.invoice_url = e.invoiceUrl;
  if (e.notes !== undefined) row.notes = e.notes;
  if (e.expenseDate !== undefined) row.expense_date = e.expenseDate;
  return row;
}
