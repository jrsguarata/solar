import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { companyService } from '../../services';
import type { Company } from '../../models';
import { CompanyFormModal } from '../../components/modals/CompanyFormModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'name' | 'cnpj'>('name');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCompanies();
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  }, [companies, searchTerm, searchField]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter((company) => {
        const value = company[searchField]?.toLowerCase() || '';
        return value.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredCompanies(filtered);
  };

  // Calcular empresas da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handleCreate = () => {
    setSelectedCompany(null);
    setShowFormModal(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setShowFormModal(true);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const handleToggleStatus = (company: Company) => {
    setSelectedCompany(company);
    if (company.isActive) {
      setShowDeactivateModal(true);
    } else {
      setShowActivateModal(true);
    }
  };

  const confirmDeactivate = async () => {
    if (!selectedCompany) return;

    try {
      await companyService.deactivate(selectedCompany.id);
      await loadData();
      setShowDeactivateModal(false);
    } catch (error) {
      console.error('Erro ao desativar empresa:', error);
    }
  };

  const confirmActivate = async () => {
    if (!selectedCompany) return;

    try {
      await companyService.activate(selectedCompany.id);
      await loadData();
      setShowActivateModal(false);
    } catch (error) {
      console.error('Erro ao ativar empresa:', error);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    // Format: XX.XXX.XXX/XXXX-XX
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Empresas</h2>
            <p className="text-gray-600 mt-1">
              {filteredCompanies.length} empresa(s) encontrada(s)
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Empresa
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo de busca */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="flex gap-2">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as 'name' | 'cnpj')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Nome</option>
                  <option value="cnpj">CNPJ</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Digite o ${searchField === 'name' ? 'nome' : 'CNPJ'}`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
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
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Carregando...</p>
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma empresa encontrada
                    </td>
                  </tr>
                ) : (
                  currentPageCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{company.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCNPJ(company.cnpj)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {company.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(company.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(company)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(company)}
                            className={`p-1 rounded ${
                              company.isActive
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={company.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {company.isActive ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {!loading && filteredCompanies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCompanies.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <CompanyFormModal
          company={selectedCompany}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            loadData();
          }}
        />
      )}

      {/* Modal de Confirmação - Desativar */}
      {showDeactivateModal && selectedCompany && (
        <ConfirmModal
          title="Desativar Empresa"
          message={`Tem certeza que deseja desativar a empresa "${selectedCompany.name}"? A empresa não poderá mais ser utilizada no sistema.`}
          confirmText="Desativar"
          cancelText="Cancelar"
          variant="warning"
          onConfirm={confirmDeactivate}
          onCancel={() => setShowDeactivateModal(false)}
        />
      )}

      {/* Modal de Confirmação - Ativar */}
      {showActivateModal && selectedCompany && (
        <ConfirmModal
          title="Ativar Empresa"
          message={`Tem certeza que deseja ativar a empresa "${selectedCompany.name}"? A empresa voltará a estar disponível no sistema.`}
          confirmText="Ativar"
          cancelText="Cancelar"
          variant="info"
          onConfirm={confirmActivate}
          onCancel={() => setShowActivateModal(false)}
        />
      )}

      {/* Modal de Visualização */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes da Empresa
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informações Básicas</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Código</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedCompany.code}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Nome da Empresa</label>
                    <p className="text-lg font-medium text-gray-900">{selectedCompany.name}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">CNPJ</label>
                    <p className="text-lg font-mono text-gray-900">{formatCNPJ(selectedCompany.cnpj)}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Endereço</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">CEP</label>
                    <p className="text-sm text-gray-900">{selectedCompany.zipCode}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Logradouro</label>
                    <p className="text-sm text-gray-900">{selectedCompany.streetName}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Número</label>
                      <p className="text-sm text-gray-900">{selectedCompany.number}</p>
                    </div>
                    {selectedCompany.complement && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Complemento</label>
                        <p className="text-sm text-gray-900">{selectedCompany.complement}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Bairro</label>
                    <p className="text-sm text-gray-900">{selectedCompany.neighborhood}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Cidade/Estado</label>
                    <p className="text-sm text-gray-900">
                      {selectedCompany.city} - {selectedCompany.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações de Auditoria */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informações do Sistema</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedCompany.id}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Criação</label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-500">Criado em:</span>
                        <span className="text-sm text-gray-900 text-right">
                          {new Date(selectedCompany.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {selectedCompany.createdByUser && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Criado por:</span>
                          <span className="text-sm text-gray-900 text-right font-medium">
                            {selectedCompany.createdByUser.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCompany.updatedAt && (
                    <div className="border-t border-gray-200 pt-3">
                      <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Atualização</label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Atualizado em:</span>
                          <span className="text-sm text-gray-900 text-right">
                            {new Date(selectedCompany.updatedAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {selectedCompany.updatedByUser && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Atualizado por:</span>
                            <span className="text-sm text-gray-900 text-right font-medium">
                              {selectedCompany.updatedByUser.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedCompany.deactivatedAt && (
                    <div className="border-t border-gray-200 pt-3">
                      <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Desativação</label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Desativado em:</span>
                          <span className="text-sm text-red-600 text-right">
                            {new Date(selectedCompany.deactivatedAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {selectedCompany.deactivatedByUser && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Desativado por:</span>
                            <span className="text-sm text-red-600 text-right font-medium">
                              {selectedCompany.deactivatedByUser.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
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
