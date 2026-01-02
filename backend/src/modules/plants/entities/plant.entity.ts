import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Concessionaire } from '../../concessionaires/entities/concessionaire.entity';

@Entity('plants')
export class Plant extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ name: 'company_id' })
  @Index()
  companyId: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'installed_power', type: 'decimal', precision: 10, scale: 2 })
  installedPower: number;

  @Column({ name: 'concessionary_id' })
  @Index()
  concessionaryId: string;

  @ManyToOne(() => Concessionaire, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'concessionary_id' })
  concessionaire: Concessionaire;

  @Column({ name: 'consumer_unit' })
  consumerUnit: string;

  @Column({ name: 'zip_code', length: 8 })
  zipCode: string;

  @Column({ name: 'street_name', length: 255 })
  streetName: string;

  @Column({ length: 10 })
  number: string;

  @Column({ length: 100, nullable: true })
  complement?: string;

  @Column({ length: 100 })
  neighborhood: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
