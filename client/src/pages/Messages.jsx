import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/conversations').then(res => setConversations(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><MessageCircle /> Mes conversations</h1>
      {conversations.length === 0 ? (
        <p className="text-gray-500">Aucune conversation pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {conversations.map(conv => (
            <Link key={conv.annonce.id} to={`/messages/${conv.annonce.id}`} className="block bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{conv.annonce.bien.titre}</p>
                  <p className="text-sm text-gray-500">{conv.dernierMessage.contenu.substring(0, 60)}...</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>{conv.expediteur.prenom} {conv.expediteur.nom}</p>
                  <p>{new Date(conv.dernierMessage.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
