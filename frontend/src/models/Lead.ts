// Enums
export enum LeadStatus {
  LEAD = 'LEAD',                      // Lead inicial (formulário landing page)
  SUSPECT = 'SUSPECT',                // Lead qualificado (distribuidor + consumo mapeados)
  PROSPECT = 'PROSPECT',              // Lead com disponibilidade confirmada
  CLIENTE = 'CLIENTE',                // Lead convertido em cliente
  SEM_COBERTURA = 'SEM_COBERTURA',    // Sem energia disponível
  DESCARTADO = 'DESCARTADO',          // Lead descartado
}

export enum LeadSource {
  LANDING_PAGE = 'LANDING_PAGE',
  MANUAL = 'MANUAL',
}

export enum LeadOwnerType {
  EMPRESA = 'EMPRESA',
  PARTNER = 'PARTNER',
}

// Interface LeadNote
export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  createdBy: string;
  createdByUser: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Interface LeadProposal
export interface LeadProposal {
  id: string;
  leadId: string;
  version: number;
  quotaKwh: number;
  monthlyValue: number;
  monthlySavings?: number;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  notes?: string;
  sentAt: string;
  sentBy: string;
  sentByUser: {
    id: string;
    name: string;
  };
}

// Interface Lead
export interface Lead {
  id: string;

  // Dados básicos (formulário landing page)
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
  message: string;

  // Origin and ownership
  source: LeadSource;
  ownerType: LeadOwnerType;
  ownerId?: string;
  companyId?: string;

  // Status
  status: LeadStatus;

  // Qualification fields (LEAD → SUSPECT)
  distributorId?: string;
  monthlyConsumptionKwh?: number;

  // Availability fields (SUSPECT → PROSPECT)
  cooperativeId?: string;
  hasAvailability: boolean;
  availableEnergyKwh?: number;

  // Proposal fields (PROSPECT)
  proposedQuotaKwh?: number;
  monthlyValue?: number;
  monthlySavings?: number;

  // Management
  assignedTo?: string;
  nextActionDate?: string;
  nextActionDescription?: string;

  // Conversion (PROSPECT → CLIENTE)
  convertedToClientId?: string;
  convertedAt?: string;

  // Relations
  notes: LeadNote[];
  proposals: LeadProposal[];

  // Audit
  createdAt: string;
  updatedAt: string;
}

// Interface para criação de lead (formulário da landing page)
export interface CreateLeadDto {
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

// Interface para atualização de lead (apenas status e nota)
export interface UpdateLeadDto {
  status?: LeadStatus;
  note?: string;
}

// Interface para criação de proposta
export interface CreateLeadProposalDto {
  quotaKwh: number;
  monthlyValue: number;
  monthlySavings?: number;
  notes?: string;
}
