import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

export abstract class BaseEntityWithoutDelete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: Promise<any>;

  @RelationId((entity: BaseEntityWithoutDelete) => entity.createdByUser)
  createdBy?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: Promise<any>;

  @RelationId((entity: BaseEntityWithoutDelete) => entity.updatedByUser)
  updatedBy?: string;
}
