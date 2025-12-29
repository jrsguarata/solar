import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Distributor } from '../../distributors/entities/distributor.entity';

@Entity('concessionaires')
export class Concessionaire extends BaseEntity {
  @ManyToOne(() => Distributor, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'distributor_id' })
  distributor: Distributor;

  @RelationId((concessionaire: Concessionaire) => concessionaire.distributor)
  @Index()
  distributorId: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @RelationId((concessionaire: Concessionaire) => concessionaire.company)
  @Index()
  companyId: string;

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
}
