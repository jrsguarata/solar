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

@Entity('concessionaires')
export class Concessionaire extends BaseEntity {
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

  @Column({ length: 14 })
  @Index()
  cnpj: string;

  @Column({ name: 'zip_code', length: 9 })
  zipCode: string;

  @Column({ name: 'street_name', length: 255 })
  streetName: string;

  @Column({ length: 50 })
  number: string;

  @Column({ nullable: true, length: 100 })
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
