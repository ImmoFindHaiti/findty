export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/favicon.png" alt="" className="w-8 h-8 rounded" />
            <h3 className="text-xl font-bold text-green-400">Findty</h3>
          </div>
          <p className="text-gray-400 text-sm">Trouvez votre maison idéale sans vous déplacer. Location et achat immobilier en Haïti.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Liens rapides</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/biens" className="hover:text-green-400">Tous les biens</a></li>
            <li><a href="/biens?type=LOCATION" className="hover:text-green-400">Locations</a></li>
            <li><a href="/biens?type=VENTE" className="hover:text-green-400">Ventes</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>findtyhaiti@gmail.com</li>
            <li>+509 3763 1012</li>
            <li>Port-au-Prince, Haïti</li>
            <li className="text-gray-500 text-xs mt-2">Ce site a été designé par Mac Lane</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm px-4">
        &copy; {new Date().getFullYear()} Findty. Tous droits réservés.
      </div>
    </footer>
  );
}
