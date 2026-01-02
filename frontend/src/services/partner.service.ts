import api from './api';
import type { Partner, CreatePartnerDto, UpdatePartnerDto } from '../models';

export const partnerService = {
  async getAll(): Promise<Partner[]> {
    const response = await api.get<Partner[]>('/partners');
    return response.data;
  },

  async getById(id: string): Promise<Partner> {
    const response = await api.get<Partner>(`/partners/${id}`);
    return response.data;
  },

  async create(data: CreatePartnerDto): Promise<Partner> {
    const response = await api.post<Partner>('/partners', data);
    return response.data;
  },

  async update(id: string, data: UpdatePartnerDto): Promise<Partner> {
    const response = await api.patch<Partner>(`/partners/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/partners/${id}`);
  },
};
