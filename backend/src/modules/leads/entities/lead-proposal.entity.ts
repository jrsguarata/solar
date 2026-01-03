import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { User } from '../../users/entities/user.entity';

@Entity('lead_proposals')
export class LeadProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com Lead
  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  // Versionamento automático
  @Column({ type: 'int' })
  version: number;

  // Dados da proposta
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'quota_kwh' })
  quotaKwh: number; // Cota proposta em kWh/mês

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monthly_value' })
  monthlyValue: number; // Valor mensal (R$)

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monthly_savings', nullable: true })
  monthlySavings?: number; // Economia mensal estimada (R$)

  // Arquivo da proposta
  @Column({ name: 'file_path' })
  filePath: string; // Caminho relativo: documents/proposals/{lead-id}/v{version}-{filename}

  @Column({ name: 'file_name' })
  fileName: string; // Nome original do arquivo

  @Column({ name: 'file_size', type: 'int' })
  fileSize: number; // Tamanho em bytes

  @Column({ name: 'mime_type' })
  mimeType: string; // application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document

  // Observações
  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Auditoria
  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @Column({ name: 'sent_by' })
  sentBy: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sent_by' })
  sentByUser: User;
}
