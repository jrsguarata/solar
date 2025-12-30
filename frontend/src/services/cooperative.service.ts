import api from './api';
import type { Cooperative, CreateCooperativeDto, UpdateCooperativeDto } from '../models';

export const cooperativeService = {
  async getAll(): Promise<Cooperative[]> {
    const response = await api.get<Cooperative[]>('/cooperatives');
    return response.data;
  },

  async getById(id: string): Promise<Cooperative> {
    const response = await api.get<Cooperative>(`/cooperatives/${id}`);
    return response.data;
  },

  async create(data: CreateCooperativeDto): Promise<Cooperative> {
    const response = await api.post<Cooperative>('/cooperatives', data);
    return response.data;
  },

  async update(id: string, data: UpdateCooperativeDto): Promise<Cooperative> {
    const response = await api.patch<Cooperative>(`/cooperatives/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cooperatives/${id}`);
  },
};
