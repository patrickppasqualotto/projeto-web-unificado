import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem, removeItem } from './storage';

type User = {
  id: number | string;
  name: string;
  email: string;
  id_perfil?: number;
  id_curso?: number | null;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_API = 'http://localhost:4000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Ajuste a URL conforme o ambiente (em emulador Android pode ser 10.0.2.2)
  const API = (process.env.API_URL as string) || DEFAULT_API;

  useEffect(() => {
    // Restaurar sessão ao iniciar
    (async () => {
      try {
        const savedToken = await getItem('token');
        const savedUser = await getItem('user');
        if (savedToken && savedUser) {
          setToken(savedToken);
          const parsed = JSON.parse(savedUser);
          // Normaliza forma do usuário salvo (nome/id_usuario -> name/id)
          const normalized: User = {
            id: parsed?.id ?? parsed?.id_usuario ?? parsed?.userId ?? parsed?.user_id ?? '',
            name: parsed?.name ?? parsed?.nome ?? parsed?.username ?? '',
            email: parsed?.email ?? '',
            id_perfil: parsed?.id_perfil,
            id_curso: parsed?.id_curso ?? null,
          };
          setUser(normalized);
        }
      } catch (err) {
        console.warn('Erro ao restaurar sessão:', err);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;
      const data = await res.json();
      if (!data.token || !data.user) return false;

      const apiUser = data.user;
      const mapped: User = {
        id: apiUser?.id ?? apiUser?.id_usuario ?? '',
        name: apiUser?.name ?? apiUser?.nome ?? '',
        email: apiUser?.email ?? '',
        id_perfil: apiUser?.id_perfil,
        id_curso: apiUser?.id_curso ?? null,
      };

      setToken(data.token);
      setUser(mapped);

      await setItem('token', data.token);
      await setItem('user', JSON.stringify(mapped));

      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    try {
      await removeItem('token');
      await removeItem('user');
    } catch (err) {
      console.warn('Erro ao limpar sessão:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
