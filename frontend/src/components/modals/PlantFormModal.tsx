import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { plantService, companyService, cessionaireService } from '../../services';
import type { Plant, CreatePlantDto, UpdatePlantDto, Company, Concessionaire } from '../../models';

interface PlantFormModalProps {
  plant: Plant | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlantFormModal({ plant, onClose, onSuccess }: PlantFormModalProps) {
  const isEditing = !!plant;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);

  const [formData, setFormData] = useState({
    code: plant?.code || '',
    name: plant?.name || '',
    companyId: plant?.companyId || '',
    installedPower: plant?.installedPower?.toString() || '',
    concessionaryId: plant?.concessionaryId || '',
    consumerUnit: plant?.consumerUnit || '',
    zipCode: plant?.zipCode || '',
    streetName: plant?.streetName || '',
    number: plant?.number || '',
    complement: plant?.complement || '',
    neighborhood: plant?.neighborhood || '',
    city: plant?.city || '',
    state: plant?.state || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
    loadConcessionaires();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const loadConcessionaires = async () => {
    try {
      const data = await cessionaireService.getAll();
      setConcessionaires(data);
    } catch (err) {
      console.error('Erro ao carregar concessionárias:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;

    if (e.target.name === 'zipCode') {
      value = value.replace(/\D/g, '');
      if (value.length > 8) value = value.substring(0, 8);
    }

    if (e.target.name === 'state') {
      value = value.toUpperCase().replace(/[^A-Z]/g, '');
      if (value.length > 2) value = value.substring(0, 2);
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const data = {
        ...formData,
        installedPower: parseFloat(formData.installedPower),
      };

      if (isEditing) {
        await plantService.update(plant.id, data as UpdatePlantDto);
      } else {
        await plantService.create(data as CreatePlantDto);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar usina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Usina' : 'Nova Usina'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Código *</label>
              <input type="text" name="code" required value={formData.code} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Empresa *</label>
              <select name="companyId" required value={formData.companyId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Selecione</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Potência Instalada (kVA) *</label>
              <input type="number" step="0.01" name="installedPower" required value={formData.installedPower} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Concessionária *</label>
              <select name="concessionaryId" required value={formData.concessionaryId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Selecione</option>
                {concessionaires.map(c => <option key={c.id} value={c.id}>{c.distributor?.name || c.cnpj}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unidade Consumidora *</label>
            <input type="text" name="consumerUnit" required value={formData.consumerUnit} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Código da unidade consumidora" />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CEP *</label>
                <input type="text" name="zipCode" required maxLength={8} value={formData.zipCode} onChange={handleChange} placeholder="12345678" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado (UF) *</label>
                <input type="text" name="state" required maxLength={2} value={formData.state} onChange={handleChange} placeholder="SP" className="w-full px-3 py-2 border rounded-lg uppercase" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Rua *</label>
              <input type="text" name="streetName" required value={formData.streetName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número *</label>
                <input type="text" name="number" required value={formData.number} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="123" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Complemento</label>
                <input type="text" name="complement" value={formData.complement} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Sala 101" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Bairro *</label>
              <input type="text" name="neighborhood" required value={formData.neighborhood} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Cidade *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg">{loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
