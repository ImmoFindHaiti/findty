import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X, User, Heart, MessageCircle, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import useStore from '@/store/useStore';
import api from '@/services/api';

export default function Navbar() {
  const { user, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifPrompt, setNotifPrompt] = useState(false);

  useEffect(() => {
    if (user) {
      if (!localStorage.getItem('notifAsked')) {
        setNotifPrompt(true);
      }
      const checkNotifs = () => {
        api.get('/messages/non-lus').then(res => setNotifCount(res.data.data?.count || 0)).catch(() => {});
      };
      checkNotifs();
      const interval = setInterval(checkNotifs, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotifResponse = async accept => {
    localStorage.setItem('notifAsked', 'true');
    setNotifPrompt(false);
    if (accept && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted' && user) {
        try { await api.post('/notifications/preferences', { enabled: true }); } catch {}
      }
    } else if (user) {
      try { await api.post('/notifications/preferences', { enabled: false }); } catch {}
    }
  };

  const navLinks = user ? (
    <>
      <Link to="/favoris" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2" onClick={() => setMenuOpen(false)}><Heart size={18} />Favoris</Link>
      <Link to="/messages" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2 relative" onClick={() => setMenuOpen(false)}>
        <MessageCircle size={18} />Messages
        {notifCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">{notifCount}</span>}
      </Link>
      {user.role === 'PROPRIETAIRE' && (
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2" onClick={() => setMenuOpen(false)}><LayoutDashboard size={18} />Dashboard</Link>
      )}
      {user.role === 'ADMIN' && (
        <Link to="/admin" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2" onClick={() => setMenuOpen(false)}><Shield size={18} />Admin</Link>
      )}
    </>
  ) : (
    <>
      <Link to="/login" className="text-gray-700 hover:text-green-600 py-2" onClick={() => setMenuOpen(false)}>Connexion</Link>
      <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center" onClick={() => setMenuOpen(false)}>Inscription</Link>
    </>
  );

  return (
    <>
      {notifPrompt && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border p-5 z-50 max-w-xs animate-in slide-in-from-bottom">
          <p className="text-sm font-medium mb-3">Recevoir les notifications ?</p>
          <p className="text-xs text-gray-500 mb-4">Soyez averti quand vous recevez un message.</p>
          <div className="flex gap-2">
            <button onClick={() => handleNotifResponse(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Oui</button>
            <button onClick={() => handleNotifResponse(false)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">Non</button>
          </div>
        </div>
      )}

      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <img src="/favicon.png" alt="Findty" className="w-8 h-8 rounded" />
               <span className="text-xl font-bold text-green-600">Findty</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Haiti</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/biens" className="text-gray-700 hover:text-green-600 font-medium">Biens</Link>
              {navLinks}
              {user && (
                <div className="flex items-center gap-3 ml-2 border-l pl-4">
                  <Link to="/messages" className="relative">
                    <Bell size={20} className="text-gray-600 hover:text-green-600" />
                    {notifCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifCount}</span>}
                  </Link>
                  <Link to="/profil" className="flex items-center gap-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-green-500" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                        {user.prenom?.[0]}{user.nom?.[0]}
                      </div>
                    )}
                  </Link>
                  <button onClick={logout} className="text-gray-500 hover:text-red-500" title="Déconnexion"><LogOut size={18} /></button>
                </div>
              )}
            </div>

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
            <Link to="/biens" className="block text-gray-700 hover:text-green-600 py-2 font-medium" onClick={() => setMenuOpen(false)}>Biens</Link>
            {user && (
              <div className="flex items-center gap-3 py-2 border-b mb-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">{user.prenom?.[0]}{user.nom?.[0]}</div>
                )}
                <div><p className="font-medium">{user.prenom} {user.nom}</p><p className="text-xs text-gray-500">{user.role}</p></div>
              </div>
            )}
            {navLinks}
            {user && (
              <>
                <Link to="/profil" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2" onClick={() => setMenuOpen(false)}><User size={18} />Profil</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 text-red-500 py-2 w-full"><LogOut size={18} />Déconnexion</button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
