import api from './api';
import type {
  LoginDto,
  LoginResponse,
  RefreshTokenDto,
  RefreshTokenResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
} from '../models';

class AuthService {
  /**
   * Fazer login
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  }

  /**
   * Renovar token de acesso
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const { data } = await api.post<RefreshTokenResponse>('/auth/refresh', refreshTokenDto);
    return data;
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    // Limpar tokens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Obter usuário atual do localStorage
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Salvar dados de autenticação no localStorage
   */
  saveAuthData(authData: LoginResponse): void {
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  /**
   * Solicitar recuperação de senha
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', forgotPasswordDto);
    return data;
  }

  /**
   * Resetar senha com código de verificação
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const { data } = await api.post<ResetPasswordResponse>('/auth/reset-password', resetPasswordDto);
    return data;
  }
}

export default new AuthService();
