import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Home, Bath, Ruler, Loader2, MessageCircle, Heart, Lock } from 'lucide-react';
import api from '@/services/api';
import BudgetProgressBar from '@/components/property/BudgetProgressBar';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

export default function BienDetail() {
  const { id } = useParams();
  const { user, budget } = useStore();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    api.get(`/biens/${id}`).then(res => {
      setBien(res.data.data);
      api.get('/favoris').then(r => {
        if (r.data.data?.some(f => f.annonceId === res.data.data.annonce?.id)) setFaved(true);
      }).catch(() => {});
    }).finally(() => setLoading(false));
  }, [id]);

  const envoyerMessage = async () => {
    if (!message.trim()) return;
    try {
      await api.post('/messages', { contenu: message, destinataireId: bien.annonce.proprietaire.id, annonceId: bien.annonce.id });
      toast.success('Message envoyé !');
      if (user?.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Message envoyé', { body: 'Votre message a bien été transmis.' });
      }
      setMessage('');
    } catch { toast.error('Erreur lors de l\'envoi'); }
  };

  const toggleFav = async () => {
    if (!user) return toast.error('Connectez-vous pour ajouter aux favoris');
    try {
      if (faved) { await api.delete(`/favoris/${bien.annonce.id}`); setFaved(false); toast.success('Retiré des favoris'); }
      else { await api.post(`/favoris/${bien.annonce.id}`); setFaved(true); toast.success('Ajouté aux favoris'); }
    } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;
  if (!bien) return <div className="text-center py-20">Bien introuvable</div>;

  const isLocked = bien.annonce?.isLocked;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isLocked && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Lock className="text-red-500" /><p className="text-red-700 font-medium">Cette annonce est verrouillée par l'administrateur.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`relative h-96 rounded-xl overflow-hidden mb-4 ${isLocked ? 'opacity-50' : ''}`}>
            <img src={bien.photos?.[photoIndex]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} alt={bien.titre} className="w-full h-full object-cover" />
            <span className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold text-white ${bien.type === 'LOCATION' ? 'bg-blue-500' : 'bg-purple-500'}`}>
              {bien.type === 'LOCATION' ? 'Location' : 'Vente'}
            </span>
          </div>
          {bien.photos?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {bien.photos.map((photo, i) => (
                <img key={photo.id} src={photo.url} alt="" className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${i === photoIndex ? 'ring-2 ring-green-500' : 'opacity-70'}`} onClick={() => setPhotoIndex(i)} />
              ))}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{bien.titre}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-4"><MapPin size={18} /><span>{bien.localisation}</span></div>
          <div className="flex gap-6 mb-6 text-gray-700 flex-wrap">
            {bien.surface && <span className="flex items-center gap-1"><Ruler size={18} />{bien.surface} m²</span>}
            {bien.chambres && <span className="flex items-center gap-1"><Home size={18} />{bien.chambres} ch.</span>}
            {bien.sallesBain && <span className="flex items-center gap-1"><Bath size={18} />{bien.sallesBain} sdb</span>}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{bien.description}</p>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-4">
            <BudgetProgressBar prix={bien.prix} budget={budget} />
            <div className="text-3xl font-bold text-green-600">{bien.prix.toLocaleString()} ${bien.type === 'LOCATION' ? '/mois' : ''}</div>

            {user && (
              <button onClick={toggleFav} className={`w-full py-2 rounded-lg border flex items-center justify-center gap-2 ${faved ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-gray-50'}`}>
                <Heart size={18} fill={faved ? 'currentColor' : 'none'} />{faved ? 'Dans mes favoris' : 'Ajouter aux favoris'}
              </button>
            )}

            {bien.annonce?.proprietaire && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Propriétaire</h3>
                <p className="text-gray-700">{bien.annonce.proprietaire.prenom} {bien.annonce.proprietaire.nom}</p>
                <p className="text-gray-500 text-sm">{bien.annonce.proprietaire.telephone}</p>
              </div>
            )}

            {user && user.id !== bien.annonce?.proprietaire?.id && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Contacter le propriétaire</h3>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Bonjour, je suis intéressé par ce bien. Pourriez-vous me donner plus d'informations ?" className="w-full border rounded-lg p-3 text-sm mb-2" rows={3} />
                <button onClick={envoyerMessage} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"><MessageCircle size={18} /> Envoyer</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
