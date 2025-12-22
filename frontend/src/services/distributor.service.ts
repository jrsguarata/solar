import api from './api';
import type { Distributor, CreateDistributorDto, UpdateDistributorDto } from '../models';

class DistributorService {
  /**
   * Listar todas as distribuidoras
   */
  async getAll(): Promise<Distributor[]> {
    const { data } = await api.get<Distributor[]>('/distributors');
    return data;
  }

  /**
   * Buscar distribuidora por ID
   */
  async getById(id: string): Promise<Distributor> {
    const { data } = await api.get<Distributor>(`/distributors/${id}`);
    return data;
  }

  /**
   * Criar nova distribuidora (ADMIN only)
   */
  async create(distributorData: CreateDistributorDto): Promise<Distributor> {
    const { data } = await api.post<Distributor>('/distributors', distributorData);
    return data;
  }

  /**
   * Atualizar distribuidora (ADMIN only)
   */
  async update(id: string, distributorData: UpdateDistributorDto): Promise<Distributor> {
    const { data } = await api.patch<Distributor>(`/distributors/${id}`, distributorData);
    return data;
  }

  /**
   * Remover distribuidora (ADMIN only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/distributors/${id}`);
  }
}

export default new DistributorService();
