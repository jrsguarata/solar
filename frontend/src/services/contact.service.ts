import api from './api';
import type { Contact, CreateContactDto, UpdateContactDto } from '../models';

class ContactService {
  /**
   * Criar novo contato (público - formulário da landing page)
   */
  async create(contactData: CreateContactDto): Promise<Contact> {
    const { data } = await api.post<Contact>('/contacts', contactData);
    return data;
  }

  /**
   * Listar todos os contatos (ADMIN/COADMIN only)
   */
  async getAll(): Promise<Contact[]> {
    const { data} = await api.get<Contact[]>('/contacts');
    return data;
  }

  /**
   * Buscar contato por ID (ADMIN/COADMIN only)
   */
  async getById(id: string): Promise<Contact> {
    const { data } = await api.get<Contact>(`/contacts/${id}`);
    return data;
  }

  /**
   * Atualizar contato (ADMIN/COADMIN only)
   */
  async update(id: string, contactData: UpdateContactDto): Promise<Contact> {
    const { data } = await api.patch<Contact>(`/contacts/${id}`, contactData);
    return data;
  }

  /**
   * Remover contato (ADMIN only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/contacts/${id}`);
  }
}

export default new ContactService();
