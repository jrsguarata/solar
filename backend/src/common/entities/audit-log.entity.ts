import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum AuditAction {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'table_name' })
  @Index()
  tableName: string;

  @Column({ name: 'record_id' })
  @Index()
  recordId: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  @Index()
  action: AuditAction;

  @Column({ type: 'jsonb', nullable: true, name: 'old_values' })
  oldValues?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'new_values' })
  newValues?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'changed_fields' })
  changedFields?: string[];

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId?: string;

  @ManyToOne('User', { nullable: true, eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: any;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;
}
