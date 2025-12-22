// Enums
export enum ContactStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  RESOLVED = 'RESOLVED',
}

// Interface Contact
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  distributorId?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

// Interface para criação de contato
export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  company?: string;
  distributorId?: string;
  message: string;
}

// Interface para atualização de contato
export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  distributorId?: string;
  message?: string;
  status?: ContactStatus;
}
