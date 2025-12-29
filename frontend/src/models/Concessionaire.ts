import type { Distributor } from './Distributor';
import type { Company } from './Company';

export interface Concessionaire {
  id: string;
  distributorId: string;
  distributor?: Distributor;
  companyId: string;
  company?: Company;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
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

export interface CreateConcessionaireDto {
  distributorId: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
}

export interface UpdateConcessionaireDto {
  distributorId?: string;
  cnpj?: string;
  zipCode?: string;
  streetName?: string;
  city?: string;
  state?: string;
}
