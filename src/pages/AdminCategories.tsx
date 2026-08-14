import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Pencil, Save, X, Upload, ImageOff, AlertCircle } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, uploadProductImage } from '../lib/api';
import { Category } from '../types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formulaire d'ajout
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  // Édition inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState<string | undefined>(undefined);
  const [isEditUploading, setIsEditUploading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const base64 = await handleFileToBase64(file);
      const url = await uploadProductImage(base64, file.name, 'products');
      setImage(url);
    } catch (err) {
      console.error('Erreur upload image catégorie:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsEditUploading(true);
    try {
      const base64 = await handleFileToBase64(file);
      const url = await uploadProductImage(base64, file.name, 'products');
      setEditImage(url);
    } catch (err) {
      console.error('Erreur upload image catégorie:', err);
    } finally {
      setIsEditUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const created = await createCategory({
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
        image: image || ''
      });
      setCategories(prev => [...prev, created]);
      setName('');
      setDescription('');
      setImage(undefined);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur création catégorie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditImage(cat.image || undefined);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    try {
      const updated = await updateCategory(id, {
        name: editName.trim(),
        description: editDescription.trim(),
        image: editImage || ''
      });
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch (err) {
      console.error('Erreur modification catégorie:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ? Les produits qu'elle contient ne seront pas supprimés mais n'auront plus de catégorie.`)) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erreur suppression catégorie:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Catégories ({categories.length})
          </h1>
          <p className="text-xs text-neutral-500">
            Créez de nouvelles catégories (ex: Valises, Sacs à main, Sacs à dos) pour organiser votre boutique. Elles apparaissent automatiquement sur le site et dans le formulaire d'ajout de produit.
          </p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Nom de la catégorie</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Valises"
              className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
            {name.trim() && (
              <span className="text-[10px] text-neutral-400 mt-1 block">URL : /boutique?category={slugify(name)}</span>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Description (optionnel)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Courte description"
              className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-800 block mb-1">Image de la catégorie (optionnel)</label>
          <div className="flex items-center gap-3">
            {image && <img src={image} alt="Aperçu" className="w-14 h-14 object-cover rounded-xl border border-neutral-200" />}
            <label className="flex-1 p-2.5 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-sm text-neutral-500 flex items-center gap-2 cursor-pointer hover:border-amber-500">
              <Upload className="w-4 h-4" />
              {isUploading ? 'Envoi en cours...' : image ? 'Image ajoutée ✓' : 'Choisir une image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAddImageChange} />
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-100 text-rose-900 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Créer la catégorie
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-4">Image</th>
                <th className="p-4">Nom</th>
                <th className="p-4">Slug (URL)</th>
                <th className="p-4 text-center">Produits</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-400">Chargement...</td></tr>
              )}
              {!isLoading && categories.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-400">Aucune catégorie pour le moment.</td></tr>
              )}
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-neutral-50 align-top">
                  <td className="p-4">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        {editImage && <img src={editImage} alt="Aperçu" className="w-10 h-10 object-cover rounded-lg border border-neutral-200" />}
                        <label className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer" title="Changer l'image">
                          <Upload className="w-3.5 h-3.5 text-neutral-600" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
                        </label>
                        {isEditUploading && <span className="text-[10px] text-neutral-400">Envoi...</span>}
                      </div>
                    ) : cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg border border-neutral-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <ImageOff className="w-4 h-4 text-neutral-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-neutral-900">
                    {editingId === cat.id ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          placeholder="Description"
                          className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-[11px] outline-none focus:border-amber-500"
                        />
                      </div>
                    ) : (
                      <>
                        <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-amber-600" />{cat.name}</span>
                        {cat.description && <span className="text-neutral-500 font-normal block mt-0.5">{cat.description}</span>}
                      </>
                    )}
                  </td>
                  <td className="p-4 font-mono text-neutral-500">{cat.slug}</td>
                  <td className="p-4 text-center font-bold text-neutral-700">{cat.productCount ?? 0}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => saveEdit(cat.id)} className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg" title="Enregistrer">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg" title="Annuler">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(cat)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
