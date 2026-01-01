import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    // Criar registro no banco
    const contact = this.contactRepository.create(createContactDto);
    const savedContact = await this.contactRepository.save(contact);

    // Enviar emails de forma assíncrona (não bloquear a resposta)
    this.sendNotificationEmails(createContactDto).catch((error) => {
      this.logger.error('Erro ao enviar emails de notificação:', error);
    });

    return savedContact;
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
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCompany(companyId: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { id } });
  }
}
