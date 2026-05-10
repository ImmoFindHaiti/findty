import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
import api from '@/services/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

export default function Conversation() {
  const { id: annonceId } = useParams();
  const { user } = useStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contenu, setContenu] = useState('');
  const bottomRef = useRef(null);
  const prevCount = useRef(0);

  const fetchMessages = () => {
    api.get(`/messages/conversation/${annonceId}`).then(res => {
      const msgs = res.data.data;
      if (prevCount.current > 0 && msgs.length > prevCount.current && 'Notification' in window && Notification.permission === 'granted') {
        const last = msgs[msgs.length - 1];
        if (last.expediteur.id !== user.id) {
          new Notification('Nouveau message', { body: `${last.expediteur.prenom}: ${last.contenu.substring(0, 50)}...`, icon: '/favicon.png' });
        }
      }
      prevCount.current = msgs.length;
      setMessages(msgs);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [annonceId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const envoyer = async () => {
    if (!contenu.trim()) return;
    const dest = messages.find(m => m.expediteur.id !== user.id)?.expediteur;
    if (!dest) return toast.error('Destinataire introuvable');
    try {
      const res = await api.post('/messages', { contenu, destinataireId: dest.id, annonceId });
      setMessages(prev => [...prev, res.data.data]);
      setContenu('');
    } catch { toast.error('Erreur d\'envoi'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-4 h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {messages.length === 0 && <p className="text-gray-400 text-center mt-20">Aucun message. Envoyez le premier message.</p>}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.expediteur.id === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg p-3 ${msg.expediteur.id === user.id ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                <p className="break-words">{msg.contenu}</p>
                <p className={`text-xs mt-1 ${msg.expediteur.id === user.id ? 'text-green-200' : 'text-gray-400'}`}>{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2 border-t pt-4">
          <input value={contenu} onChange={e => setContenu(e.target.value)} onKeyDown={e => e.key === 'Enter' && envoyer()} placeholder="Votre message..." className="flex-1 border rounded-lg px-4 py-3" />
          <button onClick={envoyer} className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
}
