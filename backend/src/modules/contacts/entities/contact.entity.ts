import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Distributor } from '../../distributors/entities/distributor.entity';

export enum ContactStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  RESOLVED = 'RESOLVED',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  distributorId: string;

  @ManyToOne(() => Distributor, { nullable: true })
  @JoinColumn({ name: 'distributorId' })
  distributor: Distributor;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @CreateDateColumn()
  createdAt: Date;
}
