import api from './api';
import type {
  Concessionaire,
  CreateConcessionaireDto,
  UpdateConcessionaireDto,
} from '../models';

class ConcessionaireService {
  /**
   * Listar todas as concessionárias
   * ADMIN vê todas, COADMIN vê apenas da sua empresa
   */
  async getAll(): Promise<Concessionaire[]> {
    const { data } = await api.get<Concessionaire[]>('/concessionaires');
    return data;
  }

  /**
   * Buscar concessionária por ID
   */
  async getById(id: string): Promise<Concessionaire> {
    const { data } = await api.get<Concessionaire>(`/concessionaires/${id}`);
    return data;
  }

  /**
   * Criar nova concessionária (ADMIN ou COADMIN)
   */
  async create(
    concessionaireData: CreateConcessionaireDto,
  ): Promise<Concessionaire> {
    const { data } = await api.post<Concessionaire>(
      '/concessionaires',
      concessionaireData,
    );
    return data;
  }

  /**
   * Atualizar concessionária
   */
  async update(
    id: string,
    concessionaireData: UpdateConcessionaireDto,
  ): Promise<Concessionaire> {
    const { data } = await api.patch<Concessionaire>(
      `/concessionaires/${id}`,
      concessionaireData,
    );
    return data;
  }

  /**
   * Remover concessionária (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/concessionaires/${id}`);
  }
}

export default new ConcessionaireService();
