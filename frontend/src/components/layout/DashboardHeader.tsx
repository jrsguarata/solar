import { useNavigate } from 'react-router-dom';
import { Sun, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../models';

export function DashboardHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determinar título do dashboard baseado no perfil
  const getDashboardTitle = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return 'Dashboard de Administração do Sistema';
      case UserRole.COADMIN:
        return 'Dashboard de Administração de Empresa';
      case UserRole.OPERATOR:
        return 'Dashboard de Operação';
      case UserRole.USER:
        return 'Dashboard do Cooperado';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Solar</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-700">
              {getDashboardTitle()}
            </h1>
          </div>

          {/* User Info e Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-base">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
