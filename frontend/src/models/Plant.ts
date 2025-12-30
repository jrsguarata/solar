import { Company } from './Company';

// Interface Plant
export interface Plant {
  id: string;
  code: string;
  name: string;
  companyId: string;
  company?: Company;
  installedPower: number;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
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

// Interface para criação de usina
export interface CreatePlantDto {
  code: string;
  name: string;
  companyId: string;
  installedPower: number;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

// Interface para atualização de usina
export interface UpdatePlantDto {
  code?: string;
  name?: string;
  companyId?: string;
  installedPower?: number;
  zipCode?: string;
  streetName?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}
