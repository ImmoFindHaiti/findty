import { useState, useEffect } from 'react';
import { Trash2, Loader2, Lock, Unlock, Crown, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnonces = () => {
    setError(null);
    api.get('/admin/annonces').then(res => setAnnonces(res.data.data)).catch(err => setError(err.response?.data?.message || 'Erreur de chargement')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnnonces(); }, []);

  const toggleLock = async id => {
    try {
      const res = await api.patch(`/admin/annonces/${id}/lock`);
      toast.success(res.data.message);
      fetchAnnonces();
    } catch { toast.error('Erreur'); }
  };

  const supprimer = async id => {
    if (!confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      await api.delete(`/admin/annonces/${id}`);
      toast.success('Annonce supprimée');
      fetchAnnonces();
    } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3 text-red-700"><AlertCircle size={24} /><div><p className="font-semibold">Erreur</p><p className="text-sm">{error}</p></div></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Modération des annonces</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr><th className="text-left p-4">Titre</th><th className="text-left p-4">Propriétaire</th><th className="text-left p-4">Prix</th><th className="text-left p-4">Statut</th><th className="text-left p-4">Lock</th><th className="text-left p-4">Vues</th><th className="text-left p-4">Actions</th></tr>
          </thead>
          <tbody>
            {annonces.map(a => (
              <tr key={a.id} className={`border-t hover:bg-gray-50 ${a.isLocked ? 'bg-gray-100 text-gray-400' : ''}`}>
                <td className="p-4">{a.bien.titre}</td>
                <td className="p-4 text-sm">{a.proprietaire.prenom} {a.proprietaire.nom}{a.proprietaire.premium ? <Crown size={14} className="inline text-amber-500 ml-1" /> : ''}</td>
                <td className="p-4">{a.bien.prix.toLocaleString()} HTG</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${a.statut === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{a.statut}</span></td>
                <td className="p-4">{a.isLocked ? <Lock size={18} className="text-red-500" /> : <Unlock size={18} className="text-green-500" />}</td>
                <td className="p-4">{a.vues}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => toggleLock(a.id)} className={`p-2 rounded ${a.isLocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`} title={a.isLocked ? 'Déverrouiller' : 'Verrouiller'}>
                    {a.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                  </button>
                  <button onClick={() => supprimer(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
