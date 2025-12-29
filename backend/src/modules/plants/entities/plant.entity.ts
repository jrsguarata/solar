import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Distributor } from '../../distributors/entities/distributor.entity';

@Entity('plants')
export class Plant extends BaseEntity {
  @Column({ name: 'distributor_id' })
  @Index()
  distributorId: string;

  @ManyToOne(() => Distributor, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'distributor_id' })
  distributor: Distributor;

  @Column({ name: 'company_id' })
  @Index()
  companyId: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'consumer_unit', length: 50 })
  @Index()
  consumerUnit: string;

  @Column({ length: 14, nullable: true })
  cnpj?: string;

  @Column({ name: 'zip_code', length: 8, nullable: true })
  zipCode?: string;

  @Column({ name: 'street_name', length: 255, nullable: true })
  streetName?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 2, nullable: true })
  state?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  power: number;

  @Column({ name: 'construction_completion_date', type: 'date', nullable: true })
  constructionCompletionDate?: Date;

  @Column({ name: 'operation_start_date', type: 'date', nullable: true })
  operationStartDate?: Date;
}
