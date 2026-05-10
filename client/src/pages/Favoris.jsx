import { useState, useEffect, useCallback } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import api from '@/services/api';
import PropertyGrid from '@/components/property/PropertyGrid';

export default function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoris = useCallback(() => {
    api.get('/favoris').then(res => setFavoris(res.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchFavoris(); }, [fetchFavoris]);

  const handleToggleFav = (annonceId, isFav) => {
    if (!isFav) {
      setFavoris(prev => prev.filter(f => f.annonceId !== annonceId));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

  const biens = favoris.map(f => f.annonce.bien);
  const favoritedIds = new Set(favoris.map(f => f.annonceId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Heart className="text-red-500" /> Mes favoris</h1>
      {biens.length === 0 ? <p className="text-gray-500">Vous n'avez pas encore de favoris.</p> : <PropertyGrid biens={biens} favoritedIds={favoritedIds} onToggleFav={handleToggleFav} />}
    </div>
  );
}
