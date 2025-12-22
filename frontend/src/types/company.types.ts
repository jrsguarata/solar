export interface ICompany {
  id: string;
  code: string;
  name: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCompanyDto {
  code: string;
  name: string;
  cnpj: string;
}

export interface IUpdateCompanyDto {
  code?: string;
  name?: string;
  cnpj?: string;
}
