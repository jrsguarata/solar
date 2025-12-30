import api from './api';
import type { Plant, CreatePlantDto, UpdatePlantDto } from '../models';

export const plantService = {
  async getAll(): Promise<Plant[]> {
    const response = await api.get<Plant[]>('/plants');
    return response.data;
  },

  async getById(id: string): Promise<Plant> {
    const response = await api.get<Plant>(`/plants/${id}`);
    return response.data;
  },

  async create(data: CreatePlantDto): Promise<Plant> {
    const response = await api.post<Plant>('/plants', data);
    return response.data;
  },

  async update(id: string, data: UpdatePlantDto): Promise<Plant> {
    const response = await api.patch<Plant>(`/plants/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/plants/${id}`);
  },
};
