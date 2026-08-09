import React, { useState } from 'react';
import { Truck, CheckCircle2, ArrowLeft, Send, Building2, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import { createOrder } from '../lib/api';
import { Order, DeliveryType } from '../types';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCart,
  onOrderSuccess
}) => {
  const { items, subtotal, clearCart } = useCart();
  const { wilayas } = useShop();
  const { t, translateProduct, isAr } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16'); // Default 16 - Alger
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicile');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedWilaya = wilayas.find(w => w.code === selectedWilayaCode) || wilayas[15];

  const deliveryFee = deliveryType === 'agence' ? selectedWilaya.agencyPrice : selectedWilaya.homePrice;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address || !commune) {
      setErrorMsg(t('fillRequiredFields'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        wilayaCode: selectedWilaya.code,
        wilayaName: selectedWilaya.name,
        commune,
        address,
        deliveryType,
        deliveryFee,
        subtotal,
        totalAmount,
        notes,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          brand: item.product.brand,
          unitPrice: item.product.price,
          quantity: item.quantity
        }))
      };

      const newOrder = await createOrder(orderPayload);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Erreur checkout:', err);
      setErrorMsg(err.message || (isAr ? 'حدث خطأ عند تأكيد طلبك. يرجى المحاولة مرة أخرى.' : 'Erreur lors de la validation de votre commande. Veuillez réessayer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={onBackToCart}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-amber-700 bg-white px-3.5 py-2 rounded-xl border border-neutral-200"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('backToCart')}</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-neutral-900">
          {t('checkoutTitle')}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-100 text-rose-900 font-bold rounded-2xl text-sm border border-rose-200">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping Address Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>{t('shippingDetails')}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('fullName')} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder={isAr ? 'مثال: سارة عمراني' : 'Ex: Sarah Amrani'}
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('phoneNumber')} <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Ex: 0550 12 34 56 ou 0770 98 76 54"
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                {t('phoneNotice')}
              </span>
            </div>

            {/* 58 Wilayas Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  {t('wilaya')} <span className="text-rose-600">*</span>
                </label>
                <select
                  value={selectedWilayaCode}
                  onChange={e => setSelectedWilayaCode(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white font-medium"
                >
                  {wilayas.map(w => (
                    <option key={w.code} value={w.code}>
                      {isAr ? (w.nameAr || w.name) : w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  {t('commune')} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  placeholder={isAr ? 'مثال: باب الزوار، السانية...' : 'Ex: Bab Ezzouar, Es Senia...'}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('fullAddress')} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={isAr ? 'مثال: حي 1000 مسكن، عمارة ب، رقم 12' : 'Ex: Cité 1000 Logements, Bâtiment B, N° 12'}
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* Mode de Livraison */}
            <div className="pt-2">
              <label className="text-xs font-bold text-neutral-800 block mb-2">
                {t('deliveryTypeFor')} {isAr ? (selectedWilaya.nameAr || selectedWilaya.name) : selectedWilaya.name} :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryType('domicile')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    deliveryType === 'domicile'
                      ? 'border-amber-500 bg-amber-50/60 font-bold'
                      : 'border-neutral-200 bg-neutral-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Home className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="block font-bold text-neutral-900">{t('homeDelivery')}</span>
                      <span className="text-neutral-500 text-[11px]">{t('homeDeliverySub')}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800">
                    {selectedWilaya.homePrice} {t('priceDa')}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryType('agence')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    deliveryType === 'agence'
                      ? 'border-amber-500 bg-amber-50/60 font-bold'
                      : 'border-neutral-200 bg-neutral-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="block font-bold text-neutral-900">{t('agencyDelivery')}</span>
                      <span className="text-neutral-500 text-[11px]">{t('agencyDeliverySub')}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800">
                    {selectedWilaya.agencyPrice} {t('priceDa')}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('notesOptional')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={isAr ? 'أوقات التواجد، معلم قريب...' : 'Heure de disponibilité, repère particulier...'}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Confirmation */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 h-fit">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            {t('orderSummaryTitle')}
          </h2>

          {/* Cart Products List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(item => {
              const translatedProduct = translateProduct(item.product);
              return (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={translatedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                    />
                    <div>
                      <h4 className="font-semibold text-neutral-900 line-clamp-1">{translatedProduct.name}</h4>
                      <span className="text-neutral-500">
                        x{item.quantity} ({item.product.price.toLocaleString('fr-FR')} {t('priceDa')})
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-neutral-900">
                    {(item.product.price * item.quantity).toLocaleString('fr-FR')} {t('priceDa')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Fee Calculation */}
          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between text-neutral-600">
              <span>{t('subtotalItems')}</span>
              <span className="font-bold text-neutral-900">{subtotal.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>{t('deliveryFeeWithWilaya')} ({isAr ? (selectedWilaya.nameAr || selectedWilaya.name) : selectedWilaya.name})</span>
              <span className="font-bold text-neutral-900">{deliveryFee.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-bold text-neutral-900 text-base">{t('totalToPay')}</span>
              <span className="text-2xl font-extrabold text-neutral-950">
                {totalAmount.toLocaleString('fr-FR')} <span className="text-xs font-bold text-amber-700">{t('priceDa')}</span>
              </span>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('paymentCodTitle')}</span>
            </div>
            <p className="text-neutral-700 leading-snug">
              {t('paymentCodDesc')}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-base rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            id="btn-confirm-order"
          >
            {isSubmitting ? (
              <span>{t('submittingOrder')}</span>
            ) : (
              <>
                <span>{t('confirmOrderBtn')}</span>
                <Send className="w-5 h-5 rtl:rotate-180" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-neutral-400">
            {t('trackingNotice')}
          </p>
        </div>
      </form>
    </div>
  );
};

