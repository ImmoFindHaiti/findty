import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function EditAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/annonces/mes').then(res => {
      const annonce = res.data.data.find(a => a.id === id);
      if (!annonce) { toast.error('Annonce introuvable'); navigate('/mes-annonces'); return; }
      setForm({ ...annonce.bien });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/annonces/${id}`, form);
      toast.success('Annonce mise à jour');
      navigate('/mes-annonces');
    } catch { toast.error('Erreur'); }
  };

  if (loading || !form) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Modifier l'annonce</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Titre</label><input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Villa moderne, Studio meublé..." className="w-full border rounded-lg px-4 py-3" required /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Vue sur la mer, piscine, balcon..." className="w-full border rounded-lg px-4 py-3" rows={4} required /></div>
          <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-4 py-3"><option value="LOCATION">Location</option><option value="VENTE">Vente</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Prix ($)</label><input type="number" value={form.prix} onChange={e => setForm({ ...form, prix: parseFloat(e.target.value) })} placeholder="Ex: 15000" className="w-full border rounded-lg px-4 py-3" required /></div>
          <div><label className="block text-sm font-medium mb-1">Surface (m²)</label><input type="number" value={form.surface || ''} onChange={e => setForm({ ...form, surface: parseFloat(e.target.value) || null })} placeholder="Ex: 150" className="w-full border rounded-lg px-4 py-3" /></div>
          <div><label className="block text-sm font-medium mb-1">Chambres</label><input type="number" value={form.chambres || ''} onChange={e => setForm({ ...form, chambres: parseInt(e.target.value) || null })} placeholder="Ex: 3" className="w-full border rounded-lg px-4 py-3" /></div>
          <div><label className="block text-sm font-medium mb-1">Salles de bain</label><input type="number" value={form.sallesBain || ''} onChange={e => setForm({ ...form, sallesBain: parseInt(e.target.value) || null })} placeholder="Ex: 2" className="w-full border rounded-lg px-4 py-3" /></div>
          <div><label className="block text-sm font-medium mb-1">Ville</label><input type="text" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Ex: Pétion-Ville" className="w-full border rounded-lg px-4 py-3" required /></div>
          <div><label className="block text-sm font-medium mb-1">Quartier</label><input type="text" value={form.quartier || ''} onChange={e => setForm({ ...form, quartier: e.target.value })} placeholder="Ex: Bourdon" className="w-full border rounded-lg px-4 py-3" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Adresse</label><input type="text" value={form.localisation} onChange={e => setForm({ ...form, localisation: e.target.value })} placeholder="Ex: Rue Lamarre, #25" className="w-full border rounded-lg px-4 py-3" required /></div>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Mettre à jour</button>
      </form>
    </div>
  );
}
