import { Link } from 'react-router-dom';
import { Search, HomeIcon, TrendingUp, Shield, Play, X } from 'lucide-react';
import useStore from '@/store/useStore';
import { useState } from 'react';

export default function Home() {
  const { budget, setBudget } = useStore();
  const [searchVille, setSearchVille] = useState('');
  const [showVideo, setShowVideo] = useState(true);

  return (
    <div>
      {showVideo && (
        <div className="relative bg-black">
          <video className="w-full max-h-[70vh] object-cover" src="/intro.mp4" autoPlay muted controls={false} playsInline onEnded={() => setShowVideo(false)} />
          <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"><X size={20} /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">Findty — Cliquez pour passer</div>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Trouvez votre maison idéale</h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8">Sans vous déplacer. En un clic.</p>

          <div className="max-w-2xl mx-auto bg-white rounded-xl p-4 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="text" placeholder="Ville, quartier..." value={searchVille} onChange={e => setSearchVille(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-gray-800" />
              </div>
              <div className="flex-1">
                <input type="number" placeholder="Votre budget max ($)" value={budget || ''} onChange={e => setBudget(parseInt(e.target.value) || null)} className="w-full px-4 py-3 border rounded-lg text-gray-800" />
              </div>
              <Link to={`/biens?ville=${searchVille}&budgetMax=${budget || ''}`} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 text-center whitespace-nowrap">
                Rechercher
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="text-green-600" size={28} /></div>
              <h3 className="text-xl font-semibold mb-2">1. Entrez votre budget</h3>
              <p className="text-gray-600">Indiquez combien vous pouvez dépenser pour votre futur logement.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><HomeIcon className="text-green-600" size={28} /></div>
              <h3 className="text-xl font-semibold mb-2">2. Parcourez les biens</h3>
              <p className="text-gray-600">Visualisez instantanément les biens dans votre budget grâce aux barres colorées.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp className="text-green-600" size={28} /></div>
              <h3 className="text-xl font-semibold mb-2">3. Contactez le propriétaire</h3>
              <p className="text-gray-600">Envoyez un message directement depuis l'application sans vous déplacer.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/biens" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">Visionner les biens</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
