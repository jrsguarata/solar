import { useState } from 'react';
import { authService, getErrorMessage } from '../services';
import { useAuthStore } from '../store/authStore';
import type { LoginDto, LoginResponse } from '../models';

interface UseAuthReturn {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  getCurrentUser: () => LoginResponse['user'] | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, logout: logoutStore, isAuthenticated: isAuthenticatedStore, user } = useAuthStore();

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);

      const authData = await authService.login(credentials);

      // Save to localStorage (via service) and Zustand store
      authService.saveAuthData(authData);
      setAuth(authData.user, authData.accessToken, authData.refreshToken);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();
      logoutStore();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return isAuthenticatedStore();
  };

  const getCurrentUser = () => {
    return user;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    loading,
    error,
  };
}
