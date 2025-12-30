import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('cooperatives')
export class Cooperative extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'company_id' })
  @Index()
  companyId: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 14 })
  @Index()
  cnpj: string;

  @Column({ name: 'zip_code', length: 8 })
  zipCode: string;

  @Column({ name: 'street_name', length: 255 })
  streetName: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'monthly_energy' })
  monthlyEnergy: number;

  @Column({ name: 'foundation_date', type: 'date' })
  foundationDate: Date;

  @Column({ name: 'operation_approval_date', type: 'date', nullable: true })
  operationApprovalDate?: Date;
}
