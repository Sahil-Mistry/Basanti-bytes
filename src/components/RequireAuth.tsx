import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredAuthToken } from '../lib/apiClient';

export default function RequireAuth() {
  const location = useLocation();
  const token = getStoredAuthToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
