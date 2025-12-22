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
  createdAt: string;
  updatedAt: string;
}

// Interface para criação de usuário
export interface CreateUserDto {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  companyId?: string;
}

// Interface para atualização de usuário
export interface UpdateUserDto {
  name?: string;
  email?: string;
  mobile?: string;
  role?: UserRole;
  companyId?: string;
}
