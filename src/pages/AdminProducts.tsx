import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Check, X, Tag, AlertCircle, Upload, Eye } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories, uploadImages } from '../lib/api';
import { Product, Category } from '../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Dyson');
  const [skuRef, setSkuRef] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(12000);
  const [oldPrice, setOldPrice] = useState(15000);
  const [stock, setStock] = useState(10);
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [power, setPower] = useState('1600W');
  const [temperature, setTemperature] = useState('140°C - 210°C');
  const [color, setColor] = useState('Rose Gold');
  const [warranty, setWarranty] = useState('2 Ans Garantie Officielle');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [techSpecsInput, setTechSpecsInput] = useState('');
  const [boxContentInput, setBoxContentInput] = useState('');
  
  // Image List
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pData, cData] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(pData || []);
      setCategories(cData || []);
      if (cData && cData.length > 0 && !categoryId) {
        setCategoryId(cData[0].id);
      }
    } catch (err) {
      console.error('Erreur chargement admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('Dyson');
    setSkuRef(`REF-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice(12000);
    setOldPrice(15000);
    setStock(10);
    setShortDesc('');
    setFullDesc('');
    setPower('1600W');
    setTemperature('140°C - 210°C');
    setColor('Rose Gold');
    setWarranty('2 Ans Garantie Officielle');
    setIsFeatured(false);
    setIsNew(true);
    setIsPromo(false);
    setTechSpecsInput('Moteur digital V9 110 000 tr/min\nTechnologie ionique anti-frizz\nCordon rotatif 360° de 2.7m');
    setBoxContentInput('Appareil principal\nEmbout concentrateur\nEtui de rangement rigide\nCarte de garantie');
    setImageUrls(['/src/assets/images/dryer_pro_1786185885233.jpg']);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setSkuRef(p.skuRef);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setOldPrice(p.oldPrice || 0);
    setStock(p.stock);
    setShortDesc(p.shortDesc);
    setFullDesc(p.fullDesc);
    setPower(p.power || '');
    setTemperature(p.temperature || '');
    setColor(p.color || '');
    setWarranty(p.warranty || '');
    setIsFeatured(p.isFeatured);
    setIsNew(p.isNew);
    setIsPromo(p.isPromo);
    setTechSpecsInput((p.techSpecs || []).join('\n'));
    setBoxContentInput((p.boxContent || []).join('\n'));
    setImageUrls(p.images || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const base64List: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const b64 = await new Promise<string>(resolve => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      base64List.push(b64);
    }

    try {
      const uploaded = await uploadImages(base64List);
      setImageUrls(prev => [...prev, ...uploaded]);
    } catch (err) {
      console.error('Erreur upload images:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return;

    const payload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      skuRef,
      categoryId,
      brand,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      stock: Number(stock),
      shortDesc,
      fullDesc,
      power,
      temperature,
      color,
      warranty,
      isFeatured,
      isNew,
      isPromo,
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'],
      techSpecs: techSpecsInput.split('\n').filter(s => s.trim() !== ''),
      boxContent: boxContentInput.split('\n').filter(s => s.trim() !== '')
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.skuRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Gestion du Catalogue Produits
          </h1>
          <p className="text-xs text-neutral-500">
            Ajoutez, modifiez, ajustez les prix et uploadez des images pour vos appareils.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-neutral-900 hover:bg-amber-600 text-amber-200 hover:text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
          id="btn-add-product-admin"
        >
          <Plus className="w-4 h-4" />
          <span>AJOUTER UN PRODUIT</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Rechercher par nom, marque, référence SKU..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-4">Visuel</th>
                <th className="p-4">Désignation</th>
                <th className="p-4">Marque & Réf</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-right">Prix (DA)</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map(product => {
                const catObj = categories.find(c => c.id === product.categoryId);
                return (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xl border border-neutral-200"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-neutral-900 text-sm block">{product.name}</span>
                      <span className="text-neutral-500 line-clamp-1">{product.shortDesc}</span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="font-bold text-amber-800">{product.brand}</span>
                      <span className="text-neutral-400 block">{product.skuRef}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-neutral-100 font-semibold rounded-md text-neutral-800">
                        {catObj?.name || 'Catégorie'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-extrabold text-neutral-950 text-sm block">
                        {product.price.toLocaleString('fr-FR')} DA
                      </span>
                      {product.oldPrice && (
                        <span className="text-neutral-400 line-through text-[11px]">
                          {product.oldPrice.toLocaleString('fr-FR')} DA
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          product.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : product.stock <= (product.minStock || 5)
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stock} dispo
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-1">
                      {product.isFeatured && <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold">P</span>}
                      {product.isNew && <span className="bg-neutral-900 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">N</span>}
                      {product.isPromo && <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">%</span>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Lisseur Vapeur Titane Pro"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Marque *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="Ex: Dyson, L'Oréal, BaByliss, Braun..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Référence SKU *</label>
                  <input
                    type="text"
                    required
                    value={skuRef}
                    onChange={e => setSkuRef(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Catégorie *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Stock disponible *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Prix de vente (DA) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Ancien Prix Barré (DA)</label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={e => setOldPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">Description courte</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={e => setShortDesc(e.target.value)}
                  placeholder="Accroche en 1 ligne..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={e => setFullDesc(e.target.value)}
                  placeholder="Présentation complète de l'appareil..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none resize-none"
                />
              </div>

              {/* Technical Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Puissance</label>
                  <input
                    type="text"
                    value={power}
                    onChange={e => setPower(e.target.value)}
                    placeholder="Ex: 1600W"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Température</label>
                  <input
                    type="text"
                    value={temperature}
                    onChange={e => setTemperature(e.target.value)}
                    placeholder="Ex: 140°C - 230°C"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Couleur / Finition</label>
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    placeholder="Ex: Rose Gold"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              {/* Images Upload Section */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="text-xs font-bold text-neutral-800 block">
                  Images du produit ({imageUrls.length})
                </label>
                
                <div className="flex flex-wrap items-center gap-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-300 group">
                      <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md opacity-90 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer text-neutral-500 hover:text-amber-700 transition-colors">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {isUploading && <span className="text-xs text-amber-700 font-bold block">Traitement de l'image...</span>}
              </div>

              {/* Flags & Badges */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span>Produit Phare (Hero)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span>Nouveau Arrivage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPromo}
                    onChange={e => setIsPromo(e.target.checked)}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span>En Promotion</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 text-amber-300 font-bold text-xs rounded-xl hover:bg-neutral-800 shadow-md"
                >
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
