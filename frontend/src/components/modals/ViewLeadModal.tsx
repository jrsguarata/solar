import { X } from 'lucide-react';
import type { Lead } from '../../models';

interface ViewLeadModalProps {
  lead: Lead;
  onClose: () => void;
}

export function ViewLeadModal({ lead, onClose }: ViewLeadModalProps) {
  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    if (phone.length === 10) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      LEAD: 'bg-blue-100 text-blue-800',
      SUSPECT: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      PROPOSAL_SENT: 'bg-purple-100 text-purple-800',
      NEGOTIATION: 'bg-orange-100 text-orange-800',
      WON: 'bg-green-600 text-white',
      LOST: 'bg-red-100 text-red-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };

    const statusLabels: Record<string, string> = {
      LEAD: 'Lead',
      SUSPECT: 'Suspeito',
      QUALIFIED: 'Qualificado',
      PROPOSAL_SENT: 'Proposta Enviada',
      NEGOTIATION: 'Negociação',
      WON: 'Ganho',
      LOST: 'Perdido',
      ARCHIVED: 'Arquivado',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getSourceLabel = (source: string) => {
    const sourceLabels: Record<string, string> = {
      LANDING_PAGE: 'Landing Page',
      MANUAL: 'Criação Manual',
    };
    return sourceLabels[source] || source;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Detalhes do Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status e Origem */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              {getStatusBadge(lead.status)}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Origem</p>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                {getSourceLabel(lead.source)}
              </span>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{lead.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{lead.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium">{formatPhone(lead.phone)}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">CEP</p>
                <p className="font-medium">{lead.cep || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rua</p>
                <p className="font-medium">{lead.street || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Número</p>
                <p className="font-medium">{lead.number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Complemento</p>
                <p className="font-medium">{lead.complement || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bairro</p>
                <p className="font-medium">{lead.neighborhood || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cidade</p>
                <p className="font-medium">{lead.city || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium">{lead.state || '-'}</p>
              </div>
            </div>
          </div>

          {/* Mensagem */}
          {lead.message && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mensagem</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Notas */}
          {lead.notes && lead.notes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas</h3>
              <div className="space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{note.note}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{note.createdByUser?.name || 'Sistema'}</span>
                      <span>•</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações de Auditoria */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Criado em: </span>
                <span className="text-gray-900">{formatDate(lead.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Atualizado em: </span>
                <span className="text-gray-900">{formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
