import { useState, useEffect } from 'react';
import { Loader2, Crown, AlertCircle, Trash2 } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setError(null);
    api.get('/admin/utilisateurs').then(res => setUsers(res.data.data)).catch(err => setError(err.response?.data?.message || 'Erreur de chargement')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const changerRole = async (id, role) => {
    try {
      await api.patch(`/admin/utilisateurs/${id}/role`, { role });
      toast.success('Rôle mis à jour');
      fetchUsers();
    } catch { toast.error('Erreur'); }
  };

  const togglePremium = async (id, current) => {
    try {
      const res = await api.patch(`/admin/utilisateurs/${id}/premium`, { premium: !current });
      toast.success(res.data.message);
      fetchUsers();
    } catch { toast.error('Erreur'); }
  };

  const supprimerUtilisateur = async (id, nom) => {
    if (!window.confirm(`Supprimer ${nom} ? Cette action est irréversible.`)) return;
    try {
      await api.delete(`/admin/utilisateurs/${id}`);
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3 text-red-700"><AlertCircle size={24} /><div><p className="font-semibold">Erreur</p><p className="text-sm">{error}</p></div></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr><th className="text-left p-4">Nom</th><th className="text-left p-4">Email</th><th className="text-left p-4">Rôle</th><th className="text-left p-4">Premium</th><th className="text-left p-4">Annonces</th><th className="text-left p-4">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{u.prenom} {u.nom}</td>
                <td className="p-4 text-gray-500 text-sm">{u.email}</td>
                <td className="p-4">
                  <select value={u.role} onChange={e => changerRole(u.id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                    <option value="UTILISATEUR">Utilisateur</option>
                    <option value="PROPRIETAIRE">Propriétaire</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  {u.role === 'PROPRIETAIRE' ? (
                    <button onClick={() => togglePremium(u.id, u.premium)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${u.premium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.premium ? <><Crown size={14} /> Premium</> : <><span className="text-gray-400">✕</span> Non</>}
                    </button>
                  ) : <span className="text-gray-400 text-xs">-</span>}
                </td>
                <td className="p-4">{u._count?.annonces || 0}</td>
                <td className="p-4 space-x-2">
                  {u.premiumExpiresAt && <span className="text-xs text-gray-400">Expire: {new Date(u.premiumExpiresAt).toLocaleDateString()}</span>}
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => supprimerUtilisateur(u.id, `${u.prenom} ${u.nom}`)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
