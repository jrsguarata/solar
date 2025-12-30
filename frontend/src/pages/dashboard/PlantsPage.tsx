import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Pagination } from '../../components/common/Pagination';
import { plantService } from '../../services';
import type { Plant } from '../../models';
import { PlantFormModal } from '../../components/modals/PlantFormModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';

export function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPlants();
    setCurrentPage(1);
  }, [plants, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await plantService.getAll();
      setPlants(data);
    } catch (error) {
      console.error('Erro ao carregar usinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlants = () => {
    let filtered = plants;
    if (searchTerm) {
      filtered = filtered.filter((plant) =>
        plant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlants(filtered);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPagePlants = filteredPlants.slice(startIndex, endIndex);

  const handleCreate = () => {
    setSelectedPlant(null);
    setShowFormModal(true);
  };

  const handleEdit = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowFormModal(true);
  };

  const handleDelete = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlant) return;
    try {
      await plantService.delete(selectedPlant.id);
      await loadData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar usina:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usinas</h2>
            <p className="text-gray-600 mt-1">{filteredPlants.length} usina(s) encontrada(s)</p>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            <Plus className="w-5 h-5" />
            Nova Usina
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome ou código" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potência (kWp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade/UF</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div><p className="mt-2 text-gray-600">Carregando...</p></td></tr>
                ) : filteredPlants.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Nenhuma usina encontrada</td></tr>
                ) : (
                  currentPagePlants.map((plant) => (
                    <tr key={plant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{plant.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{plant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{plant.company?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{Number(plant.installedPower).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{plant.city} - {plant.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(plant)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(plant)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredPlants.length > 0 && (
            <Pagination currentPage={currentPage} totalItems={filteredPlants.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>

      {showFormModal && (
        <PlantFormModal plant={selectedPlant} onClose={() => setShowFormModal(false)} onSuccess={() => { setShowFormModal(false); loadData(); }} />
      )}

      {showDeleteModal && selectedPlant && (
        <ConfirmModal title="Excluir Usina" message={`Tem certeza que deseja excluir a usina "{selectedPlant.name}"? Esta ação não pode ser desfeita.`} confirmText="Excluir" cancelText="Cancelar" onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} />
      )}
    </DashboardLayout>
  );
}
