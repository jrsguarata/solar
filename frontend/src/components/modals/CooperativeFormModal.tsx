import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cooperativeService, companyService, plantService } from '../../services';
import type { Cooperative, CreateCooperativeDto, UpdateCooperativeDto, Company, Plant } from '../../models';

interface CooperativeFormModalProps {
  cooperative: Cooperative | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CooperativeFormModal({ cooperative, onClose, onSuccess }: CooperativeFormModalProps) {
  const isEditing = !!cooperative;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  const [formData, setFormData] = useState({
    code: cooperative?.code || '',
    name: cooperative?.name || '',
    companyId: cooperative?.companyId || '',
    plantId: cooperative?.plantId || '',
    cnpj: cooperative?.cnpj || '',
    zipCode: cooperative?.zipCode || '',
    streetName: cooperative?.streetName || '',
    number: cooperative?.number || '',
    complement: cooperative?.complement || '',
    neighborhood: cooperative?.neighborhood || '',
    city: cooperative?.city || '',
    state: cooperative?.state || '',
    monthlyEnergy: cooperative?.monthlyEnergy?.toString() || '',
    foundationDate: cooperative?.foundationDate ? cooperative.foundationDate.split('T')[0] : '',
    operationApprovalDate: cooperative?.operationApprovalDate ? cooperative.operationApprovalDate.split('T')[0] : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
    loadPlants();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const loadPlants = async () => {
    try {
      const data = await plantService.getAll();
      setPlants(data);
    } catch (err) {
      console.error('Erro ao carregar usinas:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;

    // Format CNPJ - apenas números/letras, máximo 14
    if (e.target.name === 'cnpj') {
      value = value.replace(/[^0-9A-Za-z]/g, '');
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

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, zipCode }));

    // Buscar endereço quando CEP tiver 8 dígitos
    if (zipCode.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            streetName: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const formatCNPJDisplay = (cnpj: string) => {
    const clean = cnpj.replace(/[^0-9A-Za-z]/g, '');
    if (clean.length <= 14 && /^\d+$/.test(clean)) {
      // Se for numérico, formata como CNPJ
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return `${clean.slice(0, 2)}.${clean.slice(2)}`;
      if (clean.length <= 8) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
      if (clean.length <= 12) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8)}`;
      return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`;
    }
    return clean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const cnpj = formData.cnpj.replace(/[^0-9A-Za-z]/g, '');

      if (isEditing) {
        const updateData: UpdateCooperativeDto = {
          code: formData.code || undefined,
          name: formData.name,
          companyId: formData.companyId,
          plantId: formData.plantId,
          cnpj,
          zipCode: formData.zipCode,
          streetName: formData.streetName,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          monthlyEnergy: parseFloat(formData.monthlyEnergy),
          foundationDate: formData.foundationDate,
          operationApprovalDate: formData.operationApprovalDate || undefined,
        };
        await cooperativeService.update(cooperative.id, updateData);
      } else {
        const createData: CreateCooperativeDto = {
          code: formData.code,
          name: formData.name,
          companyId: formData.companyId,
          plantId: formData.plantId,
          cnpj,
          zipCode: formData.zipCode,
          streetName: formData.streetName,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          monthlyEnergy: parseFloat(formData.monthlyEnergy),
          foundationDate: formData.foundationDate,
          operationApprovalDate: formData.operationApprovalDate || undefined,
        };
        await cooperativeService.create(createData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar cooperativa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Cooperativa' : 'Nova Cooperativa'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
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
              placeholder="COOP001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Cooperativa *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Cooperativa Solar Central"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Empresa */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <select
              id="companyId"
              name="companyId"
              required
              value={formData.companyId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Usina */}
          <div>
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700 mb-1">
              Usina *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              value={formData.plantId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma usina</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
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
            <p className="text-xs text-gray-500 mt-1">Digite apenas números ou alfanuméricos (14 caracteres)</p>
          </div>

          {/* Seção de Endereço */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Endereço</h3>

            <div className="space-y-4">
              {/* CEP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleZipCodeChange}
                    placeholder="12345678"
                    maxLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digite o CEP para buscar automaticamente</p>
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
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              {/* Nome da Rua */}
              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua *
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  required
                  value={formData.streetName}
                  onChange={handleChange}
                  placeholder="Rua das Flores"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    placeholder="123"
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
                    placeholder="Sala 101"
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
                  placeholder="Centro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Cidade */}
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
                  placeholder="São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Seção de Dados Operacionais */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dados Operacionais</h3>

            <div className="space-y-4">
              {/* Energia Mensal */}
              <div>
                <label htmlFor="monthlyEnergy" className="block text-sm font-medium text-gray-700 mb-1">
                  Energia Mensal (kWh) *
                </label>
                <input
                  type="number"
                  id="monthlyEnergy"
                  name="monthlyEnergy"
                  required
                  step="0.01"
                  min="0"
                  value={formData.monthlyEnergy}
                  onChange={handleChange}
                  placeholder="5000.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Data de Fundação */}
              <div>
                <label htmlFor="foundationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Fundação *
                </label>
                <input
                  type="date"
                  id="foundationDate"
                  name="foundationDate"
                  required
                  value={formData.foundationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Data de Aprovação de Operação */}
              <div>
                <label htmlFor="operationApprovalDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Aprovação de Operação (Opcional)
                </label>
                <input
                  type="date"
                  id="operationApprovalDate"
                  name="operationApprovalDate"
                  value={formData.operationApprovalDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Cooperativa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
