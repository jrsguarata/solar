import type { User } from './User';

// Interface de Login Request
export interface LoginDto {
  email: string;
  password: string;
}

// Interface de Login Response
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Interface de Refresh Token Request
export interface RefreshTokenDto {
  refreshToken: string;
}

// Interface de Refresh Token Response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Interface de Registro
export interface RegisterDto {
  name: string;
  email: string;
  mobile: string;
  password: string;
}
