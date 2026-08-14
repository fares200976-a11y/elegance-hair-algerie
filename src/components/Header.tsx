import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Phone, ShieldCheck, Truck, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategorySlug?: string;
  setSelectedCategorySlug: (slug?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  setSelectedCategorySlug,
  searchQuery,
  setSearchQuery,
  onOpenCart
}) => {
  const { totalItemsCount } = useCart();
  const { settings } = useShop();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navItems = [
    { label: t('home'), tab: 'home' },
    { label: t('shop'), tab: 'shop' },
    { label: t('hairDryers'), categorySlug: 'seche-cheveux' },
    { label: t('straighteners'), categorySlug: 'lisseurs' },
    { label: t('hotBrushes'), categorySlug: 'brosses-chauffantes' },
    { label: t('curlers'), categorySlug: 'boucleurs' },
    { label: t('multiStylers'), categorySlug: 'multistylers' },
    { label: t('professional'), categorySlug: 'appareils-professionnels' },
    { label: t('suitcases'), categorySlug: 'valises' },
    { label: t('handbags'), categorySlug: 'sacs-a-main' },
    { label: t('backpacks'), categorySlug: 'sacs-a-dos' },
    { label: t('promotions'), categorySlug: 'promotions' },
    { label: t('tracking'), tab: 'tracking' },
    { label: t('contact'), tab: 'contact' }
  ];

  const handleNavClick = (item: { label: string; tab?: string; categorySlug?: string }) => {
    if (item.categorySlug) {
      setSelectedCategorySlug(item.categorySlug);
      setActiveTab('shop');
    } else if (item.tab) {
      setSelectedCategorySlug(undefined);
      setActiveTab(item.tab);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-amber-100/60 font-sans">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-amber-100 py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Truck className="w-3.5 h-3.5" /> {t('topBannerDelivery')}
            </span>
            <span className="hidden sm:inline-block text-neutral-400">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {t('topBannerCod')}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-300">
            <a
              href={`https://wa.me/${settings.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" /> WhatsApp : {settings.phone.split('/')[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick({ label: t('home'), tab: 'home' })}
              className="flex items-center gap-2 group text-left ltr:text-left rtl:text-right"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
                  É
                </div>
              </div>
              <div>
                <span className="font-serif font-extrabold text-xl tracking-wider text-neutral-900 block leading-none">
                  ÉLÉGANCE <span className="text-amber-600 font-sans text-xs uppercase tracking-widest block font-bold mt-0.5">HAIR ALGÉRIE</span>
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className={`transition-colors py-2 relative hover:text-amber-600 ${
                  (item.tab === activeTab && !item.categorySlug) ||
                  (item.categorySlug && activeTab === 'shop')
                    ? 'text-amber-700 font-semibold'
                    : 'text-neutral-700'
                }`}
              >
                {item.label}
                {item.categorySlug === 'promotions' && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-rose-600 text-white rounded-full font-bold animate-pulse">
                    %
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-900 rounded-full text-xs font-bold transition-all border border-neutral-200/80 shadow-2xs"
              title={language === 'fr' ? 'Changer en Arabe' : 'تغيير إلى الفرنسية'}
              id="btn-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span className="uppercase">{language === 'fr' ? 'العربية 🇩🇿' : 'FR 🇫🇷'}</span>
            </button>

            {/* Search Input Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-300 focus-within:border-amber-500 w-44 sm:w-60 transition-all">
                  <Search className="w-4 h-4 text-neutral-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== 'shop') setActiveTab('shop');
                    }}
                    className="bg-transparent text-sm w-full outline-none text-neutral-800"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-neutral-400 hover:text-neutral-600 ml-1 rtl:ml-0 rtl:mr-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearchInput(true);
                    setActiveTab('shop');
                  }}
                  className="p-2 text-neutral-700 hover:text-amber-600 rounded-full hover:bg-neutral-100 transition-colors"
                  title="Rechercher"
                  id="btn-header-search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-neutral-900 text-amber-200 rounded-full hover:bg-neutral-800 transition-transform active:scale-95 shadow-sm"
              title={t('cart')}
              id="btn-header-cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-amber-600 focus:outline-none"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <div className="mb-4 pt-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveTab('shop');
              }}
              className="w-full bg-neutral-100 px-4 py-2.5 rounded-lg text-sm outline-none border border-neutral-200 focus:border-amber-500"
            />
            <button
              onClick={toggleLanguage}
              className="px-3 py-2.5 bg-neutral-900 text-amber-300 font-bold text-xs rounded-lg whitespace-nowrap shrink-0"
            >
              {language === 'fr' ? 'العربية' : 'FR'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 text-base font-medium">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className="text-left rtl:text-right px-3 py-2.5 rounded-md hover:bg-amber-50 hover:text-amber-700 text-neutral-800 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.categorySlug === 'promotions' && (
                  <span className="px-2 py-0.5 text-xs bg-rose-600 text-white rounded-full font-bold">
                    PROMO
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
