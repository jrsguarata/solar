import type { ICompany } from './company.types';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  company?: ICompany;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  COADMIN = 'COADMIN',
  ADMIN = 'ADMIN',
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  email: string;
  name: string;
  password: string;
  companyId?: string;
}
