import { Order } from '../../src/types';

// Envoi d'email transactionnel via l'API Resend (https://resend.com — gratuit jusqu'à 3000 emails/mois).
// Si RESEND_API_KEY n'est pas défini, on ne bloque rien : on log juste un avertissement et on continue.
// L'appelant (création de commande) ne doit JAMAIS attendre cette fonction ni échouer à cause d'elle.
export async function notifyNewOrder(order: Order, recipientEmails: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY non défini — notification email de commande ignorée.');
    return;
  }
  if (!recipientEmails.length) return;

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Élégance Hair <onboarding@resend.dev>';
  const appUrl = process.env.APP_URL || 'https://elegancehair.dz';

  const itemsHtml = order.items
    .map(it => `<li>${it.quantity} × ${it.productName} — ${it.totalPrice.toLocaleString('fr-FR')} DA</li>`)
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color:#111;">🔔 Nouvelle commande — ${order.orderNumber}</h2>
      <p><strong>${order.customerName}</strong> — ${order.customerPhone}</p>
      <p>${order.wilayaName}, ${order.commune}</p>
      <ul>${itemsHtml}</ul>
      <p style="font-size:18px;"><strong>Total : ${order.totalAmount.toLocaleString('fr-FR')} DA</strong></p>
      <p><a href="${appUrl}/admin" style="color:#b45309;">Ouvrir l'espace administration</a></p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipientEmails,
        subject: `🔔 Nouvelle commande ${order.orderNumber} — ${order.totalAmount.toLocaleString('fr-FR')} DA`,
        html
      })
    });
    if (!res.ok) {
      console.error('Erreur envoi email notification (Resend):', await res.text());
    }
  } catch (err) {
    console.error('Erreur réseau envoi email notification:', err);
  }
}
