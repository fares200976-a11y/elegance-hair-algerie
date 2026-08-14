import React, { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, Trash2, Power, Copy, Check } from 'lucide-react';
import { fetchTeamMembers, createTeamMember, regenerateTeamMemberCode, setTeamMemberActive, deleteTeamMember } from '../lib/api';
import { TeamMember } from '../types';

export const AdminTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTeamMembers();
      setMembers(data || []);
    } catch (err) {
      console.error('Erreur chargement équipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await createTeamMember(newName.trim());
      setMembers(prev => [created, ...prev]);
      setNewName('');
    } catch (err) {
      console.error('Erreur ajout membre:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerate = async (id: string) => {
    try {
      const updated = await regenerateTeamMemberCode(id);
      setMembers(prev => prev.map(m => (m.id === id ? updated : m)));
    } catch (err) {
      console.error('Erreur régénération code:', err);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const updated = await setTeamMemberActive(member.id, !member.active);
      setMembers(prev => prev.map(m => (m.id === member.id ? updated : m)));
    } catch (err) {
      console.error('Erreur activation/désactivation:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce membre de l\'équipe ?')) return;
    try {
      await deleteTeamMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Erreur suppression membre:', err);
    }
  };

  const handleCopyCode = (member: TeamMember) => {
    navigator.clipboard?.writeText(member.code).catch(() => {});
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Mon Équipe ({members.length})
          </h1>
          <p className="text-xs text-neutral-500">
            Créez un code d'accès pour chaque employé. Ils l'utilisent sur <span className="font-mono font-bold">/staff</span> pour consulter et traiter les commandes, sans accès aux produits ni aux paramètres.
          </p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nom de l'employé (ex: Karim)"
          className="flex-1 p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newName.trim()}
          className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Ajouter à l'équipe
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 text-amber-200 uppercase font-bold text-[11px]">
                <th className="p-4">Nom</th>
                <th className="p-4">Code d'accès</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading && (
                <tr><td colSpan={4} className="p-6 text-center text-neutral-400">Chargement...</td></tr>
              )}
              {!isLoading && members.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-neutral-400">Aucun membre pour le moment.</td></tr>
              )}
              {members.map(member => (
                <tr key={member.id} className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-neutral-900 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {member.name}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleCopyCode(member)}
                      className="font-mono font-bold text-sm bg-neutral-100 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-neutral-200"
                      title="Copier le code"
                    >
                      {member.code}
                      {copiedId === member.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${member.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                      {member.active ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleRegenerate(member.id)}
                      className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg"
                      title="Régénérer le code"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(member)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg"
                      title={member.active ? 'Désactiver' : 'Activer'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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
