// Interface Company
export interface Company {
  id: string;
  name: string;
  cnpj: string;
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
  name: string;
  cnpj: string;
}

// Interface para atualização de empresa
export interface UpdateCompanyDto {
  name?: string;
  cnpj?: string;
}
