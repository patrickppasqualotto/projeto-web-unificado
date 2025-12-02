import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface Vaga {
  id_vaga: number;
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: string | null;
  data_expiracao: string;
  id_categoria: number;
  id_usuario_publicador: number;
  nome_empresa: string | null;
  localizacao: string | null;
  url: string | null;
  data_publicacao: string;
  Categoria_vaga?: {
    id_categoria: number;
    nome: string;
  };
  tags?: Array<{
    id_tag: number;
    nome: string;
  }>;
}

interface UseVagasState {
  vagas: Vaga[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useVagas(): UseVagasState {
  const { token } = useAuth();
  const [state, setState] = useState<UseVagasState>({
    vagas: [],
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchVagas = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/v1/vagas`, { headers });

      if (!res.ok) {
        throw new Error('Erro ao buscar vagas');
      }

      const json = await res.json();

      setState((prev) => ({
        ...prev,
        vagas: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        vagas: [],
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  };

  useEffect(() => {
    fetchVagas();
  }, [token]);

  return {
    ...state,
    refetch: fetchVagas,
  };
}
