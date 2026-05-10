import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

export default function Register() {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', telephone: '', role: 'UTILISATEUR' });
  const [acceptPremium, setAcceptPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.role === 'PROPRIETAIRE' && !acceptPremium) {
      return toast.error('Veuillez accepter les conditions Premium');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setUser(res.data.data.user, res.data.data.token);
      toast.success(res.data.message || 'Inscription réussie !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur d\'inscription');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Nom</label><input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Dupont" className="w-full border rounded-lg px-4 py-3" required /></div>
            <div><label className="block text-sm font-medium mb-1">Prénom</label><input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Jean" className="w-full border rounded-lg px-4 py-3" required /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" className="w-full border rounded-lg px-4 py-3" required /></div>
          <div><label className="block text-sm font-medium mb-1">Mot de passe (min 6 car.)</label><input type="password" value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} placeholder="••••••" className="w-full border rounded-lg px-4 py-3" required /></div>
          <div><label className="block text-sm font-medium mb-1">Téléphone</label><input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+509 1234 5678" className="w-full border rounded-lg px-4 py-3" /></div>
          <div><label className="block text-sm font-medium mb-1">Je suis</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-4 py-3">
              <option value="UTILISATEUR">Locataire / Acheteur</option>
              <option value="PROPRIETAIRE">Propriétaire / Agent immobilier</option>
            </select>
          </div>

          {form.role === 'PROPRIETAIRE' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-800">Compte Propriétaire Premium</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>✓ 1 mois gratuit offert</li>
                <li>✓ Publiez vos annonces immobilières</li>
                <li>✓ Recevez les messages des clients</li>
                <li className="font-medium">💰 1 000 HTG/mois après le 1er mois</li>
              </ul>
              <label className="flex items-start gap-2 text-sm text-amber-800">
                <input type="checkbox" checked={acceptPremium} onChange={e => setAcceptPremium(e.target.checked)} className="mt-1" />
                <span>J'accepte les conditions. Je passe en Premium (1 mois offert, puis 1 000 HTG/mois). Aucune transaction sur le site.</span>
              </label>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Inscription...' : form.role === 'PROPRIETAIRE' ? 'Créer mon compte Propriétaire' : 'Créer mon compte'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ? <Link to="/login" className="text-green-600 hover:underline">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}
