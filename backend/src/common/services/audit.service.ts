import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { RequestContextService } from '../context/request-context';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private dataSource: DataSource,
  ) {}

  async createAuditLog(
    tableName: string,
    recordId: string,
    action: AuditAction,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const userId = RequestContextService.getUserId();
    const changedFields = this.getChangedFields(oldValues, newValues);

    const auditLog = this.auditLogRepository.create({
      tableName,
      recordId,
      action,
      oldValues: this.sanitizeValues(oldValues),
      newValues: this.sanitizeValues(newValues),
      changedFields,
      userId,
      ipAddress,
      userAgent,
    });

    // Salvar em uma transação separada para garantir que o log seja criado
    // mesmo se a transação principal falhar
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.manager.save(auditLog);
    } finally {
      await queryRunner.release();
    }
  }

  private getChangedFields(
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ): string[] {
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
    // Ignorar campos que não precisam ser auditados
    const ignoredFields = [
      'updatedAt',
      'updated_at',
      'updatedBy',
      'updated_by',
    ];
    return ignoredFields.includes(fieldName);
  }

  private sanitizeValues(
    values?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!values) {
      return undefined;
    }

    const sanitized = { ...values };

    // Remover campos sensíveis dos logs
    const sensitiveFields = ['password', 'token', 'secret', 'accessToken', 'refreshToken'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  async getAuditHistory(
    tableName: string,
    recordId: string,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { tableName, recordId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAuditHistoryByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 100, // Limitar para performance
    });
  }

  async findAll(filters?: {
    tableName?: string;
    action?: string;
    userId?: string;
    recordId?: string;
  }): Promise<AuditLog[]> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user', 'user')
      .orderBy('audit_log.createdAt', 'DESC')
      .take(500); // Limitar retorno para performance

    if (filters?.tableName) {
      queryBuilder.andWhere('audit_log.tableName = :tableName', {
        tableName: filters.tableName,
      });
    }

    if (filters?.action) {
      queryBuilder.andWhere('audit_log.action = :action', {
        action: filters.action,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters?.recordId) {
      queryBuilder.andWhere('audit_log.recordId = :recordId', {
        recordId: filters.recordId,
      });
    }

    return queryBuilder.getMany();
  }
}
