import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(LeadNote)
    private readonly leadNoteRepository: Repository<LeadNote>,
    private readonly mailService: MailService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Criar registro no banco
    const lead = this.leadRepository.create(createLeadDto);
    const savedLead = await this.leadRepository.save(lead);

    // Enviar emails de forma assíncrona (não bloquear a resposta)
    this.sendNotificationEmails(createLeadDto).catch((error) => {
      this.logger.error('Erro ao enviar emails de notificação:', error);
    });

    return savedLead;
  }

  private async sendNotificationEmails(leadData: CreateLeadDto): Promise<void> {
    try {
      // Enviar notificação para a empresa
      await this.mailService.sendContactNotification(leadData);

      // Enviar confirmação para o cliente
      await this.mailService.sendContactConfirmation(leadData.email, leadData.name);

      this.logger.log(`Emails enviados com sucesso para ${leadData.email}`);
    } catch (error) {
      this.logger.error('Erro ao enviar emails:', error);
      throw error;
    }
  }

  async findAll(): Promise<Lead[]> {
    return this.leadRepository.find({
      relations: ['notes', 'notes.createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCompany(companyId: string): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead | null> {
    return this.leadRepository.findOne({
      where: { id },
      relations: ['notes', 'notes.createdByUser'],
      order: { notes: { createdAt: 'DESC' } },
    });
  }

  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
    userId: string,
  ): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['notes', 'notes.createdByUser'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    // Atualizar status se fornecido
    if (updateLeadDto.status) {
      lead.status = updateLeadDto.status;
      await this.leadRepository.save(lead);
    }

    // Criar nova nota se fornecida
    if (updateLeadDto.note) {
      const note = this.leadNoteRepository.create({
        leadId: id,
        note: updateLeadDto.note,
        createdBy: userId,
      });
      await this.leadNoteRepository.save(note);
    }

    // Retornar lead atualizado com notas
    const updatedLead = await this.findOne(id);
    if (!updatedLead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }
    return updatedLead;
  }
}
