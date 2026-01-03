import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { ContactNote } from './contact-note.entity';

export enum ContactStatus {
  PENDING = 'PENDING',    // Quando o contato for criado
  READ = 'READ',          // Quando o contato for lido
  SUSPECT = 'SUSPECT',    // Quando for encaminhado para o CRM
  RESOLVED = 'RESOLVED',  // Quando a solicitação for de outro tipo
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

  @Column({ length: 9 })
  cep: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  companyRelation: Company;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @OneToMany(() => ContactNote, (note) => note.contact)
  notes: ContactNote[];

  @CreateDateColumn()
  createdAt: Date;
}
