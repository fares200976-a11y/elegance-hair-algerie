export type OrderStatus =
  | 'Nouvelle'
  | 'À confirmer'
  | 'Confirmée'
  | 'En préparation'
  | 'Expédiée'
  | 'En livraison'
  | 'Livrée'
  | 'Annulée';

export type DeliveryType = 'domicile' | 'agence';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  skuRef: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  oldPrice?: number;
  isPromo: boolean;
  stock: number;
  minStock: number;
  warranty: string;
  power?: string;
  color?: string;
  temperature?: string;
  speed?: string;
  techSpecs: string[];
  boxContent: string[];
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  status: 'active' | 'draft';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., CMD-2026-000001
  customerName: string;
  customerPhone: string;
  wilayaCode: string;
  wilayaName: string;
  commune: string;
  address: string;
  deliveryType: DeliveryType;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: 'Paiement à la livraison';
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  handledByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wilaya {
  code: string; // 01 to 58
  name: string; // e.g., 16 - Alger
  nameAr?: string;
  homePrice: number;
  agencyPrice: number;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  wilayaCode: string;
  wilayaName: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerWilaya?: string;
  rating: number; // 1 to 5
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  quantityChange: number; // + or -
  newStock: number;
  reason: 'Entrée stock' | 'Vente' | 'Retour' | 'Perte/Casse' | 'Correction';
  adminName: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  code: string;
  active: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  supplier?: string;
  amount: number;
  category: string;
  invoiceUrl?: string;
  notes?: string;
  expenseDate: string;
  createdAt: string;
}

export interface ShopSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappPhone: string; // e.g. 213550123456
  email: string;
  address: string;
  wilaya: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  defaultHomeShippingFee: number;
  defaultAgencyShippingFee: number;
  freeShippingMinAmount: number;
  termsAndConditions: string;
  privacyPolicy: string;
}
