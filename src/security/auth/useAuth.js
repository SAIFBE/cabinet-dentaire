import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

/**
 * useAuth hook — provides user, login, logout, isAuthenticated, loading.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
