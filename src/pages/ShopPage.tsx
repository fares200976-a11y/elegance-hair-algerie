import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShopPageProps {
  selectedCategorySlug?: string;
  setSelectedCategorySlug: (slug?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  selectedCategorySlug,
  setSelectedCategorySlug,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onQuickBuy
}) => {
  const { products, categories } = useShop();
  const { t, translateCategory, isAr } = useLanguage();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Les produits en brouillon (ex: importés par scan de facture, non finalisés) restent invisibles au public.
      if (p.status === 'draft') return false;

      // Category filter
      if (selectedCategorySlug === 'promotions') {
        if (!p.isPromo) return false;
      } else if (selectedCategorySlug === 'bagagerie') {
        // Vue combinée : Valises + Sacs à main + Sacs à dos, en un seul clic.
        const luggageSlugs = ['valises', 'sacs-a-main', 'sacs-a-dos'];
        const catObj = categories.find(c => c.id === p.categoryId);
        if (!catObj || !luggageSlugs.includes(catObj.slug)) return false;
      } else if (selectedCategorySlug && selectedCategorySlug !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCategorySlug);
        if (catObj && p.categoryId !== catObj.id && p.slug !== selectedCategorySlug) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

      // Price filter
      if (p.price > maxPrice) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchRef = p.skuRef.toLowerCase().includes(q);
        const matchDesc = p.shortDesc.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchRef && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, categories, selectedCategorySlug, selectedBrand, maxPrice, searchQuery, sortBy]);

  const rawActiveCat = categories.find(c => c.slug === selectedCategorySlug);
  const activeCategoryObj = rawActiveCat ? translateCategory(rawActiveCat) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Page Header */}
      <div className="mb-8 border-b border-neutral-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900">
              {selectedCategorySlug === 'promotions'
                ? (isAr ? 'التخفيضات والعروض الخاصة' : 'Promotions & Offres Spéciales')
                : selectedCategorySlug === 'bagagerie'
                ? (isAr ? 'حقائب السفر والظهر واليد' : 'Bagagerie : Valises, Sacs à Main & Sacs à Dos')
                : activeCategoryObj
                ? activeCategoryObj.name
                : t('shopCatalogTitle')}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {activeCategoryObj?.description || t('shopCatalogSub')}
            </p>
          </div>

          {/* Search bar inside shop page */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 ltr:left-3.5 ltr:right-auto rtl:right-3.5 rtl:left-auto" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm focus:border-amber-500 outline-none shadow-xs ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 ltr:right-3 ltr:left-auto rtl:left-3 rtl:right-auto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'خيارات التصفية' : 'Filtres de recherche'}</span>
            </h3>
            {(selectedCategorySlug || selectedBrand !== 'all' || maxPrice < 30000 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategorySlug(undefined);
                  setSelectedBrand('all');
                  setMaxPrice(30000);
                  setSearchQuery('');
                }}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                {t('resetFilters')}
              </button>
            )}
          </div>

          {/* Categories Filter List */}
          <div>
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-3">
              {t('filterByCat')}
            </h4>
            <div className="space-y-1 text-sm">
              <button
                onClick={() => setSelectedCategorySlug(undefined)}
                className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  !selectedCategorySlug
                    ? 'bg-amber-100/70 text-amber-900 font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{t('allCategories')}</span>
                <span className="text-xs text-neutral-400 font-mono">{products.length}</span>
              </button>

              {categories.map(rawCat => {
                const cat = translateCategory(rawCat);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-amber-100/70 text-amber-900 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {cat.slug === 'promotions'
                        ? products.filter(p => p.isPromo).length
                        : products.filter(p => p.categoryId === cat.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-3">
              {isAr ? 'العلامة التجارية' : 'Marque'}
            </h4>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none text-neutral-800"
            >
              <option value="all">{isAr ? 'جميع الماركات' : 'Toutes les marques'}</option>
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span>{isAr ? 'السعر الأقصى:' : 'Prix max:'}</span>
              <span className="text-amber-700">{maxPrice.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>3 000 {t('priceDa')}</span>
              <span>30 000 {t('priceDa')}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls Bar (Filter toggle mobile + Sorting) */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold text-neutral-900 bg-neutral-100 px-3.5 py-2 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'التصفية' : 'Filtres'}</span>
            </button>

            <div className="text-xs font-semibold text-neutral-600">
              <strong className="text-neutral-900">{filteredProducts.length}</strong> {isAr ? 'منتج(ات) متوفرة' : 'produit(s) trouvé(s)'}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-neutral-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none text-neutral-800"
              >
                <option value="featured">{t('sortPopular')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="newest">{isAr ? 'وصل حديثاً' : 'Nouveautés d\'abord'}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategorySlug || selectedBrand !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 font-semibold">{isAr ? 'التصفية النشطة:' : 'Filtres actifs:'}</span>
              {selectedCategorySlug && (
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {isAr ? 'الفئة' : 'Catégorie'}: {
                    selectedCategorySlug === 'bagagerie'
                      ? (isAr ? 'حقائب السفر والظهر واليد' : 'Bagagerie')
                      : selectedCategorySlug === 'promotions'
                      ? (isAr ? 'التخفيضات' : 'Promotions')
                      : selectedCategorySlug
                  }
                  <button onClick={() => setSelectedCategorySlug(undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {isAr ? 'الماركة' : 'Marque'}: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {isAr ? 'بحث' : 'Recherche'}: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onQuickBuy={onQuickBuy}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4">
              <Tag className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-900">{t('noProductsFound')}</h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                {isAr ? 'جربي إلغاء خيارات التصفية أو التغيير في كلمة البحث.' : 'Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategorySlug(undefined);
                  setSelectedBrand('all');
                  setMaxPrice(30000);
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-neutral-900 text-amber-200 font-bold text-xs rounded-xl hover:bg-neutral-800"
              >
                {t('resetFilters')}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

