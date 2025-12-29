import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { BaseEntityWithoutDelete } from '../../../common/entities/base-without-delete.entity';

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  COADMIN = 'COADMIN',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User extends BaseEntityWithoutDelete {

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column()
  mobile: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @RelationId((user: User) => user.company)
  companyId?: string;

  @Column({ name: 'is_active', default: true })
  @Index()
  isActive: boolean;

  @Column({ name: 'deactivated_at', nullable: true })
  deactivatedAt?: Date;

  @Column({ name: 'deactivated_by', type: 'uuid', nullable: true })
  deactivated_by?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deactivated_by' })
  deactivatedByUser?: User;

  @RelationId((user: User) => user.deactivatedByUser)
  deactivatedBy?: string;
}
