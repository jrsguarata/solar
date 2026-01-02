import { X } from 'lucide-react';
import type { Cooperative } from '../../models';

interface ViewCooperativeModalProps {
  cooperative: Cooperative;
  onClose: () => void;
}

export function ViewCooperativeModal({ cooperative, onClose }: ViewCooperativeModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Detalhes da Cooperativa</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
              <p className="text-gray-900">{cooperative.code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Empresa</label>
              <p className="text-gray-900">{cooperative.company?.name || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
              <p className="text-gray-900">{cooperative.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Usina</label>
              <p className="text-gray-900">{cooperative.plant?.name || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">CNPJ</label>
              <p className="text-gray-900 font-mono">{formatCNPJ(cooperative.cnpj)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Energia Mensal (kWh)</label>
              <p className="text-gray-900">{cooperative.monthlyEnergy.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data de Fundação</label>
              <p className="text-gray-900">{formatDate(cooperative.foundationDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data de Aprovação de Operação</label>
              <p className="text-gray-900">{cooperative.operationApprovalDate ? formatDate(cooperative.operationApprovalDate) : '-'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CEP</label>
                <p className="text-gray-900">{cooperative.zipCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado (UF)</label>
                <p className="text-gray-900">{cooperative.state}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Rua</label>
              <p className="text-gray-900">{cooperative.streetName}</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Cidade</label>
              <p className="text-gray-900">{cooperative.city}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status Atual</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  cooperative.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cooperative.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              {!cooperative.isActive && cooperative.deactivatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Desativado em</label>
                  <p className="text-gray-900">{new Date(cooperative.deactivatedAt).toLocaleString('pt-BR')}</p>
                  {cooperative.deactivatedByUser && (
                    <p className="text-sm text-gray-500">por {cooperative.deactivatedByUser.name}</p>
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
                <p className="text-gray-900">{new Date(cooperative.createdAt).toLocaleString('pt-BR')}</p>
                {cooperative.createdByUser && (
                  <p className="text-sm text-gray-500">por {cooperative.createdByUser.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Atualizado em</label>
                <p className="text-gray-900">{new Date(cooperative.updatedAt).toLocaleString('pt-BR')}</p>
                {cooperative.updatedByUser && (
                  <p className="text-sm text-gray-500">por {cooperative.updatedByUser.name}</p>
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
