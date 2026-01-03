import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateContactDto } from './dto/create-lead.dto';
import { UpdateContactDto } from './dto/update-lead.dto';
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

  async create(createContactDto: CreateContactDto): Promise<Lead> {
    // Criar registro no banco
    const lead = this.leadRepository.create(createContactDto);
    const savedLead = await this.leadRepository.save(contact);

    // Enviar emails de forma assíncrona (não bloquear a resposta)
    this.sendNotificationEmails(createContactDto).catch((error) => {
      this.logger.error('Erro ao enviar emails de notificação:', error);
    });

    return savedLead;
  }

  private async sendNotificationEmails(contactData: CreateContactDto): Promise<void> {
    try {
      // Enviar notificação para a empresa
      await this.mailService.sendContactNotification(contactData);

      // Enviar confirmação para o cliente
      await this.mailService.sendContactConfirmation(contactData.email, contactData.name);

      this.logger.log(`Emails enviados com sucesso para ${contactData.email}`);
    } catch (error) {
      this.logger.error('Erro ao enviar emails:', error);
      throw error;
    }
  }

  async findAll(): Promise<Contact[]> {
    return this.leadRepository.find({
      relations: ['notes', 'notes.createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCompany(companyId: string): Promise<Contact[]> {
    return this.leadRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.leadRepository.findOne({
      where: { id },
      relations: ['notes', 'notes.createdByUser'],
      order: { notes: { createdAt: 'DESC' } },
    });
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: string,
  ): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['notes', 'notes.createdByUser'],
    });

    if (!contact) {
      throw new NotFoundException(`Contato com ID ${id} não encontrado`);
    }

    // Atualizar status se fornecido
    if (updateContactDto.status) {
      lead.status = updateContactDto.status;
      await this.leadRepository.save(contact);
    }

    // Criar nova nota se fornecida
    if (updateContactDto.note) {
      const note = this.leadNoteRepository.create({
        contactId: id,
        note: updateContactDto.note,
        createdBy: userId,
      });
      await this.leadNoteRepository.save(note);
    }

    // Retornar contato atualizado com notas
    const updatedContact = await this.findOne(id);
    if (!updatedContact) {
      throw new NotFoundException(`Contato com ID ${id} não encontrado`);
    }
    return updatedContact;
  }
}
