import { useState } from 'react';
import { X } from 'lucide-react';
import { companyService } from '../../services';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../../models';

interface CompanyFormModalProps {
  company: Company | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompanyFormModal({ company, onClose, onSuccess }: CompanyFormModalProps) {
  const isEditing = !!company;

  const [formData, setFormData] = useState({
    code: company?.code || '',
    name: company?.name || '',
    cnpj: company?.cnpj || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Format CNPJ as user types
    if (e.target.name === 'cnpj') {
      value = value.replace(/\D/g, ''); // Remove non-digits
      if (value.length > 14) value = value.substring(0, 14);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const formatCNPJDisplay = (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  const validateCNPJ = (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, '');
    return digits.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar CNPJ
    if (!validateCNPJ(formData.cnpj)) {
      setError('CNPJ inválido. Deve conter 14 dígitos.');
      return;
    }

    try {
      setLoading(true);

      const cnpj = formData.cnpj.replace(/\D/g, ''); // Save only digits

      if (isEditing) {
        // Update
        const updateData: UpdateCompanyDto = {
          code: formData.code,
          name: formData.name,
          cnpj,
        };
        await companyService.update(company.id, updateData);
      } else {
        // Create
        const createData: CreateCompanyDto = {
          code: formData.code,
          name: formData.name,
          cnpj,
        };
        await companyService.create(createData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Código */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              placeholder="COMP001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Código único da empresa</p>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* CNPJ */}
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ *
            </label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              required
              value={formatCNPJDisplay(formData.cnpj)}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Digite apenas os números</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
