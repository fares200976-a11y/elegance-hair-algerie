import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Printer } from 'lucide-react';
import { trackOrder } from '../lib/api';
import { Order, OrderStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  initialPhone?: string;
  onPrintInvoice?: (orderId: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  initialPhone = '',
  onPrintInvoice
}) => {
  const { t, isAr } = useLanguage();
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const statuses: OrderStatus[] = [
    'Nouvelle',
    'À confirmer',
    'Confirmée',
    'En préparation',
    'Expédiée',
    'En livraison',
    'Livrée'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !phone) {
      setErrorMsg(t('trackingInputPrompt'));
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setTrackedOrder(null);

    try {
      const order = await trackOrder(orderNumber, phone);
      setTrackedOrder(order);
    } catch (err: any) {
      setErrorMsg(err.message || (isAr ? 'لم يتم العثور على الطلب. تحقق من رقم الطلب ورقم الهاتف.' : 'Commande introuvable. Vérifiez votre numéro de commande.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      trackOrder(initialOrderNumber, initialPhone)
        .then(res => setTrackedOrder(res))
        .catch(() => {});
    }
  }, [initialOrderNumber, initialPhone]);

  const getStatusIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'Annulée') return -1;
    return statuses.indexOf(currentStatus);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans space-y-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-700 tracking-wider uppercase bg-amber-100 px-3 py-1 rounded-full">
          {t('trackingBadge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900">
          {t('trackingTitle')}
        </h1>
        <p className="text-sm text-neutral-600">
          {t('trackingSubtitle')}
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('orderNumberLabel')}
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="Ex: CMD-2026-000001"
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                {t('phoneNumberLabel')}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ex: 0550123456"
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{isAr ? 'جاري البحث...' : 'Recherche en cours...'}</span>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t('searchOrderBtn')}</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 bg-rose-100 text-rose-900 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* TRACKED ORDER RESULT DETAILS */}
      {trackedOrder && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-8 animate-fadeIn">
          {/* Header Order Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <span className="text-xs font-mono text-neutral-400">{isAr ? 'المرجع:' : 'RÉFÉRENCE :'}</span>
              <h2 className="text-2xl font-extrabold text-neutral-950 font-mono">
                {trackedOrder.orderNumber}
              </h2>
              <span className="text-xs text-neutral-500">
                {isAr ? 'تاريخ الطلب:' : 'Passée le'} {new Date(trackedOrder.createdAt).toLocaleDateString('fr-FR')} {isAr ? '' : 'à'} {new Date(trackedOrder.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-amber-100 text-amber-900 font-extrabold text-sm rounded-full shadow-xs">
                {t('orderStatusLabel')}: {trackedOrder.status}
              </span>
              {onPrintInvoice && (
                <button
                  onClick={() => onPrintInvoice(trackedOrder.id)}
                  className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-colors"
                  title={t('printInvoice')}
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TIMELINE TRACKER */}
          {trackedOrder.status === 'Annulée' ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
              <span className="text-rose-700 font-extrabold text-base block">
                ❌ {isAr ? 'تم إلغاء هذا الطلب.' : 'Cette commande a été annulée.'}
              </span>
              <p className="text-xs text-neutral-600">
                {isAr ? 'يرجى الاتصال بخدمة العملاء لأي استفسار.' : 'Contactez notre service client pour toute question concernant cette annulation.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-neutral-900 text-sm">{t('shippingProgress')}:</h3>
              
              {/* Stepper Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {statuses.map((st, idx) => {
                  const currentIdx = getStatusIndex(trackedOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={st}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-neutral-900 text-amber-300 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold mb-1">{isAr ? 'م' : 'E'}{idx + 1}</span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 bg-white/20">
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="text-[11px] font-bold leading-tight line-clamp-2">
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 text-xs sm:text-sm">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1">
              <span className="font-bold text-amber-800 uppercase text-xs block">{t('recipientInfo')}</span>
              <p className="font-bold text-neutral-900">{trackedOrder.customerName}</p>
              <p className="text-neutral-600">{t('phoneNumber')}: {trackedOrder.customerPhone}</p>
              <p className="text-neutral-600">
                {t('wilaya')}: <strong>{trackedOrder.wilayaName}</strong> ({trackedOrder.commune})
              </p>
              <p className="text-neutral-500">{t('fullAddress')}: {trackedOrder.address}</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1">
              <span className="font-bold text-amber-800 uppercase text-xs block">{t('financialSummary')}</span>
              <div className="flex justify-between text-neutral-600">
                <span>{t('subtotalItems')}:</span>
                <span>{trackedOrder.subtotal.toLocaleString('fr-FR')} {t('priceDa')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>{t('deliveryFee')}:</span>
                <span>{trackedOrder.deliveryFee.toLocaleString('fr-FR')} {t('priceDa')}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-extrabold text-neutral-950 text-base">
                <span>{t('totalToPay')}:</span>
                <span>{trackedOrder.totalAmount.toLocaleString('fr-FR')} {t('priceDa')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

