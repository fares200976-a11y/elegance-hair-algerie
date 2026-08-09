import React from 'react';
import { ShoppingBag, Star, Zap, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product: rawProduct,
  onSelectProduct,
  onQuickBuy
}) => {
  const { addToCart } = useCart();
  const { translateProduct, t, isAr } = useLanguage();

  const product = translateProduct(rawProduct);

  const calculateDiscount = () => {
    if (product.oldPrice && product.oldPrice > product.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(rawProduct)}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 ltr:left-3 ltr:right-auto rtl:right-3 rtl:left-auto">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-neutral-900 text-amber-300 rounded-md shadow-xs tracking-wider">
              {t('newBadge')}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold bg-rose-600 text-white rounded-md shadow-xs tracking-wider">
              -{discount}%
            </span>
          )}
          {product.stock <= (product.minStock || 5) && product.stock > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-neutral-950 rounded-md shadow-xs">
              {t('lowStockBadge')} ({product.stock})
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold bg-neutral-800 text-neutral-300 rounded-md">
              {t('outOfStockBadge')}
            </span>
          )}
        </div>

        {/* Hover Quick Action Layer */}
        <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(rawProduct);
            }}
            className="p-3 bg-white text-neutral-900 rounded-full shadow-lg hover:bg-amber-400 hover:text-neutral-950 transition-transform active:scale-95"
            title={t('quickBuy')}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-neutral-50/50">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-amber-700 tracking-wide uppercase">{product.brand}</span>
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-1 rtl:mr-0 rtl:ml-1" />
              4.9
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(rawProduct)}
            className="font-semibold text-neutral-900 text-sm sm:text-base line-clamp-2 hover:text-amber-700 transition-colors cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight">
                {product.price.toLocaleString('fr-FR')} <span className="text-xs font-bold text-amber-700">{t('priceDa')}</span>
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  {product.oldPrice.toLocaleString('fr-FR')} {t('priceDa')}
                </span>
              )}
            </div>
          </div>

          {/* Buttons Group */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              disabled={product.stock === 0}
              onClick={() => addToCart(rawProduct)}
              className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              title={t('addToCart')}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('cartBtn')}</span>
            </button>

            <button
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(rawProduct);
                if (onQuickBuy) onQuickBuy(rawProduct);
              }}
              className="px-3 py-2.5 bg-neutral-900 hover:bg-amber-600 text-amber-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs disabled:opacity-50"
              title={t('quickBuy')}
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{t('buyBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

