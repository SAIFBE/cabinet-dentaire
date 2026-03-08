import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { sessionStore } from './sessionStore';
import { authApi } from '../../services/api/authApi';

export const AuthContext = createContext(null);

/**
 * AuthProvider — SECURITY:
 * - Auth state is kept in-memory only (useState)
 * - No tokens in localStorage or sessionStorage
 * - sessionStore only persists a non-sensitive restore flag + role/name
 * - logout clears everything
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null);

  // Expose logout to interceptors without circular deps
  const logout = useCallback(() => {
    setUser(null);
    sessionStore.clear();
    authApi.logout();
  }, []);

  logoutRef.current = logout;

  // Restore session on boot — reads minimal info from sessionStorage
  useEffect(() => {
    const restored = sessionStore.restore();
    if (restored && restored.role) {
      setUser({
        name: restored.name,
        role: restored.role,
        // No token — this is just for UI state restoration
      });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    const loggedUser = {
      name: result.user.name,
      role: result.user.role,
    };
    setUser(loggedUser);
    sessionStore.save(loggedUser);
    return loggedUser;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    logoutRef,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
