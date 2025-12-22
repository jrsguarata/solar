import { useState } from 'react';
import { authService, getErrorMessage } from '../services';
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

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);

      const authData = await authService.login(credentials);
      authService.saveAuthData(authData);
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
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const getCurrentUser = () => {
    return authService.getCurrentUser();
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
