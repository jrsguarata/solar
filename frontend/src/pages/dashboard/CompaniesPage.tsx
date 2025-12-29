import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      await companyService.delete(selectedCompany.id);
      await loadData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
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
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Carregando...</p>
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
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
                            onClick={() => handleDelete(company)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {showDeleteModal && selectedCompany && (
        <ConfirmModal
          title="Excluir Empresa"
          message={`Tem certeza que deseja excluir a empresa "${selectedCompany.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
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
              {/* Nome da Empresa */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Nome da Empresa</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">
                    {selectedCompany.name}
                  </p>
                </div>
              </div>

              {/* CNPJ */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">CNPJ</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-mono text-gray-900">
                    {formatCNPJ(selectedCompany.cnpj)}
                  </p>
                </div>
              </div>

              {/* Informações de Auditoria */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informações do Sistema</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{selectedCompany.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Criado em:</span>
                    <span className="text-gray-900">
                      {new Date(selectedCompany.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Atualizado em:</span>
                    <span className="text-gray-900">
                      {new Date(selectedCompany.updatedAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
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
