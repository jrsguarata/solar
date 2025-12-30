import { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, User } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { companyService } from '../../services';
import type { Company } from '../../models';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/formatters';

export function MyCompanyPage() {
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.companyId) {
        setError('Usuário não está vinculado a nenhuma empresa');
        return;
      }

      const data = await companyService.getById(user.companyId);
      setCompany(data);
    } catch (err: any) {
      console.error('Erro ao carregar empresa:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 text-center">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 text-center">Nenhuma empresa encontrada</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minha Empresa</h1>
            <p className="text-gray-600">Informações da empresa à qual você pertence</p>
          </div>
        </div>

        {/* Company Details Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
            <p className="text-gray-600 mt-1">Código: {company.code}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
                  <p className="text-gray-900">{company.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                  <p className="text-gray-900">{company.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CNPJ</label>
                  <p className="text-gray-900 font-mono">
                    {company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                  </p>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CEP</label>
                  <p className="text-gray-900 font-mono">
                    {company.zipCode.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Rua</label>
                  <p className="text-gray-900">{company.streetName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cidade</label>
                  <p className="text-gray-900">{company.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  <p className="text-gray-900">{company.state}</p>
                </div>
              </div>
            </div>

            {/* Informações de Auditoria */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Informações de Registro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Criado em</label>
                    <p className="text-gray-700">{formatDate(company.createdAt)}</p>
                  </div>
                </div>
                {company.createdByUser && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Criado por</label>
                      <p className="text-gray-700">{company.createdByUser.name}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Última atualização</label>
                    <p className="text-gray-700">{formatDate(company.updatedAt)}</p>
                  </div>
                </div>
                {company.updatedByUser && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Atualizado por</label>
                      <p className="text-gray-700">{company.updatedByUser.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Você está visualizando as informações da empresa à qual você está vinculado.
            Para solicitar alterações, entre em contato com um administrador do sistema.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
