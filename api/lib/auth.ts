import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET manquant — obligatoire pour signer les tokens admin (voir .env.example).');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@elegancehair.dz';
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
if (!ADMIN_PASSWORD_HASH) {
  ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123456', 10);
  console.warn(
    '⚠️  ADMIN_PASSWORD_HASH non défini — mot de passe par défaut "admin123456" utilisé.\n' +
    '   Générez un hash avec: node -e "console.log(require(\'bcryptjs\').hashSync(\'VOTRE_MDP\', 10))"\n' +
    '   puis définissez ADMIN_PASSWORD_HASH avant tout déploiement.'
  );
}

interface AdminJwtPayload {
  role: 'admin';
  email: string;
}

interface StaffJwtPayload {
  role: 'staff';
  teamMemberId: string;
  name: string;
}

type AnyJwtPayload = AdminJwtPayload | StaffJwtPayload;

export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as AdminJwtPayload;
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

// Autorise l'admin OU un membre de l'équipe (accès limité aux commandes).
// Attache req.actor = { role, name } pour que la route sache qui a agi.
export function requireStaffOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as AnyJwtPayload;
    if (payload.role !== 'admin' && payload.role !== 'staff') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    (req as any).actor =
      payload.role === 'admin'
        ? { role: 'admin', name: 'Administrateur' }
        : { role: 'staff', name: (payload as StaffJwtPayload).name };
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

export async function verifyAdminLogin(email: string, password: string): Promise<{ token: string; email: string } | null> {
  const emailMatches = email === ADMIN_EMAIL || email === 'admin';
  const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH as string);
  if (!emailMatches || !passwordMatches) return null;

  const token = jwt.sign({ role: 'admin', email: ADMIN_EMAIL } as AdminJwtPayload, JWT_SECRET as string, {
    expiresIn: '24h'
  });
  return { token, email: ADMIN_EMAIL };
}

// Génère un token staff à partir d'un membre d'équipe déjà vérifié (voir db.verifyTeamCode).
export function issueStaffToken(teamMemberId: string, name: string): string {
  return jwt.sign({ role: 'staff', teamMemberId, name } as StaffJwtPayload, JWT_SECRET as string, {
    expiresIn: '24h'
  });
}
