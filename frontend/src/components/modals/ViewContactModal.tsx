import { X, Mail, Phone, MapPin, Calendar, MessageSquare, FileText } from 'lucide-react';
import type { Contact } from '../../models';
import { ContactStatus } from '../../models';

interface ViewContactModalProps {
  contact: Contact;
  onClose: () => void;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  PENDING: 'Pendente',
  READ: 'Lido',
  SUSPECT: 'Encaminhado CRM',
  RESOLVED: 'Resolvido',
};

const STATUS_COLORS: Record<ContactStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  READ: 'bg-blue-100 text-blue-800',
  SUSPECT: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

export function ViewContactModal({ contact, onClose }: ViewContactModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    } else if (phone.length === 10) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const formatCep = (cep: string) => {
    if (cep.length === 8) {
      return `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }
    return cep;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Contato</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                STATUS_COLORS[contact.status]
              }`}
            >
              {STATUS_LABELS[contact.status]}
            </span>
          </div>

          {/* Data de Criação */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data do Contato
              </label>
              <p className="text-gray-900 mt-1">{formatDate(contact.createdAt)}</p>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Pessoais
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="text-gray-900 mt-1">{contact.name}</p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900 mt-1">{formatPhone(contact.phone)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Endereço
            </h3>
            <div className="space-y-2 text-gray-900">
              <p>
                {contact.street}, {contact.number}
                {contact.complement && ` - ${contact.complement}`}
              </p>
              <p>{contact.neighborhood}</p>
              <p>
                {contact.city}/{contact.state}
              </p>
              <p>CEP: {formatCep(contact.cep)}</p>
            </div>
          </div>

          {/* Mensagem */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Mensagem
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Nota Interna */}
          {contact.note && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Nota Interna
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{contact.note}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
