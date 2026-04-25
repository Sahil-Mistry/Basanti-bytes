import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_TOKEN_KEY } from '../lib/apiClient';

export default function RequireAuth() {
  const location = useLocation();
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
