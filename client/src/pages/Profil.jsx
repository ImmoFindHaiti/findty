import { useState, useRef } from 'react';
import api from '@/services/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

export default function Profil() {
  const { user, setUser } = useStore();
  const [form, setForm] = useState({ nom: user?.nom || '', prenom: user?.prenom || '', telephone: user?.telephone || '' });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const fileRef = useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', form.nom);
      fd.append('prenom', form.prenom);
      fd.append('telephone', form.telephone);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await api.put('/auth/profil', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser({ ...user, ...res.data.data }, localStorage.getItem('token'));
      toast.success('Profil mis à jour');
    } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setPreview(URL.createObjectURL(file)); }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            {preview ? (
              <img src={preview} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-green-500" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700"><Camera size={16} /></button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <p className="text-xs text-gray-500 mt-2">Photo de profil</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Nom</label><input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Dupont" className="w-full border rounded-lg px-4 py-3" required /></div>
          <div><label className="block text-sm font-medium mb-1">Prénom</label><input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Jean" className="w-full border rounded-lg px-4 py-3" required /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={user?.email || ''} className="w-full border rounded-lg px-4 py-3 bg-gray-50" disabled /></div>
        <div><label className="block text-sm font-medium mb-1">Téléphone</label><input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+509 1234 5678" className="w-full border rounded-lg px-4 py-3" /></div>

        {user?.role === 'PROPRIETAIRE' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800">Statut Premium</p>
            <p className="text-xs text-amber-700">{user.premium ? '✅ Premium actif' : '❌ Premium inactif — contactez l\'admin'}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}
