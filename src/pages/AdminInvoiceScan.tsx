import React, { useState } from 'react';
import { ScanLine, Upload, AlertCircle, CheckCircle2, FileText, Package } from 'lucide-react';
import { scanInvoice, InvoiceScanResponse } from '../lib/api';

export const AdminInvoiceScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceScanResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setResult(null);
    setIsScanning(true);

    try {
      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPreviewUrl(base64);

      const response = await scanInvoice(base64, file.type || 'image/jpeg');
      setResult(response);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur analyse facture');
    } finally {
      setIsScanning(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-3xl">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-amber-600" />
          Scanner une Facture
        </h1>
        <p className="text-xs text-neutral-500">
          Prends une photo de ta facture fournisseur : l'IA détecte automatiquement les articles et crée des produits en <strong>brouillon</strong>. Complète ensuite chaque brouillon (catégorie, photo, description) avant de le publier dans Admin → Produits.
        </p>
      </div>

      {/* Upload zone */}
      <label className="block bg-white p-8 rounded-3xl border-2 border-dashed border-neutral-300 text-center cursor-pointer hover:border-amber-500 transition-colors">
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        {previewUrl ? (
          <img src={previewUrl} alt="Facture" className="max-h-64 mx-auto rounded-xl mb-4 object-contain" />
        ) : (
          <Upload className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
        )}
        <span className="font-bold text-neutral-800 text-sm block">
          {isScanning ? 'Analyse en cours...' : 'Prendre une photo ou choisir un fichier'}
        </span>
        <span className="text-xs text-neutral-400">Cadre bien toute la facture, dans un endroit bien éclairé</span>
      </label>

      {isScanning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm font-semibold flex items-center gap-2">
          <ScanLine className="w-4 h-4 animate-pulse" />
          Lecture de la facture par l'IA en cours, patiente quelques secondes...
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-100 text-rose-900 font-bold text-sm rounded-2xl border border-rose-200 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            {result.products.length} produit(s) créé(s) en brouillon
          </div>

          {result.invoiceNumber && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <FileText className="w-4 h-4" />
              Facture n° {result.invoiceNumber}
              {result.totalAmount ? ` — Total détecté : ${result.totalAmount.toLocaleString('fr-FR')} DA` : ''}
            </div>
          )}

          <div className="divide-y divide-neutral-100">
            {result.products.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">{p.name}</span>
                    <span className="text-xs text-neutral-400">Stock détecté : {p.stock}</span>
                  </div>
                </div>
                <span className="font-extrabold text-neutral-900">{p.price.toLocaleString('fr-FR')} DA</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            ⚠️ Ces produits sont en <strong>brouillon</strong> et invisibles sur le site pour l'instant. Va dans <strong>Admin → Produits</strong> pour ajouter leur catégorie, photo, et les publier.
          </p>
        </div>
      )}
    </div>
  );
};
