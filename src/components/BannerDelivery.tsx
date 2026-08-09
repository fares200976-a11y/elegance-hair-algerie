import React from 'react';
import { Truck, ShieldCheck, Award, Headphones, RotateCcw } from 'lucide-react';

export const BannerDelivery: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-amber-500/10 py-10 border-y border-amber-200/60 my-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-300 flex items-center justify-center shadow-md mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Livraison 58 Wilayas</h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs">
              Expédition rapide sous 24h à 48h à domicile ou en bureau/agence.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-300 flex items-center justify-center shadow-md mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Paiement à la Livraison</h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs">
              Commandez sereinement et ne payez en espèces qu'à la réception de votre colis.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-300 flex items-center justify-center shadow-md mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Produits 100% Originaux</h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs">
              Appareils testés et garantis 1 à 2 ans avec carte de garantie officielle.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-300 flex items-center justify-center shadow-md mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Support Client Dédié</h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs">
              Une équipe à votre écoute 7j/7 par téléphone et WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
