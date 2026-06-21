import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAdmin() {
  const { user, token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

