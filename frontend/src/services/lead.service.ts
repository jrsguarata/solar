import api from './api';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '../models';

class LeadService {
  /**
   * Criar novo lead (público - formulário da landing page)
   */
  async create(leadData: CreateLeadDto): Promise<Lead> {
    const { data } = await api.post<Lead>('/leads', leadData);
    return data;
  }

  /**
   * Listar todos os leads (ADMIN/COADMIN only)
   */
  async getAll(): Promise<Lead[]> {
    const { data } = await api.get<Lead[]>('/leads');
    return data;
  }

  /**
   * Buscar lead por ID (ADMIN/COADMIN only)
   */
  async getById(id: string): Promise<Lead> {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  }

  /**
   * Atualizar lead (ADMIN/COADMIN only)
   */
  async update(id: string, leadData: UpdateLeadDto): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}`, leadData);
    return data;
  }

  /**
   * Remover lead (ADMIN only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  }

  /**
   * Listar leads de uma empresa específica
   */
  async getByCompany(companyId: string): Promise<Lead[]> {
    const { data } = await api.get<Lead[]>(`/leads/company/${companyId}`);
    return data;
  }
}

export default new LeadService();
