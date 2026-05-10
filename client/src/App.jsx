import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Biens from '@/pages/Biens';
import BienDetail from '@/pages/BienDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Favoris from '@/pages/Favoris';
import Messages from '@/pages/Messages';
import Conversation from '@/pages/Conversation';
import Profil from '@/pages/Profil';
import Dashboard from '@/pages/Dashboard';
import MesAnnonces from '@/pages/MesAnnonces';
import CreerAnnonce from '@/pages/CreerAnnonce';
import EditAnnonce from '@/pages/EditAnnonce';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUtilisateurs from '@/pages/AdminUtilisateurs';
import AdminAnnonces from '@/pages/AdminAnnonces';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biens" element={<Biens />} />
          <Route path="/biens/:id" element={<BienDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favoris" element={<ProtectedRoute><Favoris /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="PROPRIETAIRE"><Dashboard /></ProtectedRoute>} />
          <Route path="/mes-annonces" element={<ProtectedRoute role="PROPRIETAIRE"><MesAnnonces /></ProtectedRoute>} />
          <Route path="/annonces/creer" element={<ProtectedRoute role="PROPRIETAIRE"><CreerAnnonce /></ProtectedRoute>} />
          <Route path="/annonces/:id/edit" element={<ProtectedRoute role="PROPRIETAIRE"><EditAnnonce /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/utilisateurs" element={<ProtectedRoute role="ADMIN"><AdminUtilisateurs /></ProtectedRoute>} />
          <Route path="/admin/annonces" element={<ProtectedRoute role="ADMIN"><AdminAnnonces /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
