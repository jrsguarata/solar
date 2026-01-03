import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import contactService from '../../services/contact.service';
import type { Contact } from '../../models';
import { ContactStatus } from '../../models';

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: Array<{ value: ContactStatus; label: string; description: string }> = [
  {
    value: ContactStatus.READ,
    label: 'Lido',
    description: 'Contato foi lido e está sendo analisado',
  },
  {
    value: ContactStatus.SUSPECT,
    label: 'Encaminhado CRM',
    description: 'Cliente em potencial, encaminhado para o CRM',
  },
  {
    value: ContactStatus.RESOLVED,
    label: 'Resolvido',
    description: 'Solicitação de outro tipo já tratada',
  },
];

export function EditContactModal({ contact, onClose, onSuccess }: EditContactModalProps) {
  const [formData, setFormData] = useState<{
    status: ContactStatus | '';
    note: string;
  }>({
    status: '', // Sempre iniciar vazio para forçar seleção
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação manual: status é obrigatório
    if (!formData.status) {
      setError('Por favor, selecione um novo status para o contato');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: { status?: ContactStatus; note?: string } = {
        status: formData.status as ContactStatus,
        ...(formData.note && { note: formData.note }),
      };
      await contactService.update(contact.id, updateData);
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao atualizar contato:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar contato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Contato</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Informações do Contato (Read-only) */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">Informações do Contato</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{contact.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Cidade:</span>
                  <p className="font-medium text-gray-900">
                    {contact.city}/{contact.state}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Data:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ContactStatus })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um status...</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Atualize o status conforme o tratamento dado ao contato
              </p>
            </div>

            {/* Nova Nota Interna */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Nova Nota
              </label>
              <textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={4}
                placeholder="Adicione observações, comentários ou informações relevantes sobre este contato..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Esta nota ficará registrada com seu nome e data/hora
              </p>
            </div>

            {/* Notas Anteriores */}
            {contact.notes && contact.notes.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notas Anteriores ({contact.notes.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...contact.notes]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((note) => (
                      <div key={note.id} className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                        <div className="flex items-center gap-2 text-xs text-blue-700 mb-1">
                          <span className="font-semibold">{note.createdByUser.name}</span>
                          <span>•</span>
                          <span>{new Date(note.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-gray-900 whitespace-pre-wrap">{note.note}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Mensagem Original */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem Original
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">
                  Enviada em: {new Date(contact.createdAt).toLocaleString('pt-BR')}
                </p>
                <p className="text-gray-900 whitespace-pre-wrap text-sm">{contact.message}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
