import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Loader2, Lock, Crown } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function MesAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnonces = () => api.get('/annonces/mes').then(res => setAnnonces(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { fetchAnnonces(); }, []);

  const supprimer = async id => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete(`/annonces/${id}`);
      toast.success('Annonce supprimée');
      fetchAnnonces();
    } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Mes annonces</h1>
        <Link to="/annonces/creer" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap">+ Nouvelle annonce</Link>
      </div>
      {annonces.length === 0 ? <p className="text-gray-500">Vous n'avez pas encore d'annonces.</p> : (
        <div className="space-y-4">
          {annonces.map(a => (
            <div key={a.id} className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${a.isLocked ? 'opacity-60 bg-gray-50' : ''}`}>
              <img src={a.bien.photos?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} alt="" className="w-full sm:w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{a.bien.titre}</h3>
                  {a.isLocked && <Lock size={14} className="text-red-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-500">{a.bien.ville} - {a.bien.prix.toLocaleString()} $</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.statut === 'ACTIVE' ? 'bg-green-100 text-green-700' : a.statut === 'INACTIVE' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>{a.statut}</span>
                  {a.isLocked && <span className="text-xs text-red-500">Verrouillée</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/annonces/${a.id}/edit`} className="p-2 hover:bg-gray-100 rounded"><Edit size={20} /></Link>
                <button onClick={() => supprimer(a.id)} className="p-2 hover:bg-red-100 rounded text-red-500"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
