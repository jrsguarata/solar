import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, UserCircle, Lock, FileText, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../models';

interface MenuItem {
  path: string;
  icon: any;
  label: string;
  roles?: UserRole[]; // Se não especificado, todos os perfis podem ver
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Visão Geral',
  },
  {
    path: '/dashboard/companies',
    icon: Building2,
    label: 'Empresas',
    roles: [UserRole.ADMIN], // Apenas ADMIN
  },
  {
    path: '/dashboard/users',
    icon: Users,
    label: 'Usuários',
  },
  {
    path: '/dashboard/concessionaires',
    icon: Zap,
    label: 'Concessionárias',
    roles: [UserRole.COADMIN, UserRole.OPERATOR, UserRole.USER], // Não ADMIN
  },
  {
    path: '/dashboard/audit-logs',
    icon: FileText,
    label: 'Audit Logs',
    roles: [UserRole.ADMIN], // Apenas ADMIN
  },
  {
    path: '/dashboard/profile',
    icon: UserCircle,
    label: 'Meu Perfil',
  },
  {
    path: '/dashboard/password',
    icon: Lock,
    label: 'Senha',
  },
];

export function Sidebar() {
  const { user } = useAuthStore();

  // Filtrar itens de menu baseado no perfil do usuário
  const visibleMenuItems = menuItems.filter((item) => {
    // Se não tem restrição de roles, mostra para todos
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // Se tem restrição, verifica se o perfil do usuário está na lista
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-73px)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
