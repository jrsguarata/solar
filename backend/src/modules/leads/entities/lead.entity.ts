import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';
import { LeadNote } from './lead-note.entity';
import { LeadProposal } from './lead-proposal.entity';

/**
 * Status do Lead no Funil de Vendas
 * Fluxo: LEAD → SUSPECT → PROSPECT → QUALIFIED → PROPOSAL_SENT → NEGOTIATION → WON/LOST
 */
export enum LeadStatus {
  LEAD = 'LEAD',                     // Contato inicial capturado
  SUSPECT = 'SUSPECT',               // Qualificação inicial feita
  PROSPECT = 'PROSPECT',             // Potencial cliente identificado
  QUALIFIED = 'QUALIFIED',           // Cliente qualificado (fit confirmado)
  PROPOSAL_SENT = 'PROPOSAL_SENT',   // Proposta comercial enviada
  NEGOTIATION = 'NEGOTIATION',       // Em negociação
  WON = 'WON',                       // Venda ganha
  LOST = 'LOST',                     // Venda perdida
  ARCHIVED = 'ARCHIVED',             // Arquivado
}

/**
 * Origem do Lead
 */
export enum LeadSource {
  LANDING_PAGE = 'LANDING_PAGE',     // Formulário da landing page
  MANUAL = 'MANUAL',                 // Criado manualmente no CRM
  IMPORT = 'IMPORT',                 // Importação em massa
  API = 'API',                       // Integração externa
  REFERRAL = 'REFERRAL',             // Indicação
}

/**
 * Tipo de Proprietário do Lead (Multi-tenant)
 */
export enum LeadOwnerType {
  EMPRESA = 'EMPRESA',               // Lead da empresa principal
  PARTNER = 'PARTNER',               // Lead de um parceiro
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === Informações Pessoais ===
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  cnpj: string;

  // === Informações da Empresa (se B2B) ===
  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ name: 'company_size', nullable: true })
  companySize: string; // Ex: "1-10", "11-50", "50+"

  // === Endereço ===
  @Column({ length: 9 })
  cep: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  // === Informações de Energia ===
  @Column({ name: 'average_consumption_kwh', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageConsumptionKwh: number; // Consumo médio mensal em kWh

  @Column({ name: 'average_bill_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageBillValue: number; // Valor médio da conta de energia

  @Column({ nullable: true })
  concessionaire: string; // Concessionária de energia

  // === Status e Origem ===
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.LEAD,
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadSource,
    default: LeadSource.LANDING_PAGE,
  })
  source: LeadSource;

  // === Multi-tenant: Ownership ===
  @Column({
    name: 'owner_type',
    type: 'enum',
    enum: LeadOwnerType,
    default: LeadOwnerType.EMPRESA,
  })
  ownerType: LeadOwnerType;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: string; // ID do partner (se ownerType = PARTNER)

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: Company;

  // === Responsável pelo Lead ===
  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string; // ID do usuário responsável

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedUser: User;

  // === Observações e Mensagem Inicial ===
  @Column({ type: 'text', nullable: true })
  message: string; // Mensagem inicial do formulário

  @Column({ type: 'text', nullable: true })
  notes: string; // Observações gerais

  // === Relacionamentos ===
  @OneToMany(() => LeadNote, (note) => note.lead)
  leadNotes: LeadNote[]; // Histórico de interações

  @OneToMany(() => LeadProposal, (proposal) => proposal.lead)
  proposals: LeadProposal[]; // Propostas comerciais

  // === Timestamps ===
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // === Auditoria ===
  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;
}
