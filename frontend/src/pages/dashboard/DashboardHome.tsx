import { useEffect, useState } from 'react';
import { Building2, Users, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { userService, companyService } from '../../services';

interface Stats {
  totalUsers: number;
  totalCompanies: number;
}

export function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalCompanies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [usersData, companiesData] = await Promise.all([
        userService.getAll(),
        companyService.getAll(),
      ]);

      setStats({
        totalUsers: usersData.length,
        totalCompanies: companiesData.length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
          <p className="text-gray-600 mt-1">Acompanhe as estatísticas do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total de Usuários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</h3>
                )}
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Usuários cadastrados no sistema</span>
            </div>
          </div>

          {/* Total de Empresas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Empresas</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompanies}</h3>
                )}
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Empresas cadastradas no sistema</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/dashboard/users"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                <p className="text-sm text-gray-600">Criar, editar e visualizar usuários</p>
              </div>
            </a>

            <a
              href="/dashboard/companies"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Gerenciar Empresas</p>
                <p className="text-sm text-gray-600">Criar, editar e visualizar empresas</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
