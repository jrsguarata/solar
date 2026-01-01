import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { companyService } from '../../services';
import { useCep } from '../../hooks/useCep';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../../models';

interface CompanyFormModalProps {
  company: Company | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompanyFormModal({ company, onClose, onSuccess }: CompanyFormModalProps) {
  const isEditing = !!company;
  const { validateCep, formatCep, loading: cepLoading, error: cepError, clearError } = useCep();

  const [formData, setFormData] = useState({
    name: company?.name || '',
    cnpj: company?.cnpj || '',
    code: company?.code || '',
    zipCode: company?.zipCode || '',
    streetName: company?.streetName || '',
    number: company?.number || '',
    complement: company?.complement || '',
    neighborhood: company?.neighborhood || '',
    city: company?.city || '',
    state: company?.state || '',
    isActive: company?.isActive ?? true,
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

    // Format state - apenas letras maiúsculas, máximo 2
    if (e.target.name === 'state') {
      value = value.toUpperCase().replace(/[^A-Z]/g, '');
      if (value.length > 2) value = value.substring(0, 2);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setFormData(prev => ({ ...prev, zipCode: formatted }));
    clearError();
  };

  const handleCepBlur = async () => {
    if (formData.zipCode.replace(/\D/g, '').length === 8) {
      const cepData = await validateCep(formData.zipCode);

      if (cepData) {
        setFormData(prev => ({
          ...prev,
          streetName: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf,
        }));
      }
    }
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
          code: formData.code || undefined,
          name: formData.name,
          cnpj,
          zipCode: formData.zipCode.replace(/\D/g, ''),
          streetName: formData.streetName,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          isActive: formData.isActive,
        };
        await companyService.update(company.id, updateData);
      } else {
        // Create
        const createData: CreateCompanyDto = {
          code: formData.code,
          name: formData.name,
          cnpj,
          zipCode: formData.zipCode.replace(/\D/g, ''),
          streetName: formData.streetName,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
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

          {/* Status - apenas na edição */}
          {isEditing && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                    Status da Empresa
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.isActive
                      ? 'Empresa ativa e operacional'
                      : 'Empresa desativada (pode ser reativada)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Seção de Endereço */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Endereço</h3>

            <div className="space-y-4">
              {/* CEP */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleCepChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
                {cepError && (
                  <p className="text-xs text-red-600 mt-1">{cepError}</p>
                )}
              </div>

              {/* Nome da Rua */}
              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro *
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  required
                  value={formData.streetName}
                  onChange={handleChange}
                  readOnly={cepLoading}
                  placeholder="Avenida Paulista"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-50"
                />
              </div>

              {/* Número e Complemento */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    name="complement"
                    value={formData.complement}
                    onChange={handleChange}
                    placeholder="Sala 42 (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bairro */}
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={handleChange}
                  readOnly={cepLoading}
                  placeholder="Bela Vista"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-50"
                />
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={cepLoading}
                    placeholder="São Paulo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    disabled={cepLoading}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
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
