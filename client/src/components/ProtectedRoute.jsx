import { Navigate } from 'react-router-dom';
import useStore from '@/store/useStore';

export default function ProtectedRoute({ children, role }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
