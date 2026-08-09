import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');

  const cleanPhone = settings.whatsappPhone.replace(/[^0-9]/g, '');

  const handleSend = () => {
    const text = userMessage.trim() || 'Bonjour Élégance Hair Algérie, je souhaite avoir des informations sur vos appareils de coiffure.';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setUserMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-fadeIn font-sans">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                É
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Élégance Hair WhatsApp</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block"></span> En ligne - Service Client
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-emerald-50/50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl shadow-xs border border-emerald-100/60 text-neutral-800">
              👋 Bonjour ! Comment pouvons-nous vous aider aujourd'hui ? Demandez des conseils sur nos lisseurs, sèche-cheveux ou suivez votre commande.
            </div>

            <textarea
              rows={2}
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 outline-none focus:border-emerald-600 text-neutral-800 resize-none"
            />

            <button
              onClick={handleSend}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Démarrer la discussion WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        title="Discuter sur WhatsApp"
        id="btn-floating-whatsapp"
      >
        <MessageSquare className="w-7 h-7 fill-white/20" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
};
