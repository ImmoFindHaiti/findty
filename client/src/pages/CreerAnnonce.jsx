import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function CreerAnnonce() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: '', description: '', type: 'LOCATION', prix: '', surface: '', chambres: '', sallesBain: '', localisation: '', ville: '', quartier: '', latitude: '', longitude: '' });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async e => {
    e.preventDefault();
    if (photos.length < 5) return toast.error('Ajoutez au moins 5 photos');
    setLoading(true);
    try {
      const body = { ...form, prix: parseFloat(form.prix) || 0, surface: form.surface ? parseFloat(form.surface) : undefined, chambres: form.chambres ? parseInt(form.chambres) : undefined, sallesBain: form.sallesBain ? parseInt(form.sallesBain) : undefined, latitude: form.latitude ? parseFloat(form.latitude) : undefined, longitude: form.longitude ? parseFloat(form.longitude) : undefined };
      if (!body.prix || body.prix <= 0) return toast.error('Le prix doit être un nombre valide');
      const res = await api.post('/annonces', body);
      const fd = new FormData();
      fd.append('bienId', res.data.data.bienId || res.data.data.bien.id);
      photos.forEach(p => fd.append('photos', p));
      await api.post('/photos/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Annonce créée avec succès !');
      navigate('/mes-annonces');
    } catch (err) { const msg = err.response?.data?.errors?.map(e => e.message).join(', ') || err.response?.data?.message || 'Erreur'; toast.error(msg); }
    finally { setLoading(false); }
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nouvelle annonce</h1>
      <div className="flex gap-2 mb-6">
        <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Titre *</label><input type="text" value={form.titre} onChange={e => handleChange('titre', e.target.value)} placeholder="Ex: Petite maison, Villa moderne, Studio meublé..." className="w-full border rounded-lg px-4 py-3" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description *</label><textarea value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Ex: Vue sur la plage, piscine intégrée, balcon, 3 salons, avec meubles, cuisine équipée, proche des commerces..." className="w-full border rounded-lg px-4 py-3" rows={4} required /></div>
            <div><label className="block text-sm font-medium mb-1">Type *</label><select value={form.type} onChange={e => handleChange('type', e.target.value)} className="w-full border rounded-lg px-4 py-3"><option value="LOCATION">Location</option><option value="VENTE">Vente</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Prix ($) *</label><input type="number" value={form.prix} onChange={e => handleChange('prix', e.target.value)} placeholder="Ex: 15000 ou 250000" className="w-full border rounded-lg px-4 py-3" required /></div>
            <div><label className="block text-sm font-medium mb-1">Surface (m²)</label><input type="number" value={form.surface} onChange={e => handleChange('surface', e.target.value)} placeholder="Ex: 150" className="w-full border rounded-lg px-4 py-3" /></div>
            <div><label className="block text-sm font-medium mb-1">Chambres</label><input type="number" value={form.chambres} onChange={e => handleChange('chambres', e.target.value)} placeholder="Ex: 3" className="w-full border rounded-lg px-4 py-3" /></div>
            <div><label className="block text-sm font-medium mb-1">Salles de bain</label><input type="number" value={form.sallesBain} onChange={e => handleChange('sallesBain', e.target.value)} placeholder="Ex: 2" className="w-full border rounded-lg px-4 py-3" /></div>
            <div><label className="block text-sm font-medium mb-1">Ville *</label><input type="text" value={form.ville} onChange={e => handleChange('ville', e.target.value)} placeholder="Ex: Port-au-Prince, Pétion-Ville" className="w-full border rounded-lg px-4 py-3" required /></div>
            <div><label className="block text-sm font-medium mb-1">Quartier</label><input type="text" value={form.quartier} onChange={e => handleChange('quartier', e.target.value)} placeholder="Ex: Bourdon, Bois-Verna" className="w-full border rounded-lg px-4 py-3" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Adresse *</label><input type="text" value={form.localisation} onChange={e => handleChange('localisation', e.target.value)} placeholder="Ex: Rue Lamarre, #25, Pétion-Ville" className="w-full border rounded-lg px-4 py-3" required /></div>
            <button type="button" onClick={() => setStep(2)} className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Suivant : Photos</button>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Photos (minimum 5) *</label>
              <input type="file" multiple accept="image/*" onChange={e => setPhotos([...photos, ...Array.from(e.target.files)])} className="w-full border rounded-lg px-4 py-3" />
              <div className="grid grid-cols-5 gap-2 mt-3">
                {photos.map((f, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{photos.length}/5 minimum</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300">Retour</button>
              <button type="submit" disabled={loading || photos.length < 5} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Création...' : 'Publier l\'annonce'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
