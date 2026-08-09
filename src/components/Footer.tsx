import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategorySlug: (slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setSelectedCategorySlug }) => {
  const { settings, categories } = useShop();
  const { t, translateCategory } = useLanguage();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-amber-900/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('delivery58')}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{t('delivery58Sub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('codTitle')}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{t('codSub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('guarantee')}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{t('guaranteeSub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('support7d')}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{t('support7dSub')}</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5">
                <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
                  É
                </div>
              </div>
              <span className="font-serif font-extrabold text-xl tracking-wider text-white">
                ÉLÉGANCE <span className="text-amber-500 text-xs font-sans tracking-widest block uppercase">HAIR ALGÉRIE</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed pr-4">
              {t('heroSubtitle')}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.facebookUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-neutral-300"
              >
                FB
              </a>
              <a
                href={settings.instagramUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-neutral-300"
              >
                IG
              </a>
              <a
                href={`https://wa.me/${settings.whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-emerald-400"
              >
                WA
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 rtl:border-l-0 rtl:border-r-2 pl-2.5 rtl:pl-0 rtl:pr-2.5">
              {t('ourCategories')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 6).map(rawCat => {
                const cat = translateCategory(rawCat);
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 group text-neutral-400"
                    >
                      <span>{cat.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 rtl:rotate-90" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 rtl:border-l-0 rtl:border-r-2 pl-2.5 rtl:pl-0 rtl:pr-2.5">
              {t('helpTracking')}
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t('tracking')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 rtl:border-l-0 rtl:border-r-2 pl-2.5 rtl:pl-0 rtl:pr-2.5">
              {t('contactDetails')}
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Masked Admin "A" Button */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>© {new Date().getFullYear()} {t('copyright')}</span>
            {/* Masked discreet "A" button at the very bottom of the page */}
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-extrabold font-serif text-neutral-600 hover:text-amber-400 hover:bg-neutral-900 transition-colors cursor-pointer select-none ml-1 opacity-60 hover:opacity-100"
              title="A"
              aria-label="Admin"
              id="btn-masked-admin"
            >
              A
            </button>
          </p>
          <div className="flex items-center gap-4 font-medium text-neutral-400">
            <span>{t('topBannerCod')}</span>
            <span>•</span>
            <span>{t('delivery58')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
