import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  BeforeUpdate,
} from 'typeorm';
import { RequestContextService } from '../context/request-context';

export abstract class BaseEntityWithoutDelete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: any;

  @RelationId((entity: BaseEntityWithoutDelete) => entity.createdByUser)
  createdBy?: string;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true, default: null })
  updatedAt?: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updated_by?: string;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: any;

  @RelationId((entity: BaseEntityWithoutDelete) => entity.updatedByUser)
  updatedBy?: string;

  @BeforeUpdate()
  updateAuditFields() {
    const userId = RequestContextService.getUserId();

    console.log('[BaseEntityWithoutDelete @BeforeUpdate] Setting audit fields', {
      entityName: this.constructor.name,
      userId,
      currentUpdatedBy: this.updatedBy,
      currentUpdatedAt: this.updatedAt,
    });

    if (userId) {
      this.updatedBy = userId;
      this.updatedAt = new Date();

      console.log('[BaseEntityWithoutDelete @BeforeUpdate] Audit fields set', {
        updatedBy: this.updatedBy,
        updatedAt: this.updatedAt,
      });
    } else {
      console.log('[BaseEntityWithoutDelete @BeforeUpdate] WARNING: No userId found in context');
    }
  }
}
