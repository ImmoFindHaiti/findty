import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Home, MessageCircle, PlusCircle, List, Lock, Crown, Loader2 } from 'lucide-react';
import api from '@/services/api';
import useStore from '@/store/useStore';

export default function Dashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications/dashboard-stats').then(res => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        {user?.premium ? (
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Crown size={14} />Premium</span>
        ) : (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Lock size={14} />Bloqué</span>
        )}
      </div>

      {!user?.premium && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">Votre abonnement Premium a expiré. Contactez l'administrateur pour réactiver vos annonces.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-4"><BarChart3 className="text-green-600" size={32} /><div><p className="text-2xl font-bold">{stats?.totalVues || 0}</p><p className="text-gray-500">Vues totales</p></div></div></div>
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-4"><MessageCircle className="text-blue-500" size={32} /><div><p className="text-2xl font-bold">{stats?.messagesRecus || 0}</p><p className="text-gray-500">Messages reçus</p><p className="text-xs text-red-500">{stats?.messagesNonLus > 0 ? `${stats.messagesNonLus} non lus` : ''}</p></div></div></div>
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-4"><Home className="text-purple-500" size={32} /><div><p className="text-2xl font-bold">{stats?.annonces || 0}</p><p className="text-gray-500">Annonces</p></div></div></div>
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-4"><List className="text-orange-500" size={32} /><div><p className="text-2xl font-bold">{stats?.annoncesActives || 0}</p><p className="text-gray-500">Actives</p></div></div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/mes-annonces" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
          <List size={32} className="text-green-600" /><div><p className="font-semibold text-lg">Mes annonces</p><p className="text-gray-500 text-sm">Gérer vos annonces</p></div>
        </Link>
        <Link to="/annonces/creer" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
          <PlusCircle size={32} className="text-green-600" /><div><p className="font-semibold text-lg">Nouvelle annonce</p><p className="text-gray-500 text-sm">Publier un bien</p></div>
        </Link>
        <Link to="/messages" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
          <MessageCircle size={32} className="text-blue-500" /><div><p className="font-semibold text-lg">Messages</p><p className="text-gray-500 text-sm">{stats?.messagesNonLus > 0 ? `${stats.messagesNonLus} message(s) non lu(s)` : 'Voir les messages'}</p></div>
        </Link>
      </div>
    </div>
  );
}
