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
import { Distributor } from '../../distributors/entities/distributor.entity';
import { Cooperative } from '../../cooperatives/entities/cooperative.entity';
import { User } from '../../users/entities/user.entity';
import { LeadNote } from './lead-note.entity';
import { LeadProposal } from './lead-proposal.entity';

export enum LeadStatus {
  LEAD = 'LEAD',                   // Novo contato, não triado
  SUSPECT = 'SUSPECT',             // Triado, tem fit inicial
  PROSPECT = 'PROSPECT',           // Qualificado, em negociação
  CLIENTE = 'CLIENTE',             // Convertido em cliente
  SEM_COBERTURA = 'SEM_COBERTURA', // Sem cooperativa disponível
  DESCARTADO = 'DESCARTADO',       // Descartado (não fit)
}

export enum LeadSource {
  LANDING_PAGE = 'LANDING_PAGE',   // Formulário da landing page
  MANUAL = 'MANUAL',               // Cadastro manual por operator
}

export enum LeadOwnerType {
  EMPRESA = 'EMPRESA',             // Pertence à empresa principal
  PARTNER = 'PARTNER',             // Pertence a um partner
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ═══════════════════════════════════════════════════════════
  // ORIGEM E PROPRIEDADE
  // ═══════════════════════════════════════════════════════════

  @Column({
    type: 'enum',
    enum: LeadSource,
    default: LeadSource.LANDING_PAGE,
  })
  source: LeadSource;

  @Column({
    type: 'enum',
    enum: LeadOwnerType,
    default: LeadOwnerType.EMPRESA,
    name: 'owner_type',
  })
  ownerType: LeadOwnerType;

  @Column({ name: 'owner_id', nullable: true })
  ownerId?: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner?: Company; // Partner que "possui" este lead

  // ═══════════════════════════════════════════════════════════
  // DADOS BÁSICOS
  // ═══════════════════════════════════════════════════════════

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ length: 9, nullable: true })
  cep?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  // ═══════════════════════════════════════════════════════════
  // STATUS NO FUNIL
  // ═══════════════════════════════════════════════════════════

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.LEAD,
  })
  status: LeadStatus;

  // ═══════════════════════════════════════════════════════════
  // QUALIFICAÇÃO (LEAD → SUSPECT)
  // Obrigatórios para mudar de LEAD → SUSPECT
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'distributor_id', nullable: true })
  distributorId?: string;

  @ManyToOne(() => Distributor, { nullable: true })
  @JoinColumn({ name: 'distributor_id' })
  distributor?: Distributor;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'monthly_consumption_kwh',
  })
  monthlyConsumptionKwh?: number; // Consumo mensal em kWh

  // ═══════════════════════════════════════════════════════════
  // VALIDAÇÃO DE DISPONIBILIDADE (SUSPECT → PROSPECT)
  // Sistema verifica automaticamente antes de permitir PROSPECT
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'cooperative_id', nullable: true })
  cooperativeId?: string;

  @ManyToOne(() => Cooperative, { nullable: true })
  @JoinColumn({ name: 'cooperative_id' })
  cooperative?: Cooperative; // Cooperativa que atenderá (se houver)

  @Column({ type: 'boolean', default: false, name: 'has_availability' })
  hasAvailability: boolean; // TRUE se existe energia disponível

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'available_energy_kwh',
  })
  availableEnergyKwh?: number; // Energia disponível na cooperativa (snapshot)

  // ═══════════════════════════════════════════════════════════
  // PROPOSTA (quando vira PROSPECT)
  // ═══════════════════════════════════════════════════════════

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'proposed_quota_kwh',
  })
  proposedQuotaKwh?: number; // Cota proposta (kWh/mês)

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'monthly_value',
  })
  monthlyValue?: number; // Valor mensal a pagar (R$)

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'monthly_savings',
  })
  monthlySavings?: number; // Economia mensal estimada (R$)

  // ═══════════════════════════════════════════════════════════
  // GESTÃO DO FUNIL
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedToUser?: User;

  @Column({ name: 'next_action_date', nullable: true })
  nextActionDate?: Date;

  @Column({ name: 'next_action_description', nullable: true })
  nextActionDescription?: string;

  // ═══════════════════════════════════════════════════════════
  // RELACIONAMENTOS
  // ═══════════════════════════════════════════════════════════

  @OneToMany(() => LeadNote, (note) => note.lead)
  notes: LeadNote[];

  @OneToMany(() => LeadProposal, (proposal) => proposal.lead)
  proposals: LeadProposal[];

  // ═══════════════════════════════════════════════════════════
  // AUDITORIA
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'company_id' })
  companyId: string; // Empresa principal do sistema

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;

  // ═══════════════════════════════════════════════════════════
  // CONVERSÃO
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'converted_to_client_id', nullable: true })
  convertedToClientId?: string;

  @Column({ name: 'converted_at', nullable: true })
  convertedAt?: Date;
}
