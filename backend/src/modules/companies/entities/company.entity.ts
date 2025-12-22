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

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
