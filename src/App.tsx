import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ContactPage } from './pages/ContactPage';
import { PrintInvoicePage } from './pages/PrintInvoicePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminTeam } from './pages/AdminTeam';
import { AdminExpenses } from './pages/AdminExpenses';
import { StaffLoginPage } from './pages/StaffLoginPage';

import { Product, Order } from './types';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store, Check, X, Users, Receipt } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toastMessage, clearToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-slideUp font-sans">
      <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <span className="text-sm font-semibold">{toastMessage}</span>
      <button
        onClick={clearToast}
        className="ml-2 text-neutral-400 hover:text-white"
        title="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Wrapper for Product Detail Page
const ProductDetailRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading } = useShop();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.slug === slug || p.id === slug);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center font-bold text-neutral-600">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">Produit non trouvé</h2>
        <p className="text-neutral-600">Le produit demandé est introuvable ou n'existe plus.</p>
        <button
          onClick={() => navigate('/boutique')}
          className="px-6 py-2.5 bg-neutral-900 text-amber-300 font-bold text-sm rounded-xl"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onBack={() => navigate('/boutique')}
      onQuickCheckout={() => {
        addToCart(product, 1);
        navigate('/commander');
      }}
    />
  );
};

// Wrapper for Shop Page synced with URL search params
const ShopRoute: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}> = ({ searchQuery, setSearchQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categorySlug = searchParams.get('category') || undefined;

  const handleSetCategorySlug = (slug?: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <ShopPage
      selectedCategorySlug={categorySlug}
      setSelectedCategorySlug={handleSetCategorySlug}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSelectProduct={p => navigate(`/produit/${p.slug}`)}
      onQuickBuy={p => {
        addToCart(p, 1);
        navigate('/commander');
      }}
    />
  );
};

// Wrapper for Order Confirmation Page
const OrderConfirmationRoute: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  React.useEffect(() => {
    if (!order && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) setOrder(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Erreur chargement commande:', err);
          setIsLoading(false);
        });
    }
  }, [orderId, order]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center font-bold text-neutral-600">Chargement des détails de la commande...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">Commande Introuvable</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-neutral-900 text-amber-300 font-bold text-sm rounded-xl"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <OrderConfirmationPage
      order={order}
      onTrackOrder={(orderNum, phone) =>
        navigate(`/suivi-commande?orderNumber=${encodeURIComponent(orderNum)}&phone=${encodeURIComponent(phone)}`)
      }
      onContinueShopping={() => navigate('/boutique')}
      onPrintInvoice={id => navigate(`/facture/${id}`)}
    />
  );
};

// Wrapper for Order Tracking Page
const OrderTrackingRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderNum = searchParams.get('orderNumber') || '';
  const phone = searchParams.get('phone') || '';

  return (
    <OrderTrackingPage
      initialOrderNumber={orderNum}
      initialPhone={phone}
      onPrintInvoice={id => navigate(`/facture/${id}`)}
    />
  );
};

// Wrapper for Print Invoice Page
const PrintInvoiceRoute: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  if (!orderId) return null;

  return <PrintInvoicePage orderId={orderId} onBack={() => navigate(-1)} />;
};

// Admin Section Component
const AdminLayout: React.FC = () => {
  const { isAdminAuthenticated, logoutAdmin } = useAuth();
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'team' | 'expenses'>('dashboard');
  const navigate = useNavigate();

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans pb-16">
      {/* Admin Top Header */}
      <header className="bg-neutral-900 text-white border-b border-amber-500/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-serif font-bold">
                É
              </div>
              <div>
                <span className="font-serif font-bold text-base text-white block leading-none">
                  ÉLÉGANCE HAIR
                </span>
                <span className="text-amber-400 text-[10px] uppercase font-sans font-semibold tracking-wider">
                  Espace Administration
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  adminTab === 'dashboard'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </button>

              <button
                onClick={() => setAdminTab('products')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  adminTab === 'products'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Produits</span>
              </button>

              <button
                onClick={() => setAdminTab('orders')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  adminTab === 'orders'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Commandes</span>
              </button>

              <button
                onClick={() => setAdminTab('team')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  adminTab === 'team'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Équipe</span>
              </button>

              <button
                onClick={() => setAdminTab('expenses')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  adminTab === 'expenses'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Dépenses</span>
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                title="Voir le site client"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Boutique</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-rose-500/30"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'orders' && (
          <AdminOrders onPrintInvoice={orderId => navigate(`/facture/${orderId}`)} />
        )}
        {adminTab === 'team' && <AdminTeam />}
        {adminTab === 'expenses' && <AdminExpenses />}
      </main>
    </div>
  );
};

// Espace Équipe (staff) — accès limité aux commandes uniquement, via code.
const StaffLayout: React.FC = () => {
  const { isStaffAuthenticated, staffName, logoutStaff } = useAuth();
  const navigate = useNavigate();

  if (!isStaffAuthenticated) {
    return <StaffLoginPage />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans pb-16">
      <header className="bg-neutral-900 text-white border-b border-amber-500/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-serif font-bold">
                É
              </div>
              <div>
                <span className="font-serif font-bold text-base text-white block leading-none">
                  ÉLÉGANCE HAIR
                </span>
                <span className="text-amber-400 text-[10px] uppercase font-sans font-semibold tracking-wider">
                  Espace Équipe — {staffName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                title="Voir le site client"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Boutique</span>
              </button>

              <button
                onClick={logoutStaff}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-rose-500/30"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AdminOrders onPrintInvoice={orderId => navigate(`/facture/${orderId}`)} />
      </main>
    </div>
  );
};

// Main App Layout Wrapper
const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  // Determine active tab from URL path for Header navigation highlights
  const pathname = location.pathname;
  let activeTab = 'home';
  if (pathname.startsWith('/boutique')) activeTab = 'shop';
  else if (pathname.startsWith('/produit')) activeTab = 'shop';
  else if (pathname.startsWith('/panier')) activeTab = 'cart';
  else if (pathname.startsWith('/commander')) activeTab = 'checkout';
  else if (pathname.startsWith('/suivi-commande')) activeTab = 'tracking';
  else if (pathname.startsWith('/contact')) activeTab = 'contact';
  else if (pathname.startsWith('/admin')) activeTab = 'admin';

  const handleHeaderNavTab = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        navigate('/boutique');
        break;
      case 'tracking':
        navigate('/suivi-commande');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'cart':
        navigate('/panier');
        break;
      default:
        navigate('/');
    }
  };

  const handleHeaderCategorySelect = (slug?: string) => {
    if (slug) {
      navigate(`/boutique?category=${slug}`);
    } else {
      navigate('/boutique');
    }
  };

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/staff');
  const isInvoiceRoute = pathname.startsWith('/facture');

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {!isAdminRoute && !isInvoiceRoute && (
        <Header
          activeTab={activeTab}
          setActiveTab={handleHeaderNavTab}
          setSelectedCategorySlug={handleHeaderCategorySelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCart={() => navigate('/panier')}
        />
      )}

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setActiveTab={handleHeaderNavTab}
                setSelectedCategorySlug={handleHeaderCategorySelect}
                onSelectProduct={p => navigate(`/produit/${p.slug}`)}
                onQuickBuy={p => {
                  addToCart(p, 1);
                  navigate('/commander');
                }}
              />
            }
          />
          <Route
            path="/boutique"
            element={<ShopRoute searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          />
          <Route path="/produit/:slug" element={<ProductDetailRoute />} />
          <Route
            path="/panier"
            element={
              <CartPage
                onContinueShopping={() => navigate('/boutique')}
                onProceedToCheckout={() => navigate('/commander')}
              />
            }
          />
          <Route
            path="/commander"
            element={
              <CheckoutPage
                onBackToCart={() => navigate('/panier')}
                onOrderSuccess={order =>
                  navigate(`/commande-confirmee/${order.id}`, { state: { order } })
                }
              />
            }
          />
          <Route path="/commande-confirmee/:orderId" element={<OrderConfirmationRoute />} />
          <Route path="/suivi-commande" element={<OrderTrackingRoute />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/facture/:orderId" element={<PrintInvoiceRoute />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/staff/*" element={<StaffLayout />} />
        </Routes>
      </div>

      {!isAdminRoute && !isInvoiceRoute && (
        <>
          <Footer
            setActiveTab={handleHeaderNavTab}
            setSelectedCategorySlug={handleHeaderCategorySelect}
          />
          <WhatsAppButton />
        </>
      )}

      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ShopProvider>
        <CartProvider>
          <AuthProvider>
            <Router>
              <MainContent />
            </Router>
          </AuthProvider>
        </CartProvider>
      </ShopProvider>
    </LanguageProvider>
  );
}
