// Interface Company
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
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
