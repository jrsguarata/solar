import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { cessionaireService, distributorService } from '../../services';
import type { Concessionaire, Distributor } from '../../models';

export function ConcessionairesPage() {
  const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);
  const [filteredConcessionaires, setFilteredConcessionaires] = useState<Concessionaire[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [distributorFilter, setDistributorFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedConcessionaire, setSelectedConcessionaire] = useState<Concessionaire | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    distributorId: '',
    cnpj: '',
    zipCode: '',
    streetName: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterConcessionaires();
    setCurrentPage(1);
  }, [concessionaires, searchTerm, distributorFilter, stateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [concessionairesData, distributorsData] = await Promise.all([
        cessionaireService.getAll(),
        distributorService.getAll(),
      ]);
      setConcessionaires(concessionairesData);
      setDistributors(distributorsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterConcessionaires = () => {
    let filtered = concessionaires;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter((concessionaire) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          concessionaire.cnpj.includes(searchTerm) ||
          concessionaire.city.toLowerCase().includes(searchLower) ||
          concessionaire.streetName.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtro de distribuidora
    if (distributorFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.distributorId === distributorFilter);
    }

    // Filtro de estado
    if (stateFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.state === stateFilter);
    }

    setFilteredConcessionaires(filtered);
  };

  // Calcular concessionárias da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageConcessionaires = filteredConcessionaires.slice(startIndex, endIndex);

  // Estados únicos
  const uniqueStates = Array.from(new Set(concessionaires.map((c) => c.state))).sort();

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatZipCode = (zipCode: string) => {
    return zipCode.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const handleCreate = () => {
    setSelectedConcessionaire(null);
    setFormData({
      distributorId: '',
      cnpj: '',
      zipCode: '',
      streetName: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    });
    setFormError('');
    setShowFormModal(true);
  };

  const handleEdit = (concessionaire: Concessionaire) => {
    setSelectedConcessionaire(concessionaire);
    setFormData({
      distributorId: concessionaire.distributorId,
      cnpj: concessionaire.cnpj,
      zipCode: concessionaire.zipCode,
      streetName: concessionaire.streetName,
      number: concessionaire.number,
      complement: concessionaire.complement || '',
      neighborhood: concessionaire.neighborhood,
      city: concessionaire.city,
      state: concessionaire.state,
    });
    setFormError('');
    setShowFormModal(true);
  };

  const handleDelete = (concessionaire: Concessionaire) => {
    setSelectedConcessionaire(concessionaire);
    setShowDeleteModal(true);
  };

  const handleView = (concessionaire: Concessionaire) => {
    setSelectedConcessionaire(concessionaire);
    setShowViewModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (selectedConcessionaire) {
        await cessionaireService.update(selectedConcessionaire.id, formData);
      } else {
        await cessionaireService.create(formData);
      }
      await loadData();
      setShowFormModal(false);
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Erro ao salvar concessionária');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedConcessionaire) return;

    try {
      await cessionaireService.delete(selectedConcessionaire.id);
      await loadData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar concessionária:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Concessionárias</h2>
            <p className="text-gray-600 mt-1">
              {filteredConcessionaires.length} concessionária(s) encontrada(s)
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Concessionária
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campo de busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="CNPJ, cidade ou endereço"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro de Distribuidora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribuidora</label>
              <select
                value={distributorFilter}
                onChange={(e) => setDistributorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todas</option>
                {distributors.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
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
                    Distribuidora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade/UF
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                ) : filteredConcessionaires.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma concessionária encontrada
                    </td>
                  </tr>
                ) : (
                  currentPageConcessionaires.map((concessionaire) => (
                    <tr key={concessionaire.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {concessionaire.distributor?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {formatCNPJ(concessionaire.cnpj)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{concessionaire.streetName}</div>
                        <div className="text-xs text-gray-400">
                          CEP: {formatZipCode(concessionaire.zipCode)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {concessionaire.city} / {concessionaire.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            concessionaire.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {concessionaire.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(concessionaire)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(concessionaire)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(concessionaire)}
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
          {!loading && filteredConcessionaires.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredConcessionaires.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedConcessionaire ? 'Editar Concessionária' : 'Nova Concessionária'}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="distributorId" className="block text-sm font-medium text-gray-700 mb-1">
                  Distribuidora *
                </label>
                <select
                  id="distributorId"
                  name="distributorId"
                  required
                  value={formData.distributorId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {distributors.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ * (14 dígitos)
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  required
                  maxLength={14}
                  value={formData.cnpj}
                  onChange={handleFormChange}
                  placeholder="12345678901234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP * (8 dígitos)
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    maxLength={8}
                    value={formData.zipCode}
                    onChange={handleFormChange}
                    placeholder="12345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado * (UF)
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    maxLength={2}
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="SP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro *
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  required
                  value={formData.streetName}
                  onChange={handleFormChange}
                  placeholder="Rua das Flores"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleFormChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    name="complement"
                    value={formData.complement}
                    onChange={handleFormChange}
                    placeholder="Sala 101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={handleFormChange}
                  placeholder="Centro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleFormChange}
                  placeholder="São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && selectedConcessionaire && (
        <ConfirmModal
          title="Excluir Concessionária"
          message={`Tem certeza que deseja excluir a concessionária com CNPJ ${formatCNPJ(selectedConcessionaire.cnpj)}? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Modal de Visualização */}
      {showViewModal && selectedConcessionaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes da Concessionária
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
              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Status</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedConcessionaire.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedConcessionaire.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              {/* Informações da Distribuidora */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Distribuidora</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">
                    {selectedConcessionaire.distributor?.name || 'N/A'}
                  </p>
                </div>
              </div>

              {/* CNPJ */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">CNPJ</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-mono text-gray-900">
                    {formatCNPJ(selectedConcessionaire.cnpj)}
                  </p>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Endereço Completo</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Logradouro:</span>
                    <span className="text-gray-900">{selectedConcessionaire.streetName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Número:</span>
                    <span className="text-gray-900">{selectedConcessionaire.number}</span>
                  </div>
                  {selectedConcessionaire.complement && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-24">Complemento:</span>
                      <span className="text-gray-900">{selectedConcessionaire.complement}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Bairro:</span>
                    <span className="text-gray-900">{selectedConcessionaire.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Cidade:</span>
                    <span className="text-gray-900">{selectedConcessionaire.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Estado:</span>
                    <span className="text-gray-900">{selectedConcessionaire.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">CEP:</span>
                    <span className="text-gray-900 font-mono">
                      {formatZipCode(selectedConcessionaire.zipCode)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Empresa */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Empresa</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">
                    {selectedConcessionaire.company?.name || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Informações de Auditoria */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informações do Sistema</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedConcessionaire.id}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Criação</label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-500">Criado em:</span>
                        <span className="text-sm text-gray-900 text-right">
                          {new Date(selectedConcessionaire.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {selectedConcessionaire.createdByUser && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Criado por:</span>
                          <span className="text-sm text-gray-900 text-right font-medium">
                            {selectedConcessionaire.createdByUser.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedConcessionaire.updatedAt && (
                    <div className="border-t border-gray-200 pt-3">
                      <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Atualização</label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Atualizado em:</span>
                          <span className="text-sm text-gray-900 text-right">
                            {new Date(selectedConcessionaire.updatedAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {selectedConcessionaire.updatedByUser && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Atualizado por:</span>
                            <span className="text-sm text-gray-900 text-right font-medium">
                              {selectedConcessionaire.updatedByUser.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedConcessionaire.deactivatedAt && (
                    <div className="border-t border-gray-200 pt-3">
                      <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Desativação</label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-500">Desativado em:</span>
                          <span className="text-sm text-red-600 text-right">
                            {new Date(selectedConcessionaire.deactivatedAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {selectedConcessionaire.deactivatedByUser && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Desativado por:</span>
                            <span className="text-sm text-red-600 text-right font-medium">
                              {selectedConcessionaire.deactivatedByUser.name}
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
