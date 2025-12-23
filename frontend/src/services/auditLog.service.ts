import api from './api';
import type { AuditLog } from '../models';

interface AuditLogFilters {
  tableName?: string;
  action?: string;
  userId?: string;
  recordId?: string;
}

class AuditLogService {
  /**
   * Listar todos os audit logs (ADMIN only)
   */
  async getAll(filters?: AuditLogFilters): Promise<AuditLog[]> {
    const params = new URLSearchParams();

    if (filters?.tableName) params.append('tableName', filters.tableName);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.recordId) params.append('recordId', filters.recordId);

    const queryString = params.toString();
    const url = `/audit-logs${queryString ? `?${queryString}` : ''}`;

    const { data } = await api.get<AuditLog[]>(url);
    return data;
  }

  /**
   * Buscar histórico de um registro específico
   */
  async getHistory(tableName: string, recordId: string): Promise<AuditLog[]> {
    const { data } = await api.get<AuditLog[]>(
      `/audit-logs/history?tableName=${tableName}&recordId=${recordId}`
    );
    return data;
  }
}

export default new AuditLogService();
