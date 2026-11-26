import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, registerUser } from '../services/authService';
import { TOKEN_STORAGE_KEY } from '../services/httpClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));

  const persistSession = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function hydrateUser() {
      try {
        const profile = await getProfile(token);
        if (!cancelled) setUser(profile);
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrateUser();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const login = useCallback(
    async (credentials) => {
      const session = await loginUser(credentials);
      persistSession(session);
      return session.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (data) => {
      const session = await registerUser(data);
      persistSession(session);
      return session.user;
    },
    [persistSession]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.rol === 'admin',
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
