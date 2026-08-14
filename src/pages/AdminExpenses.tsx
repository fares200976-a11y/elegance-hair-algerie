import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, Upload, ImageOff, Wallet } from 'lucide-react';
import { fetchExpenses, createExpense, deleteExpense, uploadProductImage } from '../lib/api';
import { Expense } from '../types';

const CATEGORIES = ['Marchandise', 'Transport/Livraison', 'Loyer', 'Salaires', 'Marketing', 'Fournitures', 'Autre'];

export const AdminExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [invoiceUrl, setInvoiceUrl] = useState<string | undefined>(undefined);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error('Erreur chargement dépenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      const base64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const url = await uploadProductImage(base64, file.name, 'invoices');
      setInvoiceUrl(url);
    } catch (err) {
      console.error('Erreur upload facture:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSupplier('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setInvoiceUrl(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    setIsSubmitting(true);
    try {
      const created = await createExpense({
        title: title.trim(),
        supplier: supplier.trim() || undefined,
        amount: Number(amount),
        category,
        expenseDate,
        invoiceUrl
      });
      setExpenses(prev => [created, ...prev]);
      resetForm();
    } catch (err) {
      console.error('Erreur création dépense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette dépense ?')) return;
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Erreur suppression dépense:', err);
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Dépenses & Factures d'Achat
          </h1>
          <p className="text-xs text-neutral-500">
            Enregistrez vos achats fournisseurs, loyer, transport... avec la photo de la facture si besoin.
          </p>
        </div>
        <div className="bg-neutral-900 text-amber-300 font-bold text-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Total : {total.toLocaleString('fr-FR')} DA
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-neutral-800 block mb-1">Titre / Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Achat lisseurs x20"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Fournisseur (optionnel)</label>
            <input
              type="text"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              placeholder="Nom du fournisseur"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Montant (DA)</label>
            <input
              type="number"
              required
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Catégorie</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={e => setExpenseDate(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-neutral-800 block mb-1">Photo de la facture (optionnel)</label>
            <label className="w-full p-2.5 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-sm text-neutral-500 flex items-center gap-2 cursor-pointer hover:border-amber-500">
              <Upload className="w-4 h-4" />
              {isUploading ? 'Envoi en cours...' : invoiceUrl ? 'Facture ajoutée ✓' : 'Choisir une image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !amount}
          className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Enregistrer la dépense
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-4">Date</th>
                <th className="p-4">Titre</th>
                <th className="p-4">Fournisseur</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-center">Facture</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading && (
                <tr><td colSpan={7} className="p-6 text-center text-neutral-400">Chargement...</td></tr>
              )}
              {!isLoading && expenses.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-neutral-400">Aucune dépense enregistrée.</td></tr>
              )}
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-neutral-50">
                  <td className="p-4 text-neutral-500 whitespace-nowrap">
                    {new Date(exp.expenseDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 font-bold text-neutral-900 flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-amber-600" />
                    {exp.title}
                  </td>
                  <td className="p-4 text-neutral-600">{exp.supplier || '—'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 text-right font-extrabold text-neutral-950">
                    {exp.amount.toLocaleString('fr-FR')} DA
                  </td>
                  <td className="p-4 text-center">
                    {exp.invoiceUrl ? (
                      <a href={exp.invoiceUrl} target="_blank" rel="noreferrer">
                        <img src={exp.invoiceUrl} alt="Facture" className="w-10 h-10 object-cover rounded-lg mx-auto border border-neutral-200" />
                      </a>
                    ) : (
                      <ImageOff className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
