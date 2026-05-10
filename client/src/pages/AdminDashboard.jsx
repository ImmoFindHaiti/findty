import { Link } from 'react-router-dom';
import { Users, Home, Shield, Lock } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/utilisateurs" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
          <Users size={32} className="text-blue-500" /><div><p className="font-semibold text-lg">Utilisateurs</p><p className="text-gray-500 text-sm">Gérer les utilisateurs et Premium</p></div>
        </Link>
        <Link to="/admin/annonces" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
          <Home size={32} className="text-purple-500" /><div><p className="font-semibold text-lg">Annonces</p><p className="text-gray-500 text-sm">Modérer et verrouiller les annonces</p></div>
        </Link>
      </div>
    </div>
  );
}
