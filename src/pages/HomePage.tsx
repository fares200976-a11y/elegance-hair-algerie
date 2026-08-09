import React from 'react';
import { ArrowRight, Sparkles, Star, ChevronRight, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { BannerDelivery } from '../components/BannerDelivery';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategorySlug: (slug?: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  setSelectedCategorySlug,
  onSelectProduct,
  onQuickBuy
}) => {
  const { products, categories, reviews } = useShop();
  const { t, translateCategory, isAr } = useLanguage();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16 font-sans bg-neutral-50/30">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-800/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left ltr:lg:text-left rtl:lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {isAr ? 'أحدث أجهزة تصفيف الشعر الاحترافية بين يديك' : 'Révélez votre beauté avec les '}
                {!isAr && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                    meilleurs appareils
                  </span>
                )}
                {!isAr && ' de coiffure'}
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategorySlug(undefined);
                    setActiveTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-bold rounded-2xl hover:from-amber-300 hover:to-amber-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg flex items-center justify-center gap-2 text-base"
                >
                  <span>{t('discoverShop')}</span>
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => handleCategorySelect('promotions')}
                  className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold rounded-2xl border border-amber-500/40 transition-colors flex items-center justify-center gap-2 text-base"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t('viewPromos')}</span>
                </button>
              </div>

              {/* Quick Perks */}
              <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">{t('wilayas58Home')}</span>
                  <span className="text-xs text-neutral-400">{t('homeDelivery')}</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">{isAr ? 'الدفع عند الاستلام' : 'Paiement C.O.D'}</span>
                  <span className="text-xs text-neutral-400">{t('codAtReceipt')}</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">{t('guaranteedEq')}</span>
                  <span className="text-xs text-neutral-400">{t('officialEquip')}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
                <img
                  src="/src/assets/images/hero_banner_1786185867399.jpg"
                  alt="Appareils de coiffure professionnels Algérie"
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider block">{t('featuredProductBadge')}</span>
                      <h4 className="font-bold text-sm sm:text-base text-white">{isAr ? 'مصفف شعر متعدد الاستخدامات 5 في 1' : 'Multistyler 5-en-1 Complete Set'}</h4>
                    </div>
                    <span className="px-3 py-1 bg-amber-500 text-neutral-950 font-black text-xs rounded-full">
                      18 500 {t('priceDa')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <BannerDelivery />

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">{t('ourRanges')}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
              {t('exploreByCat')}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(undefined);
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>{t('viewAllCategories')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.slice(0, 6).map(rawCat => {
            const cat = translateCategory(rawCat);
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 aspect-16/10 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold text-amber-400 block mb-1">
                    {cat.productCount || 3} {isAr ? 'منتجات متوفرة' : 'produits disponibles'}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-xl text-white group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5 hidden sm:block opacity-90">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED / BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">{isAr ? 'الأكثر طلباً' : 'Incontournables'}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
              {t('bestSellersTab')}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(undefined);
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>{t('viewAllShop')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-amber-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider inline-block">
                {isAr ? 'عرض خاص محدود' : 'Offre Spéciale Limitée'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
                {isAr ? 'استفيدي من تخفيضات تصل حتى -40% على أجهزة المملكة والمصففات!' : 'Profitez jusqu\'à -40% de réduction sur la gamme Lisseurs & Multistylers !'}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl">
                {isAr ? 'جميع أجهزة تصفيف الشعر تأتي مع الضمان الرسمي ومعاينة المحتوى عند التسليم قبل الدفع.' : 'Tous nos fers à lisser professionnels et kits multistylers sont livrés avec leur garantie officielle et vérification du contenu du colis à la livraison.'}
              </p>
              <button
                onClick={() => handleCategorySelect('promotions')}
                className="mt-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>{t('viewPromos')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-400/40 overflow-hidden shadow-2xl">
                <img
                  src="/src/assets/images/multistyler_5in1_1786185902351.jpg"
                  alt="Multistyler Promo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">{t('newTab')}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
              {isAr ? 'أحدث المنتجات التي وصلتنا' : 'Derniers Arrivages'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS TESTIMONIALS */}
      <section className="bg-white py-16 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">{t('verifiedReviews')}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
              {t('customerReviewsTitle')}
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              {isAr ? 'أكثر من 5000 طلب تم تسليمه بنجاح في الجزائر، وهران، قسنطينة، سطيف، عنابة وجميع الولايات.' : 'Plus de 5 000 commandes livrées avec succès à Alger, Oran, Constantine, Sétif, Annaba et dans le grand Sud.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(rev => (
              <div key={rev.id} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {isAr ? 'شراء مؤكد' : 'Achat Vérifié'}
                  </span>
                </div>

                <p className="text-sm text-neutral-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">{rev.customerName}</span>
                  <span className="text-neutral-500 font-medium">{rev.customerWilaya}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

