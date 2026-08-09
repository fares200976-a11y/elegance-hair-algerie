import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { settings } = useShop();
  const { t, isAr } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setPhone('');
    setWilaya('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-700 tracking-wider uppercase bg-amber-100 px-3 py-1 rounded-full">
          {t('support7d')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900">
          {t('contactTitle')}
        </h1>
        <p className="text-sm text-neutral-600">
          {t('contactSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 bg-neutral-900 text-white p-8 rounded-3xl space-y-6 shadow-xl border border-amber-500/20">
          <h2 className="text-xl font-serif font-extrabold text-white border-b border-neutral-800 pb-3">
            {t('contactDetails')}
          </h2>

          <div className="space-y-4 text-sm text-neutral-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block">{isAr ? 'العنوان في الجزائر' : 'Adresse en Algérie'}</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block">{isAr ? 'الهاتف المباشر' : 'Téléphone Hotline'}</strong>
                <span>{settings.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block">WhatsApp Direct</strong>
                <a
                  href={`https://wa.me/${settings.whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  +{settings.whatsappPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block">{isAr ? 'البريد الإلكتروني' : 'Email Support'}</strong>
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-400 space-y-1">
            <p className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Clock className="w-4 h-4" /> {isAr ? 'ساعات العمل :' : 'Horaires du Support :'}
            </p>
            <p>{isAr ? 'من السبت إلى الخميس : 08:30 - 20:30' : 'Du Samedi au Jeudi : 08:30 - 20:30'}</p>
            <p>{isAr ? 'الجمعة : 14:00 - 20:00' : 'Vendredi : 14:00 - 20:00'}</p>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            {t('sendMessage')}
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-100 text-emerald-900 font-bold rounded-2xl text-sm space-y-2">
              <span className="text-base block">✅ {isAr ? 'تم إرسال الرسالة بنجاح!' : 'Message envoyé avec succès !'}</span>
              <p className="font-normal text-neutral-700">
                {isAr ? 'سيتصل بك مستشار من Élégance Hair قريباً جداً هاتفياً.' : 'Un conseiller Élégance Hair vous recontactera très rapidement par téléphone.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    {t('fullName')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: أمينة ك.' : 'Ex: Amina K.'}
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    {t('phoneNumber')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Ex: 0550 12 34 56"
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  {t('wilaya')}
                </label>
                <input
                  type="text"
                  value={wilaya}
                  onChange={e => setWilaya(e.target.value)}
                  placeholder={isAr ? 'مثال: 16 - الجزائر، 31 - وهران...' : 'Ex: 16 - Alger, 31 - Oran...'}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  {t('yourMessage')} <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب استفسارك بالتفصيل...' : 'Précisez votre demande...'}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
                <span>{t('sendMessageBtn')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <h2 className="text-xl font-serif font-extrabold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-4">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>{t('faqTitle')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-700">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <h3 className="font-bold text-neutral-900">{t('faqQ1')}</h3>
            <p className="text-xs text-neutral-600">
              {t('faqA1')}
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <h3 className="font-bold text-neutral-900">{t('faqQ2')}</h3>
            <p className="text-xs text-neutral-600">
              {t('faqA2')}
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <h3 className="font-bold text-neutral-900">{t('faqQ3')}</h3>
            <p className="text-xs text-neutral-600">
              {t('faqA3')}
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <h3 className="font-bold text-neutral-900">{t('faqQ4')}</h3>
            <p className="text-xs text-neutral-600">
              {t('faqA4')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

