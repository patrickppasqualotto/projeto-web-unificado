import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface Informacao {
  id_informacoes: number;
  chave: string;
  titulo: string;
  conteudo: string;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  ultima_att: string;
}

interface UseInformacoesState {
  informacoes: Informacao[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useInformacoes(): UseInformacoesState {
  const { token } = useAuth();
  const [state, setState] = useState<UseInformacoesState>({
    informacoes: [],
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchInformacoes = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/v1/informacoes`, { headers });

      if (!res.ok) {
        throw new Error('Erro ao buscar informações');
      }

      const json = await res.json();

      setState((prev) => ({
        ...prev,
        informacoes: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        informacoes: [],
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  };

  useEffect(() => {
    fetchInformacoes();
  }, [token]);

  return {
    ...state,
    refetch: fetchInformacoes,
  };
}
