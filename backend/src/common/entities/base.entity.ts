import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  BeforeUpdate,
} from 'typeorm';
import { RequestContextService } from '../context/request-context';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: any;

  @RelationId((entity: BaseEntity) => entity.createdByUser)
  createdBy?: string;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true, default: null })
  updatedAt?: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updated_by?: string;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: any;

  @RelationId((entity: BaseEntity) => entity.updatedByUser)
  updatedBy?: string;

  @DeleteDateColumn({ name: 'deactivated_at' })
  deactivatedAt?: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deactivated_by' })
  deactivatedByUser?: any;

  @RelationId((entity: BaseEntity) => entity.deactivatedByUser)
  deactivatedBy?: string;

  @BeforeUpdate()
  updateAuditFields() {
    const userId = RequestContextService.getUserId();

    console.log('[BaseEntity @BeforeUpdate] Setting audit fields', {
      entityName: this.constructor.name,
      userId,
      currentUpdatedBy: this.updatedBy,
      currentUpdatedAt: this.updatedAt,
    });

    if (userId) {
      this.updatedBy = userId;
      this.updatedAt = new Date();

      console.log('[BaseEntity @BeforeUpdate] Audit fields set', {
        updatedBy: this.updatedBy,
        updatedAt: this.updatedAt,
      });
    } else {
      console.log('[BaseEntity @BeforeUpdate] WARNING: No userId found in context');
    }
  }
}
