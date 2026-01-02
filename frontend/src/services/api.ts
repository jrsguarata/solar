import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Adiciona token JWT automaticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata erros e renova token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Não tentar refresh em rotas de autenticação
    const isAuthRoute = originalRequest.url?.includes('/auth/login') ||
                        originalRequest.url?.includes('/auth/refresh') ||
                        originalRequest.url?.includes('/auth/register');

    // Se erro 401, não é retry, não é rota de autenticação, e tem refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      const refreshToken = localStorage.getItem('refreshToken');

      // Só tenta refresh se tiver um refresh token válido
      if (refreshToken) {
        originalRequest._retry = true;

        try {
          // Chamada para renovar token
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // Salvar novo token
          localStorage.setItem('accessToken', data.accessToken);

          // Refazer requisição original com novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh falhou, limpar tokens e redirecionar para login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          // Notificar usuário que a sessão expirou apenas se não estiver na página de login
          if (!window.location.pathname.includes('/login')) {
            toast.error('Sessão expirada. Por favor, faça login novamente.', {
              duration: 4000,
            });

            // Aguardar toast ser exibido antes de redirecionar
            setTimeout(() => {
              window.location.href = '/login';
            }, 500);
          }

          return Promise.reject(refreshError);
        }
      } else {
        // Sem refresh token, limpar e redirecionar
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (!window.location.pathname.includes('/login')) {
          toast.error('Sessão expirada. Por favor, faça login novamente.', {
            duration: 4000,
          });

          setTimeout(() => {
            window.location.href = '/login';
          }, 500);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Helper para extrair mensagem de erro
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    // Mensagem do backend
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    // Mensagem de erro HTTP padrão
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    // Mensagem de erro de rede
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Erro genérico
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido';
};

export default api;
