import React, { createContext, useContext, useState } from 'react';
import { staffLogin as apiStaffLogin } from '../lib/api';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string, email?: string) => Promise<boolean>;
  logoutAdmin: () => void;

  isStaffAuthenticated: boolean;
  staffName: string | null;
  loginStaff: (code: string) => Promise<boolean>;
  logoutStaff: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Décode le payload d'un JWT (sans vérifier la signature — la vérification a déjà été
// faite côté serveur ; ici on lit juste l'expiration et le nom pour l'UI).
function decodeToken(token: string | null): any | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!decodeToken(localStorage.getItem('elegance_admin_token'));
  });

  const [staffPayload, setStaffPayload] = useState<any | null>(() => {
    return decodeToken(localStorage.getItem('elegance_staff_token'));
  });

  const loginAdmin = async (password: string, email = 'admin@elegancehair.dz'): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('elegance_admin_token', data.token);
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('elegance_admin_token');
    setIsAdminAuthenticated(false);
  };

  const loginStaff = async (code: string): Promise<boolean> => {
    try {
      const result = await apiStaffLogin(code);
      if (result.success && result.token) {
        localStorage.setItem('elegance_staff_token', result.token);
        setStaffPayload(decodeToken(result.token));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutStaff = () => {
    localStorage.removeItem('elegance_staff_token');
    setStaffPayload(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isStaffAuthenticated: !!staffPayload,
        staffName: staffPayload?.name || null,
        loginStaff,
        logoutStaff
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
