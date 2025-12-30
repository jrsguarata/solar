import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { RequestContextService } from '../context/request-context';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface<any> {
  constructor(private dataSource: DataSource) {}

  // Não implementar listenTo() para escutar TODAS as entidades
  // Se listenTo() não for implementado ou retornar undefined, o subscriber escuta todas

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    await this.createAuditLog(
      event,
      AuditAction.INSERT,
      undefined,
      event.entity,
    );
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (!event.entity) return;

    // Obter valores antigos do banco
    const oldEntity = event.databaseEntity;

    // Quando usamos QueryBuilder.execute(), event.entity pode conter valores desatualizados
    // Buscar entidade atualizada do banco para garantir valores corretos no audit log
    let newEntity = event.entity;

    if (event.entity && 'id' in event.entity) {
      const recordId = (event.entity as any).id;
      const tableName = event.metadata.tableName;

      // CRITICAL: Buscar apenas dados brutos sem carregar relações
      // Usar query SQL direto para evitar prefixos do QueryBuilder e propriedades virtuais (@RelationId)
      const result = await event.manager.query(
        `SELECT * FROM "${tableName}" WHERE id = $1`,
        [recordId]
      );

      if (result && result.length > 0) {
        newEntity = result[0];
      }
    }

    await this.createAuditLog(
      event,
      AuditAction.UPDATE,
      oldEntity,
      newEntity,
    );
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>): Promise<void> {
    if (!event.entity) return;

    await this.createAuditLog(
      event,
      AuditAction.DELETE,
      event.databaseEntity,
      event.entity,
    );
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (!event.entity) return;

    await this.createAuditLog(
      event,
      AuditAction.DELETE,
      event.databaseEntity,
      undefined,
    );
  }

  private async createAuditLog(
    event:
      | InsertEvent<any>
      | UpdateEvent<any>
      | SoftRemoveEvent<any>
      | RemoveEvent<any>,
    action: AuditAction,
    oldValues?: any,
    newValues?: any,
  ): Promise<void> {
    try {
      const tableName = event.metadata.tableName;

      // Não auditar a própria tabela de auditoria (evita loop infinito)
      if (tableName === 'audit_logs') return;

      const recordId = this.getRecordId(event);

      if (!recordId) return;

      const userId = RequestContextService.getUserId();
      const changedFields = this.getChangedFields(oldValues, newValues);

      const auditLog = event.manager.create(AuditLog, {
        tableName,
        recordId,
        action,
        oldValues: this.sanitizeValues(oldValues),
        newValues: this.sanitizeValues(newValues),
        changedFields,
        userId,
      });

      // Salvar em transação separada para não interferir com a operação principal
      const queryRunner = event.connection.createQueryRunner();
      await queryRunner.connect();

      try {
        await queryRunner.manager.save(auditLog);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      // Não propagar erro de auditoria para não quebrar a operação principal
      console.error('Erro ao criar log de auditoria:', error);
    }
  }

  private getRecordId(
    event:
      | InsertEvent<any>
      | UpdateEvent<any>
      | SoftRemoveEvent<any>
      | RemoveEvent<any>,
  ): string | undefined {
    if (event.entity && 'id' in event.entity) {
      return (event.entity as any).id;
    }

    // UpdateEvent e SoftRemoveEvent têm databaseEntity
    if ('databaseEntity' in event && event.databaseEntity && 'id' in event.databaseEntity) {
      return (event.databaseEntity as any).id;
    }

    return undefined;
  }

  private getChangedFields(oldValues?: any, newValues?: any): string[] {
    if (!oldValues || !newValues) {
      return [];
    }

    const changed: string[] = [];
    const allKeys = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);

    for (const key of allKeys) {
      if (this.shouldIgnoreField(key)) {
        continue;
      }

      const oldValue = oldValues[key];
      const newValue = newValues[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changed.push(key);
      }
    }

    return changed;
  }

  private shouldIgnoreField(fieldName: string): boolean {
    const ignoredFields = [
      'updatedAt',
      'updated_at',
      'updatedBy',
      'updated_by',
    ];
    return ignoredFields.includes(fieldName);
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private sanitizeValues(values?: any): Record<string, any> | undefined {
    if (!values) {
      return undefined;
    }

    const sanitized: Record<string, any> = {};

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        // Ignorar relações carregadas (objetos aninhados que terminam com "User" ou são objetos de relação)
        if (this.isRelationField(key, values[key])) {
          continue;
        }

        // Converter snake_case para camelCase
        const camelKey = this.snakeToCamel(key);
        sanitized[camelKey] = this.sanitizeField(key, values[key]);
      }
    }

    return sanitized;
  }

  private isRelationField(fieldName: string, value: any): boolean {
    // Lista de campos que são relações e devem ser ignorados
    const relationFields = [
      'createdByUser',
      'updatedByUser',
      'deletedByUser',
      'deactivatedByUser',
      'company',
      'user',
      'distributor',
      'concessionaire',
    ];

    // Se o campo está na lista de relações conhecidas
    if (relationFields.includes(fieldName)) {
      return true;
    }

    // Se o valor é um objeto (não array, não null, não Date) e tem propriedade 'id'
    // provavelmente é uma relação carregada
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      'id' in value &&
      Object.keys(value).length > 1
    ) {
      return true;
    }

    return false;
  }

  private sanitizeField(fieldName: string, value: any): any {
    // Campos sensíveis que devem ser ocultados nos logs
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'accessToken',
      'refreshToken',
    ];

    if (sensitiveFields.includes(fieldName)) {
      return '***REDACTED***';
    }

    return value;
  }
}
