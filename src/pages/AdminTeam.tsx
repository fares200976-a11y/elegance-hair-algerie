import React, { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, Trash2, Power, Copy, Check, Link as LinkIcon, ExternalLink, Pencil, Save, X, Phone, MessageCircle, Mail } from 'lucide-react';
import { fetchTeamMembers, createTeamMember, updateTeamMember, regenerateTeamMemberCode, setTeamMemberActive, deleteTeamMember } from '../lib/api';
import { TeamMember } from '../types';

export const AdminTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Formulaire d'ajout
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Édition inline des contacts d'un membre existant
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const staffUrl = `${window.location.origin}/staff`;

  const handleCopyStaffLink = () => {
    navigator.clipboard?.writeText(staffUrl).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

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
      const created = await createTeamMember({
        name: newName.trim(),
        phone: newPhone.trim() || undefined,
        whatsapp: newWhatsapp.trim() || undefined,
        email: newEmail.trim() || undefined
      });
      setMembers(prev => [created, ...prev]);
      setNewName('');
      setNewPhone('');
      setNewWhatsapp('');
      setNewEmail('');
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

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditPhone(member.phone || '');
    setEditWhatsapp(member.whatsapp || '');
    setEditEmail(member.email || '');
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    try {
      const updated = await updateTeamMember(id, {
        phone: editPhone.trim() || undefined,
        whatsapp: editWhatsapp.trim() || undefined,
        email: editEmail.trim() || undefined
      });
      setMembers(prev => prev.map(m => (m.id === id ? updated : m)));
      setEditingId(null);
    } catch (err) {
      console.error('Erreur mise à jour contacts:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
            Mon Équipe ({members.length})
          </h1>
          <p className="text-xs text-neutral-500">
            Créez un code d'accès pour chaque employé. Ajoutez son téléphone, WhatsApp et email pour qu'il reçoive automatiquement l'alarme des nouvelles commandes (par email). Le lien de connexion est tout en bas de la page.
          </p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nom (ex: Karim)"
            className="p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
          />
          <input
            type="tel"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
            placeholder="Téléphone (optionnel)"
            className="p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
          />
          <input
            type="tel"
            value={newWhatsapp}
            onChange={e => setNewWhatsapp(e.target.value)}
            placeholder="WhatsApp (optionnel)"
            className="p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
          />
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="Email (optionnel)"
            className="p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-amber-500"
          />
        </div>
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
                <th className="p-4">Contacts</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-400">Chargement...</td></tr>
              )}
              {!isLoading && members.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-400">Aucun membre pour le moment.</td></tr>
              )}
              {members.map(member => (
                <tr key={member.id} className="hover:bg-neutral-50 align-top">
                  <td className="p-4 font-bold text-neutral-900">
                    <span className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      {member.name}
                    </span>
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
                  <td className="p-4 min-w-[220px]">
                    {editingId === member.id ? (
                      <div className="space-y-1.5">
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          placeholder="Téléphone"
                          className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="tel"
                          value={editWhatsapp}
                          onChange={e => setEditWhatsapp(e.target.value)}
                          placeholder="WhatsApp"
                          className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-[11px] outline-none focus:border-amber-500"
                        />
                        <div className="flex gap-1.5 pt-1">
                          <button onClick={() => saveEdit(member.id)} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg" title="Enregistrer">
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg" title="Annuler">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-[11px] text-neutral-600">
                        {member.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-neutral-400" />{member.phone}</div>}
                        {member.whatsapp && <div className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 text-emerald-500" />{member.whatsapp}</div>}
                        {member.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-neutral-400" />{member.email}</div>}
                        {!member.phone && !member.whatsapp && !member.email && <span className="text-neutral-400">Aucun contact</span>}
                        <button onClick={() => startEdit(member)} className="text-amber-700 font-bold flex items-center gap-1 mt-1 hover:underline">
                          <Pencil className="w-3 h-3" /> Modifier
                        </button>
                      </div>
                    )}
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

      {/* Lien à envoyer à l'équipe */}
      <div className="bg-neutral-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <LinkIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wide block">Lien de connexion équipe</span>
            <span className="text-white font-mono text-sm break-all">{staffUrl}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyStaffLink}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
          >
            {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {linkCopied ? 'Copié !' : 'Copier le lien'}
          </button>
          <a
            href="/staff"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir
          </a>
        </div>
      </div>
    </div>
  );
};
