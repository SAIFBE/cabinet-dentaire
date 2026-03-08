import { Navigate } from 'react-router-dom';
import { useAuth } from '../../security/auth/useAuth';
import { Spinner } from '../../shared/components/Spinner';

/**
 * ProtectedRoute — SECURITY:
 * Blocks unauthenticated users from private routes.
 * Redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
