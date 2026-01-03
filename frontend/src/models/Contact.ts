// Enums
export enum ContactStatus {
  PENDING = 'PENDING',    // Quando o contato for criado
  READ = 'READ',          // Quando o contato for lido
  SUSPECT = 'SUSPECT',    // Quando for encaminhado para o CRM
  RESOLVED = 'RESOLVED',  // Quando a solicitação for de outro tipo
}

// Interface Contact
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId?: string;
  message: string;
  status: ContactStatus;
  note?: string;
  createdAt: string;
}

// Interface para criação de contato (formulário da landing page)
export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId?: string;
  message: string;
}

// Interface para atualização de contato (apenas status e nota)
export interface UpdateContactDto {
  status?: ContactStatus;
  note?: string;
}
