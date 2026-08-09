import React, { useEffect, useState } from 'react';
import { Printer, ArrowLeft, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';

interface PrintInvoicePageProps {
  orderId: string;
  onBack: () => void;
}

export const PrintInvoicePage: React.FC<PrintInvoicePageProps> = ({ orderId, onBack }) => {
  const { settings } = useShop();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement facture:', err);
        setIsLoading(false);
      });
  }, [orderId]);

  if (isLoading) {
    return <div className="p-12 text-center font-bold text-neutral-600">Chargement de la facture...</div>;
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">Commande non trouvée</h2>
        <button onClick={onBack} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 font-sans print:bg-white print:p-0 print:min-h-0">
      {/* Top Controls Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white text-neutral-800 rounded-xl border border-neutral-300 font-bold text-xs flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fermer / Retour</span>
        </button>

        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
          id="btn-print-trigger"
        >
          <Printer className="w-4 h-4" />
          <span>IMPRIMER CETTE FACTURE</span>
        </button>
      </div>

      {/* Invoice Sheet Document */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-xl print:shadow-none print:border-none print:p-0 print:rounded-none space-y-8 text-neutral-900">
        {/* Header Branding */}
        <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-6">
          <div>
            <h1 className="font-serif font-extrabold text-2xl tracking-wider text-neutral-950">
              {settings.storeName || 'ÉLÉGANCE HAIR ALGÉRIE'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">{settings.address}</p>
            <p className="text-xs text-neutral-500">Tél: {settings.phone}</p>
            <p className="text-xs text-neutral-500">Email: {settings.email}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-neutral-400 block uppercase">
              FACTURE N°
            </span>
            <span className="text-2xl font-black font-mono text-amber-800">
              {order.orderNumber}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">
              Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Block */}
        <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
          <div>
            <span className="font-extrabold text-neutral-900 uppercase tracking-wider block mb-1">
              CLIENT / DESTINATAIRE :
            </span>
            <p className="font-bold text-neutral-900 text-sm">{order.customerName}</p>
            <p className="text-neutral-700">Tél: {order.customerPhone}</p>
          </div>

          <div>
            <span className="font-extrabold text-neutral-900 uppercase tracking-wider block mb-1">
              LIVRAISON :
            </span>
            <p className="font-bold text-neutral-900">{order.wilayaName} ({order.commune})</p>
            <p className="text-neutral-700">{order.address}</p>
            <p className="text-neutral-500">Mode : {order.deliveryType === 'agence' ? 'Bureau/Agence' : 'À Domicile'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-3 rounded-l-xl">Désignation Produit</th>
                <th className="p-3 text-center">Marque</th>
                <th className="p-3 text-right">P.U (DA)</th>
                <th className="p-3 text-center">Qté</th>
                <th className="p-3 text-right rounded-r-xl">Total (DA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50">
                  <td className="p-3 font-semibold text-neutral-900">{item.productName}</td>
                  <td className="p-3 text-center text-neutral-500">{item.brand || 'Élégance'}</td>
                  <td className="p-3 text-right">{item.unitPrice.toLocaleString('fr-FR')}</td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-extrabold">{item.totalPrice.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Sous-total HT :</span>
              <span>{order.subtotal.toLocaleString('fr-FR')} DA</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Frais de livraison ({order.wilayaName}) :</span>
              <span>{order.deliveryFee.toLocaleString('fr-FR')} DA</span>
            </div>
            <div className="pt-2 border-t-2 border-neutral-900 flex justify-between font-extrabold text-sm text-neutral-950">
              <span>TOTAL À PAYER :</span>
              <span className="text-base text-amber-800">{order.totalAmount.toLocaleString('fr-FR')} DA</span>
            </div>
          </div>
        </div>

        {/* Cash on Delivery Stamp */}
        <div className="p-4 border-2 border-dashed border-amber-600/60 bg-amber-50/50 rounded-2xl text-center text-xs space-y-1">
          <span className="font-extrabold uppercase text-amber-900 tracking-widest text-sm block">
            STAMP: PAIEMENT À LA LIVRAISON (C.O.D)
          </span>
          <p className="text-neutral-700">
            Montant net à encaisser par le livreur à la livraison : <strong>{order.totalAmount.toLocaleString('fr-FR')} DA</strong>
          </p>
          <p className="text-[10px] text-neutral-400">
            {settings.termsAndConditions}
          </p>
        </div>

        {/* Footer Notice */}
        <div className="text-center text-[10px] text-neutral-400 pt-6 border-t border-neutral-200">
          <p>Merci pour votre confiance - Élégance Hair Algérie - {settings.phone} - www.elegancehair.dz</p>
        </div>
      </div>
    </div>
  );
};
