// Interface Company
export interface Company {
  id: string;
  code: string;
  name: string;
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

// Interface para criação de empresa
export interface CreateCompanyDto {
  code: string;
  name: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
}

// Interface para atualização de empresa
export interface UpdateCompanyDto {
  code?: string;
  name?: string;
  cnpj?: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
}
