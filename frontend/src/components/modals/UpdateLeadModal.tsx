import { useState } from 'react';
import { X } from 'lucide-react';
import type { Lead, UpdateLeadDto, LeadStatus } from '../../models';
import leadService from '../../services/lead.service';

interface UpdateLeadModalProps {
  lead: Lead;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateLeadModal({ lead, onClose, onSuccess }: UpdateLeadModalProps) {
  const [formData, setFormData] = useState<UpdateLeadDto>({
    status: lead.status,
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await leadService.update(lead.id, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar lead');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'LEAD', label: 'Lead' },
    { value: 'SUSPECT', label: 'Suspeito' },
    { value: 'QUALIFIED', label: 'Qualificado' },
    { value: 'PROPOSAL_SENT', label: 'Proposta Enviada' },
    { value: 'NEGOTIATION', label: 'Negociação' },
    { value: 'WON', label: 'Ganho' },
    { value: 'LOST', label: 'Perdido' },
    { value: 'ARCHIVED', label: 'Arquivado' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Atualizar Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Lead Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Informações do Lead</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Nome: </span>
                <span className="text-gray-900">{lead.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Email: </span>
                <span className="text-gray-900">{lead.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Telefone: </span>
                <span className="text-gray-900">{lead.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Cidade: </span>
                <span className="text-gray-900">{lead.city}/{lead.state}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adicionar Nota (opcional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Digite uma nota sobre esta atualização..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Esta nota será adicionada ao histórico do lead
            </p>
          </div>

          {/* Previous Notes */}
          {lead.notes && lead.notes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notas Anteriores</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {lead.notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded p-3 text-sm">
                    <p className="text-gray-700">{note.note}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {note.createdByUser?.name || 'Sistema'} • {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
                {lead.notes.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    + {lead.notes.length - 3} notas anteriores
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
