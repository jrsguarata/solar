import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
  RemoveEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { RequestContextService } from '../context/request-context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const userId = RequestContextService.getUserId();
    if (userId && event.entity) {
      event.entity.createdBy = userId;
      event.entity.updatedBy = userId;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    const userId = RequestContextService.getUserId();
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>) {
    const userId = RequestContextService.getUserId();
    if (userId && event.entity) {
      event.entity.deletedBy = userId;
    }
  }

  beforeRemove(event: RemoveEvent<BaseEntity>) {
    const userId = RequestContextService.getUserId();
    if (userId && event.entity) {
      event.entity.deletedBy = userId;
    }
  }
}
