import { useState } from 'react';
import { authService, getErrorMessage } from '../services';
import type { ForgotPasswordDto, ForgotPasswordResponse, ResetPasswordDto } from '../models';

interface UsePasswordRecoveryReturn {
  requestCode: (data: ForgotPasswordDto) => Promise<ForgotPasswordResponse>;
  resetPassword: (data: ResetPasswordDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  devCode: string | null; // Apenas em desenvolvimento
  phone: string | null; // Telefone do usuário
  resetState: () => void;
}

export function usePasswordRecovery(): UsePasswordRecoveryReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  const requestCode = async (data: ForgotPasswordDto): Promise<ForgotPasswordResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setDevCode(null);
      setPhone(null);

      const response = await authService.forgotPassword(data);

      // Armazenar telefone retornado
      setPhone(response.phone);

      // Em desenvolvimento, armazenar código retornado
      if (response.code) {
        setDevCode(response.code);
        console.log('[DEV] Código de recuperação:', response.code);
      }

      setSuccess(true);
      return response;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await authService.resetPassword(data);
      setSuccess(true);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setDevCode(null);
    setPhone(null);
  };

  return {
    requestCode,
    resetPassword,
    loading,
    error,
    success,
    devCode,
    phone,
    resetState,
  };
}
