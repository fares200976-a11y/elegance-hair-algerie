import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, Truck, AlertTriangle, PackageX, TrendingUp, Users, MapPin, Sparkles } from 'lucide-react';
import { fetchOrders, fetchProducts } from '../lib/api';
import { Order, Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()])
      .then(([ordData, prodData]) => {
        setOrders(ordData || []);
        setProducts(prodData || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur dashboard:', err);
        setIsLoading(false);
      });
  }, []);

  // Calculate Metrics
  const totalRevenue = orders.filter(o => o.status !== 'Annulée').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const ordersTodayCount = orders.filter(o => o.createdAt.startsWith(todayStr)).length;

  const pendingOrdersCount = orders.filter(o => o.status === 'Nouvelle' || o.status === 'À confirmer').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'Confirmée' || o.status === 'En préparation').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'Expédiée' || o.status === 'En livraison').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Livrée').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Annulée').length;

  const outOfStockProducts = products.filter(p => p.stock === 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5));

  // Orders by Wilaya
  const wilayaMap = new Map<string, number>();
  orders.forEach(o => {
    const w = o.wilayaName || 'Autre';
    wilayaMap.set(w, (wilayaMap.get(w) || 0) + 1);
  });
  const topWilayas = Array.from(wilayaMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (isLoading) {
    return <div className="p-12 text-center text-sm font-bold text-neutral-600">Chargement des données du tableau de bord...</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900 text-white p-6 rounded-3xl border border-amber-500/30 shadow-lg">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">Espace Administration</span>
          <h1 className="text-2xl font-serif font-extrabold text-white">Tableau de Bord & Métriques</h1>
          <p className="text-xs text-neutral-300 mt-1">Vue d'ensemble en temps réel des ventes, commandes et stocks Élégance Hair Algérie.</p>
        </div>
        <div className="px-4 py-2 bg-neutral-800 rounded-2xl border border-neutral-700 text-xs font-mono text-amber-300">
          58 Wilayas actives
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Chiffre d'affaires</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-neutral-950 block">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-bold text-amber-700">DA</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">Ventes validées</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Total Commandes</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-neutral-950 block">
            {totalOrdersCount}
          </span>
          <span className="text-[11px] text-neutral-500">{ordersTodayCount} aujourd'hui</span>
        </div>

        {/* Pending Orders */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">En Attente</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-700 block">
            {pendingOrdersCount}
          </span>
          <span className="text-[11px] text-amber-800 font-semibold">À confirmer par tél</span>
        </div>

        {/* Shipped & Delivered */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Livrées / Expédiées</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 block">
            {deliveredOrdersCount + shippedOrdersCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">{deliveredOrdersCount} livrées à 100%</span>
        </div>
      </div>

      {/* SECONDARY STATUS SUMMARY & ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Répartition des Commandes</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center p-2.5 bg-amber-50 rounded-xl border border-amber-200/60">
              <span className="font-semibold text-neutral-800">Nouvelles / À confirmer</span>
              <span className="font-extrabold text-amber-900">{pendingOrdersCount}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-xl border border-blue-200/60">
              <span className="font-semibold text-neutral-800">Confirmées / En préparation</span>
              <span className="font-extrabold text-blue-900">{confirmedOrdersCount}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-teal-50 rounded-xl border border-teal-200/60">
              <span className="font-semibold text-neutral-800">Expédiées / En livraison</span>
              <span className="font-extrabold text-teal-900">{shippedOrdersCount}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/60">
              <span className="font-semibold text-neutral-800">Livrées</span>
              <span className="font-extrabold text-emerald-900">{deliveredOrdersCount}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded-xl border border-rose-200/60">
              <span className="font-semibold text-neutral-800">Annulées</span>
              <span className="font-extrabold text-rose-900">{cancelledOrdersCount}</span>
            </div>
          </div>
        </div>

        {/* Stock Alerts & Top Wilayas */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Alertes Stock Produit</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                <span className="text-xl font-black block">{outOfStockProducts.length}</span>
                <span className="font-bold">Ruptures de stock</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="text-xl font-black block">{lowStockProducts.length}</span>
                <span className="font-bold">Stock faible</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Top Wilayas de Commande</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              {topWilayas.map(([w, count], idx) => (
                <div key={idx} className="flex justify-between p-2 bg-neutral-50 rounded-lg">
                  <span className="font-semibold text-neutral-800">{w}</span>
                  <span className="font-mono font-bold text-amber-700">{count} commande(s)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
