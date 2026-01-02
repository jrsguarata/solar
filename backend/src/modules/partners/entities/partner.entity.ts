import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('partners')
export class Partner extends BaseEntity {
  @Column({ unique: true })
  @Index()
  code: string;

  @Column()
  name: string;

  @Column({ unique: true, length: 14 })
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
