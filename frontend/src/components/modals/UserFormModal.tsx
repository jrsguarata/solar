import { useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../../services';
import { useAuth } from '../../presenters/useAuth';
import { formatMobile, unformatMobile } from '../../utils/formatters';
import type { User, Company, UserRole, CreateUserDto, UpdateUserDto } from '../../models';

interface UserFormModalProps {
  user: User | null;
  companies: Company[];
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormModal({ user, companies, onClose, onSuccess }: UserFormModalProps) {
  const isEditing = !!user;
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    role: user?.role || ('USER' as UserRole),
    companyId: user?.companyId || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Se for o campo mobile, aplicar máscara
    if (name === 'mobile') {
      const formatted = formatMobile(value);
      setFormData({
        ...formData,
        mobile: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      if (isEditing) {
        // Update
        const updateData: UpdateUserDto = {
          name: formData.name,
          email: formData.email,
          mobile: unformatMobile(formData.mobile), // Remove máscara antes de enviar
          role: formData.role,
          companyId: formData.companyId || undefined,
        };
        await userService.update(user.id, updateData);
      } else {
        // Create
        const createData: CreateUserDto = {
          name: formData.name,
          email: formData.email,
          mobile: unformatMobile(formData.mobile), // Remove máscara antes de enviar
          role: formData.role,
          password: formData.password,
          companyId: formData.companyId || undefined,
        };
        await userService.create(createData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
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

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Celular */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Celular *
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Perfil */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Perfil *
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USER">Usuário</option>
              <option value="OPERATOR">Operador</option>
              <option value="COADMIN">CoAdmin</option>
              {/* Ocultar opção ADMIN se usuário logado for COADMIN */}
              {currentUser?.role !== 'COADMIN' && (
                <option value="ADMIN">Admin</option>
              )}
            </select>
          </div>

          {/* Empresa */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa {currentUser?.role === 'COADMIN' ? '*' : ''}
            </label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required={currentUser?.role === 'COADMIN'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Nenhuma</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {currentUser?.role === 'COADMIN'
                ? 'Obrigatório para COADMIN.'
                : 'Opcional. ADMIN pode não ter empresa.'}
            </p>
          </div>

          {/* Senha (apenas para criação) */}
          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>
          )}

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
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
