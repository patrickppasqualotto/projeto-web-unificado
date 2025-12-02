import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface Noticia {
  id_noticia: number;
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
  imagem_url: string | null;
  data_publicacao: string;
  data_expiracao: string | null;
  id_autor: number;
  Usuario?: {
    id_usuario: number;
    nome: string;
    email: string;
  };
}

interface UseNoticiasState {
  noticias: Noticia[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useNoticias(): UseNoticiasState {
  const { token } = useAuth();
  const [state, setState] = useState<UseNoticiasState>({
    noticias: [],
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchNoticias = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/v1/noticias`, { headers });

      if (!res.ok) {
        throw new Error('Erro ao buscar notícias');
      }

      const json = await res.json();

      setState((prev) => ({
        ...prev,
        noticias: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        noticias: [],
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, [token]);

  return {
    ...state,
    refetch: fetchNoticias,
  };
}
