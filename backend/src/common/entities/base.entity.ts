import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.createdByUser)
  createdBy?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.updatedByUser)
  updatedBy?: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'deleted_by' })
  deletedByUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.deletedByUser)
  deletedBy?: string;
}
