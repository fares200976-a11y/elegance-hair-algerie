export interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

export interface InvoiceScanResult {
  invoiceNumber: string | null;
  totalAmount: number | null;
  items: InvoiceItem[];
}

// Analyse une photo de facture fournisseur et en extrait les articles.
// Nécessite la variable d'environnement ANTHROPIC_API_KEY sur Vercel.
export async function scanInvoiceImage(imageBase64: string, mediaType: string): Promise<InvoiceScanResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Le scan de facture n'est pas configuré (ANTHROPIC_API_KEY manquant).");
  }

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text: `Analyse cette photo de facture fournisseur (produits achetés en gros pour une boutique). Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour, sans balises markdown, au format EXACT suivant :
{
  "invoiceNumber": "numéro de facture visible sur le document, ou null si absent",
  "totalAmount": montant total en nombre (sans devise ni espace), ou null si absent,
  "items": [
    { "name": "nom du produit/article tel qu'écrit sur la facture", "price": prix unitaire en nombre, "quantity": quantité en nombre entier }
  ]
}
Extrait TOUS les articles listés sur la facture. Si un prix ou une quantité n'est pas clairement lisible, fais une estimation raisonnable (quantité par défaut : 1).`
            }
          ]
        }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur du service d'analyse (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const textBlock = (data.content || []).find((b: any) => b.type === 'text');
  if (!textBlock) throw new Error("Réponse de l'IA invalide (aucun texte reçu).");

  const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
  let parsed: InvoiceScanResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Impossible de lire la facture. Réessayez avec une photo plus nette et bien cadrée.");
  }

  if (!Array.isArray(parsed.items)) parsed.items = [];
  return parsed;
}
