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
  updatedAt: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
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
