import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, username?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('synapse_token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('synapse_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = (newToken: string, username?: string) => {
    setToken(newToken);
    localStorage.setItem('synapse_token', newToken);
    if (username) {
      const u: User = { _id: '', username };
      setUser(u);
      localStorage.setItem('synapse_user', JSON.stringify(u));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('synapse_token');
    localStorage.removeItem('synapse_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exported as a named hook — satisfies react-refresh/only-export-components
// by being in the same file as AuthProvider (both are exports)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
