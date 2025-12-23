import { useEffect, useState } from 'react';
import { Search, Filter, FileText, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { auditLogService } from '../../services';
import type { AuditLog, AuditAction } from '../../models';

export function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableNameFilter, setTableNameFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'ALL'>('ALL');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state para visualizar detalhes
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLogs();
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  }, [auditLogs, searchTerm, tableNameFilter, actionFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await auditLogService.getAll();
      setAuditLogs(data);
    } catch (error) {
      console.error('Erro ao carregar audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    // Filtro de busca por recordId ou userId
    if (searchTerm) {
      filtered = filtered.filter((log) => {
        const recordIdMatch = log.recordId?.toLowerCase().includes(searchTerm.toLowerCase());
        const userIdMatch = log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
        return recordIdMatch || userIdMatch;
      });
    }

    // Filtro de tabela
    if (tableNameFilter !== 'ALL') {
      filtered = filtered.filter((log) => log.tableName === tableNameFilter);
    }

    // Filtro de ação
    if (actionFilter !== 'ALL') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  // Calcular logs da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageLogs = filteredLogs.slice(startIndex, endIndex);

  // Obter lista única de nomes de tabelas
  const uniqueTableNames = Array.from(new Set(auditLogs.map((log) => log.tableName))).sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionBadgeClass = (action: AuditAction) => {
    switch (action) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
            <p className="text-gray-600 mt-1">
              {filteredLogs.length} registro(s) encontrado(s)
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-5 h-5" />
            <span>Histórico de auditoria do sistema</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campo de busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Record ID ou User ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro de Tabela */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Tabela
              </label>
              <select
                value={tableNameFilter}
                onChange={(e) => setTableNameFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todas</option>
                {uniqueTableNames.map((tableName) => (
                  <option key={tableName} value={tableName}>
                    {tableName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Ação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Ação
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as AuditAction | 'ALL')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todas</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tabela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campos Alterados
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Carregando...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhum registro de auditoria encontrado
                    </td>
                  </tr>
                ) : (
                  currentPageLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{log.tableName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeClass(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {log.recordId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.user ? (
                          <div>
                            <div className="font-medium text-gray-900">{log.user.name}</div>
                            <div className="text-xs text-gray-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sistema</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.changedFields && log.changedFields.length > 0
                          ? `${log.changedFields.length} campo(s)`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {!loading && filteredLogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Audit Log
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data/Hora</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedLog.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tabela</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.tableName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ação</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeClass(
                        selectedLog.action
                      )}`}
                    >
                      {selectedLog.action}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Record ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    {selectedLog.recordId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuário</label>
                  {selectedLog.user ? (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">{selectedLog.user.name}</p>
                      <p className="text-xs text-gray-500">{selectedLog.user.email}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: {selectedLog.userId}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-400">Sistema</p>
                  )}
                </div>
              </div>

              {/* Campos Alterados */}
              {selectedLog.changedFields && selectedLog.changedFields.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campos Alterados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedLog.changedFields.map((field) => (
                      <span
                        key={field}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Valores Antigos */}
              {selectedLog.oldValues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valores Antigos
                  </label>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {/* Valores Novos */}
              {selectedLog.newValues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valores Novos
                  </label>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.newValues, null, 2)}
                  </pre>
                </div>
              )}

              {/* IP e User Agent */}
              {(selectedLog.ipAddress || selectedLog.userAgent) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedLog.ipAddress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        IP Address
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</p>
                    </div>
                  )}
                  {selectedLog.userAgent && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        User Agent
                      </label>
                      <p className="mt-1 text-sm text-gray-900 break-all">
                        {selectedLog.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
