import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { cooperativeService } from '../../services';
import type { Cooperative } from '../../models';
import { CooperativeFormModal } from '../../components/modals/CooperativeFormModal';
import { ViewCooperativeModal } from '../../components/modals/ViewCooperativeModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';

export function CooperativesPage() {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [filteredCooperatives, setFilteredCooperatives] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCooperatives();
    setCurrentPage(1);
  }, [cooperatives, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await cooperativeService.getAll();
      setCooperatives(data);
    } catch (error) {
      console.error('Erro ao carregar cooperativas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCooperatives = () => {
    let filtered = cooperatives;
    if (searchTerm) {
      filtered = filtered.filter((cooperative) =>
        cooperative.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cooperative.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cooperative.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCooperatives(filtered);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCooperatives = filteredCooperatives.slice(startIndex, endIndex);

  const handleCreate = () => {
    setSelectedCooperative(null);
    setShowFormModal(true);
  };

  const handleView = (cooperative: Cooperative) => {
    setSelectedCooperative(cooperative);
    setShowViewModal(true);
  };

  const handleEdit = (cooperative: Cooperative) => {
    setSelectedCooperative(cooperative);
    setShowFormModal(true);
  };

  const handleDelete = (cooperative: Cooperative) => {
    setSelectedCooperative(cooperative);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCooperative) return;
    try {
      await cooperativeService.delete(selectedCooperative.id);
      await loadData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar cooperativa:', error);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cooperativas</h2>
            <p className="text-gray-600 mt-1">{filteredCooperatives.length} cooperativa(s) encontrada(s)</p>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            <Plus className="w-5 h-5" />
            Nova Cooperativa
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome, código ou CNPJ" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Energia Mensal (kWh)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade/UF</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div><p className="mt-2 text-gray-600">Carregando...</p></td></tr>
                ) : filteredCooperatives.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Nenhuma cooperativa encontrada</td></tr>
                ) : (
                  currentPageCooperatives.map((cooperative) => (
                    <tr key={cooperative.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{cooperative.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{cooperative.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{cooperative.company?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{formatCNPJ(cooperative.cnpj)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{cooperative.monthlyEnergy.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{cooperative.city} - {cooperative.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleView(cooperative)} className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="Visualizar"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEdit(cooperative)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(cooperative)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredCooperatives.length > 0 && (
            <Pagination currentPage={currentPage} totalItems={filteredCooperatives.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>

      {showFormModal && (
        <CooperativeFormModal cooperative={selectedCooperative} onClose={() => setShowFormModal(false)} onSuccess={() => { setShowFormModal(false); loadData(); }} />
      )}

      {showViewModal && selectedCooperative && (
        <ViewCooperativeModal cooperative={selectedCooperative} onClose={() => setShowViewModal(false)} />
      )}

      {showDeleteModal && selectedCooperative && (
        <ConfirmModal title="Excluir Cooperativa" message={`Tem certeza que deseja excluir a cooperativa "${selectedCooperative.name}"? Esta ação não pode ser desfeita.`} confirmText="Excluir" cancelText="Cancelar" onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} />
      )}
    </DashboardLayout>
  );
}
