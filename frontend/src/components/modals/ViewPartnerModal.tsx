import { X } from 'lucide-react';
import type { Partner } from '../../models';

interface ViewPartnerModalProps {
  partner: Partner;
  onClose: () => void;
}

export function ViewPartnerModal({ partner, onClose }: ViewPartnerModalProps) {
  const formatCNPJ = (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalhes do Parceiro
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informações Básicas</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Código</label>
                <p className="text-sm text-gray-900 font-medium">{partner.code}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Nome do Parceiro</label>
                <p className="text-lg font-medium text-gray-900">{partner.name}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">CNPJ</label>
                <p className="text-lg font-mono text-gray-900">{formatCNPJ(partner.cnpj)}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    partner.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {partner.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Endereço</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">CEP</label>
                <p className="text-sm text-gray-900">{partner.zipCode}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Logradouro</label>
                <p className="text-sm text-gray-900">{partner.streetName}</p>
              </div>
              <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Número</label>
                  <p className="text-sm text-gray-900">{partner.number}</p>
                </div>
                {partner.complement && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Complemento</label>
                    <p className="text-sm text-gray-900">{partner.complement}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Bairro</label>
                <p className="text-sm text-gray-900">{partner.neighborhood}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Cidade/Estado</label>
                <p className="text-sm text-gray-900">
                  {partner.city} - {partner.state}
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
                <p className="text-sm text-gray-900 font-mono">{partner.id}</p>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Criação</label>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Criado em:</span>
                    <span className="text-sm text-gray-900 text-right">
                      {new Date(partner.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {partner.createdByUser && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Criado por:</span>
                      <span className="text-sm text-gray-900 text-right font-medium">
                        {partner.createdByUser.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {partner.updatedAt && (
                <div className="border-t border-gray-200 pt-3">
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Atualização</label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Atualizado em:</span>
                      <span className="text-sm text-gray-900 text-right">
                        {new Date(partner.updatedAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {partner.updatedByUser && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-500">Atualizado por:</span>
                        <span className="text-sm text-gray-900 text-right font-medium">
                          {partner.updatedByUser.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {partner.deactivatedAt && (
                <div className="border-t border-gray-200 pt-3">
                  <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Auditoria de Desativação</label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Desativado em:</span>
                      <span className="text-sm text-red-600 text-right">
                        {new Date(partner.deactivatedAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {partner.deactivatedByUser && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-500">Desativado por:</span>
                        <span className="text-sm text-red-600 text-right font-medium">
                          {partner.deactivatedByUser.name}
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
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
