import { Link } from 'react-router-dom';
import { Home, MapPin, Heart, Lock } from 'lucide-react';
import BudgetProgressBar from './BudgetProgressBar';
import useStore from '@/store/useStore';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function PropertyCard({ bien, isFavorited = false, onToggleFav }) {
  const budget = useStore(s => s.budget);
  const user = useStore(s => s.user);
  const isLocked = bien.annonce?.isLocked || false;
  const photo = bien.photos?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400';

  const toggleFav = async e => {
    e.preventDefault();
    if (!user) return toast.error('Connectez-vous pour ajouter aux favoris');
    try {
      if (isFavorited) {
        await api.delete(`/favoris/${bien.annonce?.id}`);
        onToggleFav?.(bien.annonce?.id, false);
        toast.success('Retiré des favoris');
      } else {
        await api.post(`/favoris/${bien.annonce?.id}`);
        onToggleFav?.(bien.annonce?.id, true);
        toast.success('Ajouté aux favoris');
      }
    } catch { toast.error('Erreur'); }
  };

  if (isLocked) {
    return (
      <div className="bg-gray-100 rounded-xl shadow overflow-hidden opacity-60 pointer-events-none">
        <div className="relative h-48 bg-gray-300 flex items-center justify-center">
          <Lock size={40} className="text-gray-400" />
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-400 truncate">{bien.titre}</h3>
          <p className="text-gray-400 text-sm">Annonce verrouillée</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/biens/${bien.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img src={photo} alt={bien.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${bien.type === 'LOCATION' ? 'bg-blue-500' : 'bg-purple-500'}`}>
            {bien.type === 'LOCATION' ? 'Location' : 'Vente'}
          </span>
          <button onClick={toggleFav} className={`absolute top-3 left-3 p-2 rounded-full bg-white/80 hover:bg-white transition ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}>
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 truncate">{bien.titre}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm"><MapPin size={14} /><span>{bien.ville}{bien.quartier ? `, ${bien.quartier}` : ''}</span></div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {bien.surface && <span>{bien.surface} m²</span>}
            {bien.chambres && <span className="flex items-center gap-1"><Home size={14} />{bien.chambres} ch.</span>}
          </div>
          <BudgetProgressBar prix={bien.prix} budget={budget} />
          <div className="text-lg font-bold text-green-600">{bien.prix.toLocaleString()} HTG{bien.type === 'LOCATION' ? '/mois' : ''}</div>
        </div>
      </div>
    </Link>
  );
}
