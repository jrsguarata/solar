import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Eye, Filter } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import leadService from '../../services/lead.service';
import type { Lead, LeadStatus } from '../../models';
import { CreateLeadModal } from '../../components/modals/CreateLeadModal';
import { ViewLeadModal } from '../../components/modals/ViewLeadModal';
import { UpdateLeadModal } from '../../components/modals/UpdateLeadModal';

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLeads();
    setCurrentPage(1);
  }, [leads, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAll();
      setLeads(data);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter((lead) =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Filtro de status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowUpdateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadData();
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    loadData();
  };

  // Paginação
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  const getStatusBadgeClass = (status: LeadStatus): string => {
    const classes: Record<LeadStatus, string> = {
      LEAD: 'bg-blue-100 text-blue-800',
      SUSPECT: 'bg-yellow-100 text-yellow-800',
      PROSPECT: 'bg-cyan-100 text-cyan-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      PROPOSAL_SENT: 'bg-purple-100 text-purple-800',
      NEGOTIATION: 'bg-orange-100 text-orange-800',
      WON: 'bg-green-600 text-white',
      LOST: 'bg-red-100 text-red-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: LeadStatus): string => {
    const labels: Record<LeadStatus, string> = {
      LEAD: 'Lead',
      SUSPECT: 'Suspeito',
      PROSPECT: 'Prospecto',
      QUALIFIED: 'Qualificado',
      PROPOSAL_SENT: 'Proposta Enviada',
      NEGOTIATION: 'Negociação',
      WON: 'Ganho',
      LOST: 'Perdido',
      ARCHIVED: 'Arquivado',
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gerenciamento de leads e oportunidades
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'ALL')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos os Status</option>
                <option value="LEAD">Lead</option>
                <option value="SUSPECT">Suspeito</option>
                <option value="PROSPECT">Prospecto</option>
                <option value="QUALIFIED">Qualificado</option>
                <option value="PROPOSAL_SENT">Proposta Enviada</option>
                <option value="NEGOTIATION">Negociação</option>
                <option value="WON">Ganho</option>
                <option value="LOST">Perdido</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Nenhum lead encontrado com os filtros aplicados'
                : 'Nenhum lead cadastrado ainda'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade/UF
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Origem
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {lead.city}/{lead.state}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              lead.status
                            )}`}
                          >
                            {getStatusLabel(lead.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-500">
                            {lead.source === 'LANDING_PAGE' ? 'Landing Page' : 'Manual'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(lead)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Visualizar"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(lead)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredLeads.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateLeadModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showViewModal && selectedLead && (
        <ViewLeadModal
          lead={selectedLead}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {showUpdateModal && selectedLead && (
        <UpdateLeadModal
          lead={selectedLead}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedLead(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </DashboardLayout>
  );
}
