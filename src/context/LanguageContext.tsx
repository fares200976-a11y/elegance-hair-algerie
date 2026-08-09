import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_TRANSLATIONS, translateProduct as tp, translateCategory as tc } from '../lib/translate';
import { Product, Category } from '../types';

export type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  translateProduct: (p: Product) => Product;
  translateCategory: (c: Category) => Category;
  isAr: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('elegance_hair_lang');
    return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
  });

  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('elegance_hair_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (isAr) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language, dir, isAr]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const t = (key: string, fallback?: string): string => {
    if (UI_TRANSLATIONS[key]) {
      return UI_TRANSLATIONS[key][language] || UI_TRANSLATIONS[key].fr;
    }
    return fallback || key;
  };

  const translateProduct = (p: Product): Product => {
    return tp(p, isAr);
  };

  const translateCategory = (c: Category): Category => {
    return tc(c, isAr);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateProduct,
      translateCategory,
      isAr,
      dir
    }}>
      <div dir={dir} className={isAr ? 'rtl font-sans' : 'ltr font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

