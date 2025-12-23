import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, UserCircle, Lock, FileText } from 'lucide-react';

const menuItems = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Visão Geral',
  },
  {
    path: '/dashboard/companies',
    icon: Building2,
    label: 'Empresas',
  },
  {
    path: '/dashboard/users',
    icon: Users,
    label: 'Usuários',
  },
  {
    path: '/dashboard/audit-logs',
    icon: FileText,
    label: 'Audit Logs',
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
  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-73px)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
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
