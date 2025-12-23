import api from './api';
import type { User, CreateUserDto, UpdateUserDto } from '../models';

class UserService {
  /**
   * Listar todos os usuários
   */
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  }

  /**
   * Buscar usuário por ID
   */
  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  }

  /**
   * Criar novo usuário (ADMIN/COADMIN only)
   */
  async create(userData: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>('/users', userData);
    return data;
  }

  /**
   * Atualizar usuário (ADMIN/COADMIN only)
   */
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, userData);
    return data;
  }

  /**
   * Desativar usuário (ADMIN/COADMIN only)
   */
  async deactivate(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/deactivate`);
    return data;
  }

  /**
   * Ativar usuário (ADMIN/COADMIN only)
   */
  async activate(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/activate`);
    return data;
  }

  /**
   * Alterar senha do usuário
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(
      `/users/${id}/change-password`,
      {
        currentPassword,
        newPassword,
      },
    );
    return data;
  }
}

export default new UserService();
