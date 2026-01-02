// Interface Partner
export interface Partner {
  id: string;
  code: string;
  name: string;
  cnpj: string;
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

// Interface para criação de parceiro
export interface CreatePartnerDto {
  code: string;
  name: string;
  cnpj: string;
  zipCode: string;
  streetName: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Interface para atualização de parceiro
export interface UpdatePartnerDto {
  code?: string;
  name?: string;
  cnpj?: string;
  zipCode?: string;
  streetName?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
}
