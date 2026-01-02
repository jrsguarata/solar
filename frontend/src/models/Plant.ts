import type { Company } from './Company';
import type { Concessionaire } from './Concessionaire';

// Interface Plant
export interface Plant {
  id: string;
  code: string;
  name: string;
  companyId: string;
  company?: Company;
  installedPower: number;
  concessionaryId: string;
  concessionaire?: Concessionaire;
  consumerUnit: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
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

// Interface para criação de usina
export interface CreatePlantDto {
  code: string;
  name: string;
  companyId: string;
  installedPower: number;
  concessionaryId: string;
  consumerUnit: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Interface para atualização de usina
export interface UpdatePlantDto {
  code?: string;
  name?: string;
  companyId?: string;
  installedPower?: number;
  concessionaryId?: string;
  consumerUnit?: string;
  zipCode?: string;
  streetName?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
}
