import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Wilaya, ShopSettings, Review } from '../types';
import { fetchProducts, fetchCategories, fetchWilayas, fetchSettings, fetchReviews } from '../lib/api';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_REVIEWS } from '../data/initialData';
import { INITIAL_WILAYAS } from '../data/wilayas';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  wilayas: Wilaya[];
  settings: ShopSettings;
  reviews: Review[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshWilayas: () => Promise<void>;
  getWilayaByCode: (code: string) => Wilaya | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [wilayas, setWilayas] = useState<Wilaya[]>(INITIAL_WILAYAS);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodsData, catsData, wilsData, setsData, revsData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchWilayas(),
        fetchSettings(),
        fetchReviews()
      ]);

      if (prodsData && prodsData.length > 0) setProducts(prodsData);
      if (catsData && catsData.length > 0) setCategories(catsData);
      if (wilsData && wilsData.length > 0) setWilayas(wilsData);
      if (setsData) setSettings(setsData);
      if (revsData) setReviews(revsData);
    } catch (err) {
      console.warn('Utilisation des données initiales en cas de lenteur serveur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshProducts = async () => {
    const data = await fetchProducts();
    if (data && data.length > 0) setProducts(data);
  };

  const refreshSettings = async () => {
    const data = await fetchSettings();
    if (data) setSettings(data);
  };

  const refreshCategories = async () => {
    const data = await fetchCategories();
    if (data && data.length > 0) setCategories(data);
  };

  const refreshWilayas = async () => {
    const data = await fetchWilayas();
    if (data && data.length > 0) setWilayas(data);
  };

  const getWilayaByCode = (code: string) => {
    return wilayas.find(w => w.code === code);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        wilayas,
        settings,
        reviews,
        isLoading,
        refreshProducts,
        refreshSettings,
        refreshCategories,
        refreshWilayas,
        getWilayaByCode
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
