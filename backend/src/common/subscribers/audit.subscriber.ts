import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
  RemoveEvent,
} from 'typeorm';
import { RequestContextService } from '../context/request-context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  // Não implementa listenTo() para escutar TODAS as entidades

  beforeInsert(event: InsertEvent<any>) {
    const userId = RequestContextService.getUserId();

    if (userId && event.entity) {
      const metadata = event.metadata;

      // REGRA: No INSERT, apenas created_by e created_at devem ser preenchidos
      // updated_by e updated_at devem permanecer NULL/undefined

      // Setar created_by
      if ('createdBy' in event.entity) {
        event.entity.createdBy = userId;

        // Garantir que será incluído no INSERT query
        const createdByColumn = metadata.columns.find(
          col => col.propertyName === 'createdBy' || col.databaseName === 'created_by'
        );

        // Marcar coluna como tendo valor para forçar inclusão no INSERT
        if (createdByColumn && event.entity[createdByColumn.propertyName] === undefined) {
          event.entity[createdByColumn.propertyName] = userId;
        }
      }

      // NÃO setar updated_by no INSERT - deve permanecer NULL
      // created_at será preenchido automaticamente pelo @CreateDateColumn
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const userId = RequestContextService.getUserId();

    console.log('[AuditSubscriber] beforeUpdate called', {
      userId,
      entityName: event.metadata.name,
      hasEntity: !!event.entity,
      hasDatabaseEntity: !!event.databaseEntity,
    });

    // CRITICAL: Para UpdateEvent, precisamos setar os valores ANTES que TypeORM calcule o changeset
    // Isso significa setar direto na entidade E garantir que estejam no updatedColumns
    if (userId && event.entity) {
      const now = new Date();

      // Setar updated_by e updated_at na entidade
      if ('updatedBy' in event.entity) {
        event.entity.updatedBy = userId;
        console.log('[AuditSubscriber] Set updatedBy to', userId);
      }

      if ('updatedAt' in event.entity) {
        event.entity.updatedAt = now;
        console.log('[AuditSubscriber] Set updatedAt to', now);
      }

      // CRITICAL FIX: Também precisamos setar no databaseEntity para forçar TypeORM a ver como mudança
      if (event.databaseEntity) {
        if ('updatedBy' in event.databaseEntity) {
          // Forçar valor diferente para que TypeORM detecte mudança
          event.databaseEntity.updatedBy = event.databaseEntity.updatedBy === userId ? null : event.databaseEntity.updatedBy;
        }
        if ('updatedAt' in event.databaseEntity) {
          // Forçar valor diferente para que TypeORM detecte mudança
          event.databaseEntity.updatedAt = event.databaseEntity.updatedAt;
        }
      }
    } else {
      console.log('[AuditSubscriber] WARNING: No userId or no entity');
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    const userId = RequestContextService.getUserId();

    if (userId && event.entity) {
      // Setar o valor na entidade
      if ('deletedBy' in event.entity) {
        event.entity.deletedBy = userId;
      }
    }
  }

  beforeRemove(event: RemoveEvent<any>) {
    const userId = RequestContextService.getUserId();
    if (userId && event.entity) {
      if ('deletedBy' in event.entity) {
        event.entity.deletedBy = userId;
      }
    }
  }
}
