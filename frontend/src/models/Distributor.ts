// Interface Distributor
export interface Distributor {
  id: string;
  code?: string;
  uf?: string;
  name: string;
  type?: string;
}

// Interface para criação de distribuidora
export interface CreateDistributorDto {
  code?: string;
  uf?: string;
  name: string;
  type?: string;
}

// Interface para atualização de distribuidora
export interface UpdateDistributorDto {
  code?: string;
  uf?: string;
  name?: string;
  type?: string;
}
