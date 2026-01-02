import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { partnerService } from '../../services/partner.service';
import type { Partner } from '../../models';
import { PartnerFormModal } from '../../components/modals/PartnerFormModal';
import { ViewPartnerModal } from '../../components/modals/ViewPartnerModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';

export function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'name' | 'cnpj'>('name');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPartners();
    setCurrentPage(1);
  }, [partners, searchTerm, searchField]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await partnerService.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter((partner) => {
        const value = partner[searchField]?.toLowerCase() || '';
        return value.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredPartners(filtered);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPagePartners = filteredPartners.slice(startIndex, endIndex);

  const handleCreate = () => {
    setSelectedPartner(null);
    setShowFormModal(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowFormModal(true);
  };

  const handleView = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowViewModal(true);
  };

  const handleToggleStatus = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowToggleModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedPartner) return;
    try {
      await partnerService.update(selectedPartner.id, {
        isActive: !selectedPartner.isActive,
      });
      await loadData();
      setShowToggleModal(false);
    } catch (error) {
      console.error('Erro ao alterar status do parceiro:', error);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) return cnpj;
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
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Parceiros</h2>
            <p className="text-gray-600 mt-1">
              {filteredPartners.length} parceiro(s) encontrado(s)
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Parceiro
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Código
                  </th>
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-gray-600">Carregando...</p>
                    </td>
                  </tr>
                ) : filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nenhum parceiro encontrado
                    </td>
                  </tr>
                ) : (
                  currentPagePartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{partner.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{partner.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCNPJ(partner.cnpj)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            partner.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {partner.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(partner.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(partner)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(partner)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(partner)}
                            className={`p-1 rounded ${
                              partner.isActive
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={partner.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {partner.isActive ? (
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

          {!loading && filteredPartners.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPartners.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <PartnerFormModal
          partner={selectedPartner}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            loadData();
          }}
        />
      )}

      {showViewModal && selectedPartner && (
        <ViewPartnerModal
          partner={selectedPartner}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showToggleModal && selectedPartner && (
        <ConfirmModal
          title={selectedPartner.isActive ? 'Desativar Parceiro' : 'Ativar Parceiro'}
          message={selectedPartner.isActive
            ? `Tem certeza que deseja desativar o parceiro "${selectedPartner.name}"?`
            : `Tem certeza que deseja ativar o parceiro "${selectedPartner.name}"?`
          }
          confirmText={selectedPartner.isActive ? 'Desativar' : 'Ativar'}
          cancelText="Cancelar"
          variant={selectedPartner.isActive ? 'danger' : 'success'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setShowToggleModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
