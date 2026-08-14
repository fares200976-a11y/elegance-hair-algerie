import nodemailer from 'nodemailer';
import { Order } from '../../src/types';

// Envoi d'email de notification via un compte Gmail (gratuit, aucun nom de domaine requis).
// Nécessite deux variables d'environnement Vercel : GMAIL_USER et GMAIL_APP_PASSWORD
// (mot de passe d'application généré depuis le compte Google, PAS le mot de passe normal).
// Si elles ne sont pas définies, on ne bloque rien : on log un avertissement et on continue.
// L'appelant (création de commande) ne doit JAMAIS attendre cette fonction ni échouer à cause d'elle.

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
  return cachedTransporter;
}

export async function notifyNewOrder(order: Order, recipientEmails: string[]): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('⚠️  GMAIL_USER / GMAIL_APP_PASSWORD non définis — notification email de commande ignorée.');
    return;
  }
  if (!recipientEmails.length) return;

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
    await transporter.sendMail({
      from: `"Élégance Hair Algérie" <${process.env.GMAIL_USER}>`,
      to: recipientEmails.join(', '),
      subject: `🔔 Nouvelle commande ${order.orderNumber} — ${order.totalAmount.toLocaleString('fr-FR')} DA`,
      html
    });
  } catch (err) {
    console.error('Erreur envoi email notification (Gmail):', err);
  }
}
