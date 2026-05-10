import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/services/api';
import FilterBar from '@/components/property/FilterBar';
import PropertyGrid from '@/components/property/PropertyGrid';
import { Loader2 } from 'lucide-react';
import useStore from '@/store/useStore';

export default function Biens() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [biens, setBiens] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const user = useStore(s => s.user);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || undefined,
    budgetMax: searchParams.get('budgetMax') ? parseInt(searchParams.get('budgetMax')) : undefined,
    ville: searchParams.get('ville') || undefined,
    chambres: searchParams.get('chambres') ? parseInt(searchParams.get('chambres')) : undefined
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) {
      api.get('/favoris').then(res => {
        setFavoritedIds(new Set(res.data.data.map(f => f.annonceId)));
      }).catch(() => {});
    } else {
      setFavoritedIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.budgetMax) params.set('budgetMax', filters.budgetMax);
    if (filters.ville) params.set('ville', filters.ville);
    if (filters.chambres) params.set('chambres', filters.chambres);
    params.set('page', page);
    setSearchParams(params);

    setLoading(true);
    api.get('/biens', { params }).then(res => {
      setBiens(res.data.data);
      setMeta(res.data.meta);
    }).finally(() => setLoading(false));
  }, [filters, page]);

  const handleToggleFav = (annonceId, isFav) => {
    setFavoritedIds(prev => {
      const next = new Set(prev);
      if (isFav) next.add(annonceId);
      else next.delete(annonceId);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trouvez votre bien</h1>
      <FilterBar filters={filters} onChange={f => { setFilters(f); setPage(1); }} />
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>
      ) : biens.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><p className="text-xl">Aucun bien trouvé</p><p>Essayez de modifier vos filtres.</p></div>
      ) : (
        <>
          <PropertyGrid biens={biens} favoritedIds={favoritedIds} onToggleFav={handleToggleFav} />
          {meta && meta.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: meta.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 rounded-lg ${page === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
