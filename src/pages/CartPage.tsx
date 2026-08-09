import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartPageProps {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onContinueShopping,
  onProceedToCheckout
}) => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { t, translateProduct, isAr } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-extrabold text-neutral-900">
          {t('cartEmptyTitle')}
        </h2>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          {t('cartEmptySub')}
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-neutral-900 text-amber-200 font-bold text-sm rounded-2xl hover:bg-neutral-800 transition-colors shadow-md"
        >
          {t('discoverShop')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
          {t('cartPageTitle')} ({items.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('emptyCart')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(item => {
            const translatedProduct = translateProduct(item.product);
            return (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.images[0]}
                    alt={translatedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl border border-neutral-200 shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 uppercase">{translatedProduct.brand}</span>
                    <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2">{translatedProduct.name}</h3>
                    <span className="text-xs text-neutral-500 font-mono">{isAr ? 'سعر الوحدة:' : 'Prix unitaire:'} {item.product.price.toLocaleString('fr-FR')} {t('priceDa')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-base font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs text-neutral-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-base font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right rtl:text-left">
                    <span className="font-extrabold text-neutral-950 text-base block">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR')} {t('priceDa')}
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                    title={isAr ? 'حذف' : 'Supprimer'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t('continueShopping')}</span>
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs h-fit space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            {t('orderSummary')}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>{t('subtotalItems')}</span>
              <span className="font-bold text-neutral-900">{subtotal.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>{t('deliveryFee')}</span>
              <span className="text-xs text-amber-700 font-semibold">{t('calculatedAtCheckout')}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>{t('paymentMethod')}</span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                {t('paymentCodBadge')}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-bold text-neutral-900 text-base">{t('estimatedTotal')}</span>
              <span className="text-2xl font-extrabold text-neutral-950">
                {subtotal.toLocaleString('fr-FR')} <span className="text-xs font-bold text-amber-700">{t('priceDa')}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full py-4 bg-neutral-900 hover:bg-amber-600 text-amber-200 hover:text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            id="btn-checkout-from-cart"
          >
            <span>{t('proceedToCheckout')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <div className="space-y-2 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('safeOrderNoCard')}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('parcelInspection')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

