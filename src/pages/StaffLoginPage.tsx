import React, { useState } from 'react';
import { KeyRound, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff } = useAuth();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const success = await loginStaff(code.trim());
    if (!success) {
      setErrorMsg('Code invalide ou inactif.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Users className="w-7 h-7 text-neutral-950" />
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-neutral-900">Espace Équipe</h1>
          <p className="text-xs text-neutral-500">
            Saisissez votre code d'accès pour consulter et traiter les commandes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-100 text-rose-900 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">Code d'accès</label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Ex : 001122"
              className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-center tracking-widest font-mono font-bold outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Connexion...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>ACCÉDER AUX COMMANDES</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
