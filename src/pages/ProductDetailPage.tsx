import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, ShieldCheck, Check, Star, Truck, ArrowLeft, MessageSquare, Box, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { submitReview } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onQuickCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: rawProduct,
  onBack,
  onQuickCheckout
}) => {
  const { addToCart } = useCart();
  const { settings, reviews } = useShop();
  const { t, translateProduct, isAr } = useLanguage();

  const product = translateProduct(rawProduct);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLightboxOpen]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'box' | 'reviews'>('desc');

  // Review Form state
  const [revName, setRevName] = useState('');
  const [revWilaya, setRevWilaya] = useState('16 - Alger');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSubmitted, setRevSubmitted] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
  ];

  const productReviews = reviews.filter(r => r.productId === product.id && r.approved);

  const calculateDiscount = () => {
    if (product.oldPrice && product.oldPrice > product.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return 0;
  };

  const handleWhatsAppOrder = () => {
    const total = product.price * quantity;
    const msg = isAr
      ? `مرحباً، أريد طلب هذا المنتج:\n\n📦 المنتج: ${product.name}\n🏷️ المرجع: ${product.skuRef}\n🔢 الكمية: ${quantity}\n💰 السعر: ${product.price.toLocaleString('fr-FR')} ${t('priceDa')}\n💵 الإجمالي: ${total.toLocaleString('fr-FR')} ${t('priceDa')}\n\nيرجى التواصل معي لإتمام الطلب والدفع عند الاستلام.`
      : `Bonjour Élégance Hair Algérie,\nJe souhaite commander :\n\n📦 Produit : ${product.name}\n🏷️ Référence : ${product.skuRef}\n🔢 Quantité : ${quantity}\n💰 Prix unitaire : ${product.price.toLocaleString('fr-FR')} DA\n💵 Total produit : ${total.toLocaleString('fr-FR')} DA\n\nMerci de me contacter pour la livraison à domicile avec paiement à la réception.`;
    const cleanPhone = settings.whatsappPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) return;

    try {
      await submitReview({
        productId: product.id,
        customerName: revName,
        customerWilaya: revWilaya,
        rating: revRating,
        comment: revComment
      });
      setRevSubmitted(true);
      setRevName('');
      setRevComment('');
    } catch (err) {
      console.error('Erreur submission avis:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-amber-700 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-xs hover:shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{t('backToCatalog')}</span>
      </button>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-sm">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 relative group cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-3 right-3 ltr:right-3 ltr:left-auto rtl:left-3 rtl:right-auto w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-neutral-800" />
            </div>
            {product.isNew && (
              <span className="absolute top-4 left-4 ltr:left-4 ltr:right-auto rtl:right-4 rtl:left-auto px-3 py-1 bg-neutral-900 text-amber-300 font-extrabold text-xs rounded-lg uppercase tracking-wider">
                {t('newBadge')}
              </span>
            )}
            {calculateDiscount() > 0 && (
              <span className="absolute top-4 right-4 ltr:right-4 ltr:left-auto rtl:left-4 rtl:right-auto px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-lg shadow-md">
                -{calculateDiscount()}%
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Buying Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-amber-700 tracking-wider uppercase bg-amber-100/70 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-neutral-400 font-mono">{isAr ? 'مرجع:' : 'Réf:'} {product.skuRef}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3 text-sm">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="font-bold text-neutral-800">4.9 / 5</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500">{productReviews.length + 12} {isAr ? 'تقييمات مؤكدة في الجزائر' : 'avis vérifiés en Algérie'}</span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-neutral-500 block">{isAr ? 'السعر النهائي:' : 'Prix TTC :'}</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-neutral-950 tracking-tight">
                  {product.price.toLocaleString('fr-FR')} <span className="text-base font-bold text-amber-700">{t('priceDa')}</span>
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {product.oldPrice.toLocaleString('fr-FR')} {t('priceDa')}
                  </span>
                )}
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {t('inStock')} ({product.stock})
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-neutral-800">{t('quantity')}:</span>
            <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-lg font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 font-bold text-sm text-neutral-900 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="px-3.5 py-2 text-lg font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(rawProduct, quantity)}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 border border-neutral-300 shadow-xs"
                id="btn-add-cart-detail"
              >
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                <span>{t('addToCart')}</span>
              </button>

              <button
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(rawProduct, quantity);
                  onQuickCheckout();
                }}
                className="w-full py-4 bg-neutral-950 hover:bg-amber-600 text-amber-200 hover:text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg"
                id="btn-buy-now-detail"
              >
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{t('buyNow')}</span>
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
              id="btn-whatsapp-detail"
            >
              <MessageSquare className="w-5 h-5 fill-white/20" />
              <span>{t('orderWhatsApp')}</span>
            </button>
          </div>

          {/* Delivery & Warranty Card Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200/80 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-neutral-800">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <strong className="block">{t('delivery58Wilayas')}</strong>
                <span className="text-neutral-500">{t('codAtReceipt')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-neutral-800">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <strong className="block">{t('guaranteedEq')}</strong>
                <span className="text-neutral-500">{product.warranty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICAL TABS SECTION */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'desc'
                ? 'bg-neutral-900 text-amber-300'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t('productDescription')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'specs'
                ? 'bg-neutral-900 text-amber-300'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t('productSpecs')}
          </button>
          <button
            onClick={() => setActiveTab('box')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'box'
                ? 'bg-neutral-900 text-amber-300'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t('productBoxContent')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'reviews'
                ? 'bg-neutral-900 text-amber-300'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t('customerReviews')} ({productReviews.length + 3})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'desc' && (
          <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
            <p>{product.fullDesc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {product.power && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">{isAr ? 'القوة الكهربائية:' : 'Puissance :'}</span>
                  <strong className="text-neutral-900">{product.power}</strong>
                </div>
              )}
              {product.temperature && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">{isAr ? 'الحرارة القصوى:' : 'Température :'}</span>
                  <strong className="text-neutral-900">{product.temperature}</strong>
                </div>
              )}
              {product.color && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">{isAr ? 'اللون:' : 'Finition / Couleur :'}</span>
                  <strong className="text-neutral-900">{product.color}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">{isAr ? 'المواصفات التقنية التفصيلية:' : 'Spécifications détaillées :'}</h4>
            <ul className="space-y-2">
              {product.techSpecs?.map((spec, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'box' && (
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">{isAr ? 'محتويات العلبة عند الاستلام:' : 'Inclus dans votre colis :'}</h4>
            <ul className="space-y-2">
              {product.boxContent?.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <Box className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productReviews.map(rev => (
                <div key={rev.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-sm">{rev.customerName}</span>
                    <span className="text-xs text-neutral-500">{rev.customerWilaya}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="font-bold text-neutral-900 text-base mb-4">{isAr ? 'إضافة تقييم جديد' : 'Laisser un avis client'}</h3>

              {revSubmitted ? (
                <div className="p-4 bg-emerald-100 text-emerald-900 font-bold rounded-2xl text-sm">
                  {isAr ? 'شكراً لك! تم تسجيل تقييمك بنجاح.' : 'Merci ! Votre avis a bien été pris en compte.'}
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">{t('formFullName')}</label>
                      <input
                        type="text"
                        required
                        value={revName}
                        onChange={e => setRevName(e.target.value)}
                        placeholder={isAr ? 'مثال: أمينة' : 'Ex: Amina B.'}
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">{t('formWilaya')}</label>
                      <input
                        type="text"
                        value={revWilaya}
                        onChange={e => setRevWilaya(e.target.value)}
                        placeholder="Ex: 16 - Alger"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">{isAr ? 'التقييم' : 'Note / Évaluation'}</label>
                    <select
                      value={revRating}
                      onChange={e => setRevRating(Number(e.target.value))}
                      className="p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5) {isAr ? 'ممتاز جداً' : 'Excellent'}</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5) {isAr ? 'جيد جداً' : 'Très bon'}</option>
                      <option value={3}>⭐⭐⭐ (3/5) {isAr ? 'متوسط' : 'Moyen'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">{isAr ? 'تعليقك' : 'Votre Commentaire'}</label>
                    <textarea
                      required
                      rows={3}
                      value={revComment}
                      onChange={e => setRevComment(e.target.value)}
                      placeholder={isAr ? 'أكتبي انطباعك عن الجهاز...' : 'Partagez votre avis sur l\'appareil...'}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-900 text-amber-200 font-bold text-xs rounded-xl hover:bg-neutral-800"
                  >
                    {isAr ? 'نشر التقييم' : 'Publier mon avis'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visionneuse plein écran avec zoom tactile (pincer sur mobile, double-clic sur ordinateur) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          {/* Barre du haut */}
          <div className="flex items-center justify-between p-4 shrink-0">
            <span className="text-white/70 text-xs font-semibold">
              {activeImageIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => { setIsLightboxOpen(false); setIsZoomedIn(false); }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zone image : pincer pour zoomer nativement (mobile), double-clic pour zoomer (ordinateur) */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center"
            style={{ touchAction: 'pinch-zoom' }}
            onDoubleClick={() => setIsZoomedIn(z => !z)}
          >
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`transition-transform duration-300 ${isZoomedIn ? 'scale-[2] cursor-zoom-out' : 'max-w-full max-h-full cursor-zoom-in'} object-contain`}
              onClick={() => setIsZoomedIn(z => !z)}
            />
          </div>

          {/* Navigation précédent/suivant */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => { setActiveImageIndex(i => (i - 1 + images.length) % images.length); setIsZoomedIn(false); }}
                className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
              </button>
              <button
                onClick={() => { setActiveImageIndex(i => (i + 1) % images.length); setIsZoomedIn(false); }}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6 rtl:rotate-180" />
              </button>

              {/* Vignettes du bas */}
              <div className="flex items-center justify-center gap-2 p-4 shrink-0 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveImageIndex(idx); setIsZoomedIn(false); }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 ${
                      activeImageIndex === idx ? 'border-amber-500' : 'border-white/20 opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};