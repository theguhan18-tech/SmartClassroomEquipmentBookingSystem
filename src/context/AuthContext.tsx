import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getStoredToken, setStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchDemoUser: (email: string, pass: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const stored = getStoredToken();
      if (!stored) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.getCurrentUser();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await login(email, pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
