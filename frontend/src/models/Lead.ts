// Enums - Status do Funil de Vendas
export enum LeadStatus {
  LEAD = 'LEAD',                      // Contato inicial capturado
  SUSPECT = 'SUSPECT',                // Qualificação inicial feita
  PROSPECT = 'PROSPECT',              // Potencial cliente identificado
  QUALIFIED = 'QUALIFIED',            // Cliente qualificado (fit confirmado)
  PROPOSAL_SENT = 'PROPOSAL_SENT',    // Proposta comercial enviada
  NEGOTIATION = 'NEGOTIATION',        // Em negociação
  WON = 'WON',                        // Venda ganha
  LOST = 'LOST',                      // Venda perdida
  ARCHIVED = 'ARCHIVED',              // Arquivado
}

export enum LeadSource {
  LANDING_PAGE = 'LANDING_PAGE',      // Formulário da landing page
  MANUAL = 'MANUAL',                  // Criado manualmente no CRM
  IMPORT = 'IMPORT',                  // Importação em massa
  API = 'API',                        // Integração externa
  REFERRAL = 'REFERRAL',              // Indicação
}

export enum LeadOwnerType {
  EMPRESA = 'EMPRESA',                // Lead da empresa principal
  PARTNER = 'PARTNER',                // Lead de um parceiro
}

// Interface LeadNote (Histórico de Interações)
export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  createdBy: string;
  createdByUser?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Interface LeadProposal (Propostas Comerciais)
export interface LeadProposal {
  id: string;
  leadId: string;
  quotaKwh: number;
  monthlyValue: number;
  monthlySavings?: number;
  filePath?: string;
  fileName?: string;
  notes?: string;
  createdBy?: string;
  createdByUser?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Interface Lead (Funil de Vendas Completo)
export interface Lead {
  id: string;

  // === Informações Pessoais ===
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;

  // === Informações da Empresa (B2B) ===
  companyName?: string;
  companySize?: string;

  // === Endereço ===
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  // === Informações de Energia ===
  averageConsumptionKwh?: number;
  averageBillValue?: number;
  concessionaire?: string;

  // === Status e Origem ===
  status: LeadStatus;
  source: LeadSource;

  // === Multi-tenant: Ownership ===
  ownerType: LeadOwnerType;
  ownerId?: string;

  // === Responsável pelo Lead ===
  assignedTo?: string;
  assignedUser?: {
    id: string;
    name: string;
  };

  // === Observações ===
  message?: string;
  notes?: string;

  // === Relacionamentos ===
  leadNotes?: LeadNote[];
  proposals?: LeadProposal[];

  // === Timestamps ===
  createdAt: string;
  updatedAt: string;

  // === Auditoria ===
  createdBy?: string;
  createdByUser?: {
    id: string;
    name: string;
  };
  updatedBy?: string;
  updatedByUser?: {
    id: string;
    name: string;
  };
}

// Interface para criação de lead (formulário da landing page)
export interface CreateLeadDto {
  // Dados básicos
  name: string;
  email: string;
  phone: string;

  // CPF ou CNPJ
  cpf?: string;
  cnpj?: string;

  // Empresa (B2B)
  companyName?: string;
  companySize?: string;

  // Endereço
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  // Informações de Energia
  averageConsumptionKwh?: number;
  averageBillValue?: number;
  concessionaire?: string;

  // Status inicial
  status?: LeadStatus;
  source?: LeadSource;

  // Responsável
  assignedTo?: string;

  // Mensagem
  message?: string;
  notes?: string;
}

// Interface para atualização de lead
export interface UpdateLeadDto {
  status?: LeadStatus;
  assignedTo?: string;
  note?: string; // Adiciona nota ao histórico
  notes?: string; // Atualiza campo notes geral
}

// Interface para criação de proposta
export interface CreateLeadProposalDto {
  quotaKwh: number;
  monthlyValue: number;
  monthlySavings?: number;
  notes?: string;
}
