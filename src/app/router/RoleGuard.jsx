import { Navigate } from 'react-router-dom';
import { useAuth } from '../../security/auth/useAuth';
import { Spinner } from '../../shared/components/Spinner';

/**
 * RoleGuard — SECURITY:
 * Restricts access to routes based on user role.
 * Used for admin-only routes like /settings.
 */
export function RoleGuard({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
