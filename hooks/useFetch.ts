import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export function useFetch<T>(url: string, options?: FetchOptions): FetchState<T> {
  const { token } = useAuth();
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Não fazer requisição se URL estiver vazia
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchData = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Se houver token, incluir no header
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${url}`, {
          method: options?.method || 'GET',
          headers,
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.statusText}`);
        }

        const json = await res.json();

        // Verificar se a resposta possui estrutura esperada
        const data = json.data || json;

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    fetchData();
  }, [url, token, options?.method]);

  return state;
}
