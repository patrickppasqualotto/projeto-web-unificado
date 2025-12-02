import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface Evento {
  id_evento: number;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  local_evento: string | null;
  link_inscricao: string | null;
  id_organizador: number;
  id_curso: number | null;
  Usuario?: {
    id_usuario: number;
    nome: string;
    email: string;
  };
  Curso?: {
    id_curso: number;
    nome: string;
  };
}

interface UseEventosState {
  eventos: Evento[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useEventos(): UseEventosState {
  const { token } = useAuth();
  const [state, setState] = useState<UseEventosState>({
    eventos: [],
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchEventos = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/v1/eventos`, { headers });

      if (!res.ok) {
        throw new Error('Erro ao buscar eventos');
      }

      const json = await res.json();

      setState((prev) => ({
        ...prev,
        eventos: json.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        eventos: [],
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [token]);

  return {
    ...state,
    refetch: fetchEventos,
  };
}
