import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface Oportunidade {
  id_oportunidade: number;
  titulo: string;
  descricao: string;
  data_publicacao: string;
  data_prazo: string | null;
  id_tipo_oportunidade: number;
  link: string | null;
  TipoOportunidade?: {
    id_tipo_oportunidade: number;
    nome: string;
  };
}

interface UseOportunidadesState {
  oportunidades: Oportunidade[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useOportunidades(): UseOportunidadesState {
  const { token } = useAuth();
  const [state, setState] = useState<UseOportunidadesState>({
    oportunidades: [],
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchOportunidades = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/v1/oportunidades`, { headers });

      if (!res.ok) {
        throw new Error('Erro ao buscar oportunidades');
      }

      const json = await res.json();

      setState((prev) => ({
        ...prev,
        oportunidades: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        oportunidades: [],
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  };

  useEffect(() => {
    fetchOportunidades();
  }, [token]);

  return {
    ...state,
    refetch: fetchOportunidades,
  };
}
