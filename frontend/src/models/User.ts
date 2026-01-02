// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  COADMIN = 'COADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
}

// Interface User
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  isActive: boolean;
  companyId?: string;
  company?: { id: string; name: string; code: string };
  partnerId?: string;
  partner?: { id: string; name: string; code: string };
  createdAt: string;
  createdBy?: string;
  createdByUser?: { id: string; name: string };
  updatedAt: string;
  updatedBy?: string;
  updatedByUser?: { id: string; name: string };
  deactivatedAt?: string;
  deactivatedBy?: string;
  deactivatedByUser?: { id: string; name: string };
}

// Interface para criação de usuário
export interface CreateUserDto {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  companyId?: string;
  partnerId?: string;
}

// Interface para atualização de usuário
export interface UpdateUserDto {
  name?: string;
  email?: string;
  mobile?: string;
  role?: UserRole;
  companyId?: string;
  partnerId?: string;
}
