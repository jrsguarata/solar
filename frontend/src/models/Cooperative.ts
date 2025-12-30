import type { Company } from './Company';

export interface Cooperative {
  id: string;
  code: string;
  name: string;
  companyId: string;
  company?: Company;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
  monthlyEnergy: number;
  foundationDate: string;
  operationApprovalDate?: string;
  createdAt: string;
  createdBy?: string;
  createdByUser?: { id: string; name: string };
  updatedAt: string;
  updatedBy?: string;
  updatedByUser?: { id: string; name: string };
  deletedAt?: string;
  deletedBy?: string;
  deletedByUser?: { id: string; name: string };
}

export interface CreateCooperativeDto {
  code: string;
  name: string;
  companyId: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
  monthlyEnergy: number;
  foundationDate: string;
  operationApprovalDate?: string;
}

export interface UpdateCooperativeDto {
  code?: string;
  name?: string;
  companyId?: string;
  cnpj?: string;
  zipCode?: string;
  streetName?: string;
  city?: string;
  state?: string;
  monthlyEnergy?: number;
  foundationDate?: string;
  operationApprovalDate?: string;
}
