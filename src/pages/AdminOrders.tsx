import React, { useState, useEffect } from 'react';
import { Search, Printer, Phone, MessageSquare, Check, Clock, Truck, Eye, AlertCircle, Filter, UserCheck, Bell } from 'lucide-react';
import { fetchOrders, updateOrderStatus, fetchTeamMembers } from '../lib/api';
import { Order, OrderStatus, TeamMember } from '../types';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useOrderAlarm } from '../hooks/useOrderAlarm';

interface AdminOrdersProps {
  onPrintInvoice: (orderId: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onPrintInvoice }) => {
  const { settings } = useShop();
  const { isAdminAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const statuses: OrderStatus[] = [
    'Nouvelle',
    'À confirmer',
    'Confirmée',
    'En préparation',
    'Expédiée',
    'En livraison',
    'Livrée',
    'Annulée'
  ];

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Erreur chargement commandes admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    if (isAdminAuthenticated) {
      fetchTeamMembers().then(setTeamMembers).catch(() => {});
    }
  }, [isAdminAuthenticated]);

  const { notificationsEnabled, requestNotificationPermission } = useOrderAlarm(() => {
    loadOrders();
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus, handledByName: updated.handledByName ?? o.handledByName } : o))
      );
    } catch (err) {
      console.error('Erreur update status:', err);
    }
  };

  // Réservé à l'admin : associer manuellement un membre de l'équipe à la commande.
  const handleAssignHandler = async (orderId: string, handledByName: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      await updateOrderStatus(orderId, order.status, handledByName || undefined);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, handledByName: handledByName || undefined } : o)));
    } catch (err) {
      console.error('Erreur assignation employé:', err);
    }
  };

  const handleWhatsAppSend = (order: Order) => {
    const text = `Bonjour ${order.customerName},\nÉlégance Hair Algérie vous informe que votre commande N° ${order.orderNumber} d'un montant de ${order.totalAmount.toLocaleString('fr-FR')} DA est actuellement : *${order.status}*.\nLivraison prevue à ${order.wilayaName}. Merci !`;
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '213' + cleanPhone.substring(1) : cleanPhone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchWilaya = o.wilayaName.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchWilaya) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Gestion des Commandes Clients ({orders.length})
          </h1>
          <p className="text-xs text-neutral-500">
            Validez les commandes, mettez à jour l'expédition et imprimez les factures de livraison.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl border border-neutral-300"
        >
          Actualiser la liste
        </button>
      </div>

      {/* Alarme sonore : bip automatique + notification navigateur optionnelle */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-900 text-xs font-semibold">
          <Bell className="w-4 h-4" />
          <span>Un bip sonore retentit automatiquement à chaque nouvelle commande.</span>
        </div>
        {!notificationsEnabled && (
          <button
            onClick={requestNotificationPermission}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            Activer les notifications
          </button>
        )}
        {notificationsEnabled && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 shrink-0">
            <Check className="w-3.5 h-3.5" />
            Notifications activées
          </span>
        )}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Numéro CMD, nom, téléphone, Wilaya..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-500 hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-800 outline-none"
          >
            <option value="all">Tous les statuts ({orders.length})</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st} ({orders.filter(o => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-4">N° Commande</th>
                <th className="p-4">Date</th>
                <th className="p-4">Client / Destinataire</th>
                <th className="p-4">Produits commandés</th>
                <th className="p-4">Wilaya & Commune</th>
                <th className="p-4 text-right">Montant Total</th>
                <th className="p-4 text-center">Statut Commande</th>
                <th className="p-4">Traité par</th>
                <th className="p-4 text-right">Actions & Facture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.map(order => (
                <React.Fragment key={order.id}>
                <tr className="hover:bg-neutral-50">
                  <td className="p-4 font-mono font-bold text-amber-900 text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="p-4 text-neutral-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}<br />
                    <span className="text-[10px]">
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-neutral-900 text-sm block">{order.customerName}</span>
                    <a href={`tel:${order.customerPhone}`} className="text-amber-700 font-semibold hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{order.customerPhone}</span>
                    </a>
                  </td>
                  <td className="p-4 max-w-[220px]">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((it, idx) => (
                        <div key={idx} className="text-neutral-700">
                          <span className="font-bold">{it.quantity}×</span> {it.productName}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-neutral-400">+{order.items.length - 2} autre(s)</span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="mt-1.5 text-amber-700 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Eye className="w-3 h-3" />
                      {expandedOrderId === order.id ? 'Masquer le détail' : 'Voir le détail'}
                    </button>
                  </td>
                  <td className="p-4">
                    <strong className="text-neutral-900 block">{order.wilayaName}</strong>
                    <span className="text-neutral-500">{order.commune}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-extrabold text-neutral-950 text-sm block">
                      {order.totalAmount.toLocaleString('fr-FR')} DA
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold">C.O.D Espèces</span>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`p-1.5 rounded-lg font-bold text-xs outline-none border cursor-pointer ${
                        order.status === 'Livrée'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : order.status === 'Annulée'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : order.status === 'Expédiée' || order.status === 'En livraison'
                          ? 'bg-teal-100 text-teal-900 border-teal-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    {isAdminAuthenticated ? (
                      <select
                        value={order.handledByName || ''}
                        onChange={e => handleAssignHandler(order.id, e.target.value)}
                        className="bg-neutral-50 border border-neutral-300 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-neutral-800 outline-none"
                      >
                        <option value="">— Non assigné —</option>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    ) : order.handledByName ? (
                      <span className="text-neutral-700 font-semibold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {order.handledByName}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleWhatsAppSend(order)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                      title="Contacter sur WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onPrintInvoice(order.id)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
                      title="Imprimer la facture"
                      id={`btn-print-order-${order.id}`}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr className="bg-amber-50/60">
                    <td colSpan={8} className="p-4">
                      <div className="bg-white rounded-2xl border border-amber-200 p-4 space-y-2">
                        <span className="text-xs font-extrabold text-amber-900 uppercase block mb-2">
                          Détail des produits — {order.orderNumber} ({order.items.length} article{order.items.length > 1 ? 's' : ''})
                        </span>
                        <div className="divide-y divide-neutral-100">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-3 py-2">
                              {it.productImage ? (
                                <img src={it.productImage} alt={it.productName} className="w-12 h-12 object-cover rounded-lg border border-neutral-200 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-neutral-100 shrink-0" />
                              )}
                              <div className="flex-1">
                                <span className="font-bold text-neutral-900 block">{it.productName}</span>
                                <span className="text-neutral-500">{it.brand}</span>
                              </div>
                              <div className="text-right whitespace-nowrap">
                                <span className="font-bold text-neutral-900 block">{it.quantity} × {it.unitPrice.toLocaleString('fr-FR')} DA</span>
                                <span className="text-amber-800 font-extrabold">= {it.totalPrice.toLocaleString('fr-FR')} DA</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <div className="pt-2 border-t border-neutral-100 text-neutral-600">
                            <span className="font-bold text-neutral-800">Note client : </span>{order.notes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};