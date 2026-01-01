import {
  Entity,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {

  @Column({ unique: true })
  @Index()
  code: string;

  @Column()
  name: string;

  @Column({ unique: true })
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

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
