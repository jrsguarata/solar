import { X } from 'lucide-react';
import type { Plant } from '../../models';

interface ViewPlantModalProps {
  plant: Plant;
  onClose: () => void;
}

export function ViewPlantModal({ plant, onClose }: ViewPlantModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Detalhes da Usina</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
              <p className="text-gray-900">{plant.code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Empresa</label>
              <p className="text-gray-900">{plant.company?.name || '-'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
            <p className="text-gray-900">{plant.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Potência Instalada (kVA)</label>
              <p className="text-gray-900">{Number(plant.installedPower).toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Concessionária</label>
              <p className="text-gray-900">{plant.concessionaire?.distributor?.name || '-'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Unidade Consumidora</label>
            <p className="text-gray-900 font-mono">{plant.consumerUnit}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CEP</label>
                <p className="text-gray-900">{plant.zipCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado (UF)</label>
                <p className="text-gray-900">{plant.state}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Rua</label>
              <p className="text-gray-900">{plant.streetName}</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Cidade</label>
              <p className="text-gray-900">{plant.city}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status Atual</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  plant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plant.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              {!plant.isActive && plant.deactivatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Desativado em</label>
                  <p className="text-gray-900">{new Date(plant.deactivatedAt).toLocaleString('pt-BR')}</p>
                  {plant.deactivatedByUser && (
                    <p className="text-sm text-gray-500">por {plant.deactivatedByUser.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informações de Auditoria</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Criado em</label>
                <p className="text-gray-900">{new Date(plant.createdAt).toLocaleString('pt-BR')}</p>
                {plant.createdByUser && (
                  <p className="text-sm text-gray-500">por {plant.createdByUser.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Atualizado em</label>
                <p className="text-gray-900">{new Date(plant.updatedAt).toLocaleString('pt-BR')}</p>
                {plant.updatedByUser && (
                  <p className="text-sm text-gray-500">por {plant.updatedByUser.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
