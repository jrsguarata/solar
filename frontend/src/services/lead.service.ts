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
   * Criar lead manualmente (ADMIN/COADMIN/OPERATOR)
   */
  async createManual(leadData: CreateLeadDto): Promise<Lead> {
    const { data } = await api.post<Lead>('/leads/manual', leadData);
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
   * Avançar lead no funil
   */
  async advance(id: string): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}/advance`);
    return data;
  }

  /**
   * Marcar lead como ganho
   */
  async markAsWon(id: string, note?: string): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}/won`, { note });
    return data;
  }

  /**
   * Marcar lead como perdido
   */
  async markAsLost(id: string, note?: string): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}/lost`, { note });
    return data;
  }

  /**
   * Arquivar lead
   */
  async archive(id: string, note?: string): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}/archive`, { note });
    return data;
  }
}

export default new LeadService();
