import api from './api';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../models';

class CompanyService {
  /**
   * Listar todas as empresas
   */
  async getAll(): Promise<Company[]> {
    const { data } = await api.get<Company[]>('/companies');
    return data;
  }

  /**
   * Buscar empresa por ID
   */
  async getById(id: string): Promise<Company> {
    const { data } = await api.get<Company>(`/companies/${id}`);
    return data;
  }

  /**
   * Buscar empresa por código (endpoint público - sem autenticação)
   * Usado nas landing pages para identificar a empresa
   */
  async getByCode(code: string): Promise<Partial<Company>> {
    const { data } = await api.get<Partial<Company>>(`/companies/by-code/${code}`);
    return data;
  }

  /**
   * Criar nova empresa (ADMIN only)
   */
  async create(companyData: CreateCompanyDto): Promise<Company> {
    const { data } = await api.post<Company>('/companies', companyData);
    return data;
  }

  /**
   * Atualizar empresa (ADMIN only)
   */
  async update(id: string, companyData: UpdateCompanyDto): Promise<Company> {
    const { data } = await api.patch<Company>(`/companies/${id}`, companyData);
    return data;
  }

  /**
   * Remover empresa (ADMIN only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  }
}

export default new CompanyService();
