import type { Company } from './Company';
import type { Plant } from './Plant';

export interface Cooperative {
  id: string;
  code: string;
  name: string;
  companyId: string;
  company?: Company;
  plantId: string;
  plant?: Plant;
  cnpj: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  monthlyEnergy: number;
  foundationDate: string;
  operationApprovalDate?: string;
  isActive: boolean;
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

export interface CreateCooperativeDto {
  code: string;
  name: string;
  companyId: string;
  plantId: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
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
  plantId?: string;
  cnpj?: string;
  zipCode?: string;
  streetName?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  monthlyEnergy?: number;
  foundationDate?: string;
  operationApprovalDate?: string;
  isActive?: boolean;
}
