import api from './api';
import type { LeadProposal, CreateLeadProposalDto } from '../models';

class LeadProposalService {
  /**
   * Criar nova proposta com upload de arquivo
   */
  async create(
    leadId: string,
    proposalData: CreateLeadProposalDto,
    file: File
  ): Promise<LeadProposal> {
    const formData = new FormData();
    formData.append('quotaKwh', proposalData.quotaKwh.toString());
    formData.append('monthlyValue', proposalData.monthlyValue.toString());

    if (proposalData.monthlySavings) {
      formData.append('monthlySavings', proposalData.monthlySavings.toString());
    }

    if (proposalData.notes) {
      formData.append('notes', proposalData.notes);
    }

    formData.append('file', file);

    const { data } = await api.post<LeadProposal>(
      `/leads/${leadId}/proposals`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  }

  /**
   * Listar todas as propostas de um lead
   */
  async getByLead(leadId: string): Promise<LeadProposal[]> {
    const { data } = await api.get<LeadProposal[]>(`/leads/${leadId}/proposals`);
    return data;
  }

  /**
   * Buscar última proposta de um lead
   */
  async getLatest(leadId: string): Promise<LeadProposal | null> {
    const { data } = await api.get<LeadProposal>(`/leads/${leadId}/proposals/latest`);
    return data;
  }

  /**
   * Buscar proposta específica por ID
   */
  async getById(proposalId: string): Promise<LeadProposal> {
    const { data } = await api.get<LeadProposal>(`/leads/proposals/${proposalId}`);
    return data;
  }

  /**
   * Download do arquivo da proposta
   */
  async downloadFile(proposalId: string): Promise<Blob> {
    const { data } = await api.get(`/leads/proposals/${proposalId}/download`, {
      responseType: 'blob',
    });
    return data;
  }

  /**
   * Excluir proposta (ADMIN only)
   */
  async delete(proposalId: string): Promise<void> {
    await api.delete(`/leads/proposals/${proposalId}`);
  }
}

export default new LeadProposalService();
