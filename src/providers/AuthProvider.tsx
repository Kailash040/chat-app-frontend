import { getToken, login as loginApi, logout as logoutApi, register as registerApi, type User } from '@/src/services/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      // If token exists, backend will accept it. We might add /me later to fetch user.
      // For now, keep user null until login/register returns user.
      setInitializing(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser } = await loginApi(email, password);
    setUser(loggedInUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: registeredUser } = await registerApi(name, email, password);
    setUser(registeredUser);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, initializing, login, register, logout, setUser }), [user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


