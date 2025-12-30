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

  @Column({ name: 'zip_code', length: 8 })
  zipCode: string;

  @Column({ name: 'street_name', length: 255 })
  streetName: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
