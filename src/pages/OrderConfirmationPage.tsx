import React from 'react';
import { CheckCircle2, Printer, Search, MessageSquare, ArrowRight, ShieldCheck, MapPin, Phone, PackageCheck } from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';

interface OrderConfirmationPageProps {
  order: Order;
  onTrackOrder: (orderNumber: string, phone: string) => void;
  onContinueShopping: () => void;
  onPrintInvoice: (orderId: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
  onPrintInvoice
}) => {
  const { settings } = useShop();
  const { t, isAr } = useLanguage();

  const handleWhatsAppUpdate = () => {
    const text = isAr 
      ? `مرحباً Élégance Hair Algérie، لقد سجلت الطلب رقم ${order.orderNumber} بمبلغ ${order.totalAmount.toLocaleString('fr-FR')} د.ج لولاية: ${order.wilayaName}. هل يمكنك تأكيد موعد الشحن؟ شكراً!`
      : `Bonjour Élégance Hair Algérie, je viens d'enregistrer la commande N° ${order.orderNumber} d'un montant de ${order.totalAmount.toLocaleString('fr-FR')} DA pour la Wilaya : ${order.wilayaName}. Pouvez-vous me confirmer le délai d'expédition ? Merci !`;
    const cleanPhone = settings.whatsappPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase bg-amber-100 px-3 py-1 rounded-full">
            {t('orderNumberPrefix')} {order.orderNumber}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900 mt-3">
            {t('thankYouOrder')}
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto mt-2">
            {t('orderSuccessSub')}
          </p>
        </div>

        {/* Unique Order Code Box */}
        <div className="p-4 bg-neutral-900 text-amber-300 rounded-2xl max-w-md mx-auto font-mono text-center shadow-inner">
          <span className="text-xs text-neutral-400 block font-sans">{t('uniqueTrackingCode')}</span>
          <span className="text-2xl font-black tracking-widest">{order.orderNumber}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onPrintInvoice(order.id)}
            className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors border border-neutral-300"
            id="btn-print-invoice-confirm"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>{t('printInvoice')}</span>
          </button>

          <button
            onClick={() => onTrackOrder(order.orderNumber, order.customerPhone)}
            className="px-5 py-3 bg-neutral-900 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors hover:bg-neutral-800"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>{t('trackOrder')}</span>
          </button>

          <button
            onClick={handleWhatsAppUpdate}
            className="px-5 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('whatsAppSupport')}</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-amber-600" />
          <span>{t('parcelDetailsTitle')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Customer Info */}
          <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
              {t('recipientInfo')}
            </h3>
            <p className="font-bold text-neutral-900 text-base">{order.customerName}</p>
            <p className="flex items-center gap-2 text-neutral-700">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{order.customerPhone}</span>
            </p>
            <p className="flex items-start gap-2 text-neutral-700">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>{order.address}, {order.commune}, <strong>{order.wilayaName}</strong></span>
            </p>
            <p className="text-neutral-500 font-medium">
              {isAr ? 'النوع:' : 'Mode :'} {order.deliveryType === 'agence' ? (isAr ? 'توصيل إلى المكتب / الوكالة' : 'Livraison Bureau / Agence') : (isAr ? 'توصيل إلى المنزل' : 'Livraison à Domicile')}
            </p>
          </div>

          {/* Payment Info */}
          <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
              {t('paymentAndAmount')}
            </h3>
            <div className="flex justify-between text-neutral-600">
              <span>{t('subtotalItems')}:</span>
              <span className="font-bold text-neutral-900">{order.subtotal.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{t('deliveryFee')} ({order.wilayaName}):</span>
              <span className="font-bold text-neutral-900">{order.deliveryFee.toLocaleString('fr-FR')} {t('priceDa')}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-bold text-neutral-900">{t('totalToPayCourier')}:</span>
              <span className="text-xl font-black text-neutral-950">
                {order.totalAmount.toLocaleString('fr-FR')} {t('priceDa')}
              </span>
            </div>
            <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('paymentCodTitle')}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-neutral-900 text-sm">{t('orderedItems')}:</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-neutral-900">{item.productName}</h4>
                    <span className="text-neutral-500">
                      {isAr ? 'الكمية:' : 'Qté:'} {item.quantity} x {item.unitPrice.toLocaleString('fr-FR')} {t('priceDa')}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-neutral-900">
                  {item.totalPrice.toLocaleString('fr-FR')} {t('priceDa')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-neutral-900 text-amber-200 font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <span>{t('backToShop')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

