export interface ICompany {
  id: string;
  code: string;
  name: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCompanyDto {
  code: string;
  name: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
}

export interface IUpdateCompanyDto {
  code?: string;
  name?: string;
  cnpj?: string;
  zipCode: string;
  streetName: string;
  city: string;
  state: string;
}
