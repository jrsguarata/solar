import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { Lead, LeadOwnerType, LeadSource } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../users/entities/user.entity';

export interface AccessControl {
  userId: string;
  role: UserRole;
  companyId: string;
  isPartner: boolean;
}

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

  /**
   * Listar leads com controle de acesso multi-tenant
   */
  async findAll(accessControl?: AccessControl): Promise<Lead[]> {
    // Se não houver controle de acesso, retornar todos (ADMIN)
    if (!accessControl) {
      return this.leadRepository.find({
        relations: ['notes', 'notes.createdByUser'],
        order: { createdAt: 'DESC' },
      });
    }

    const where = this.buildWhereClause(accessControl);

    return this.leadRepository.find({
      where,
      relations: ['notes', 'notes.createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Construir cláusula WHERE baseada nas regras de acesso
   */
  private buildWhereClause(accessControl: AccessControl): FindOptionsWhere<Lead> | FindOptionsWhere<Lead>[] {
    const { role, companyId, isPartner } = accessControl;

    // COADMIN da EMPRESA vê todos (empresa + partners)
    if (role === UserRole.COADMIN && !isPartner) {
      return [
        { ownerType: LeadOwnerType.EMPRESA },
        { ownerType: LeadOwnerType.PARTNER },
      ];
    }

    // COADMIN de PARTNER vê apenas leads do seu partner
    if (role === UserRole.COADMIN && isPartner) {
      return {
        ownerType: LeadOwnerType.PARTNER,
        ownerId: companyId,
      };
    }

    // OPERATOR da EMPRESA vê apenas leads da empresa
    if (role === UserRole.OPERATOR && !isPartner) {
      return {
        ownerType: LeadOwnerType.EMPRESA,
      };
    }

    // OPERATOR de PARTNER vê apenas leads do seu partner
    if (role === UserRole.OPERATOR && isPartner) {
      return {
        ownerType: LeadOwnerType.PARTNER,
        ownerId: companyId,
      };
    }

    // Default: sem acesso
    return { id: 'impossible-id' };
  }

  async findByCompany(companyId: string): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar lead por ID com validação de acesso
   */
  async findOne(id: string, accessControl?: AccessControl): Promise<Lead | null> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['notes', 'notes.createdByUser'],
      order: { notes: { createdAt: 'DESC' } },
    });

    if (!lead) {
      return null;
    }

    // Validar acesso se houver controle
    if (accessControl) {
      this.validateAccess(lead, accessControl);
    }

    return lead;
  }

  /**
   * Validar se usuário tem acesso ao lead
   */
  private validateAccess(lead: Lead, accessControl: AccessControl): void {
    const { role, companyId, isPartner } = accessControl;

    // ADMIN tem acesso total
    if (role === UserRole.ADMIN) {
      return;
    }

    // COADMIN da EMPRESA vê todos
    if (role === UserRole.COADMIN && !isPartner) {
      return;
    }

    // COADMIN de PARTNER vê apenas do seu partner
    if (role === UserRole.COADMIN && isPartner) {
      if (lead.ownerType === LeadOwnerType.PARTNER && lead.ownerId === companyId) {
        return;
      }
      throw new ForbiddenException('Acesso negado a este lead');
    }

    // OPERATOR da EMPRESA vê apenas leads da empresa
    if (role === UserRole.OPERATOR && !isPartner) {
      if (lead.ownerType === LeadOwnerType.EMPRESA) {
        return;
      }
      throw new ForbiddenException('Acesso negado a este lead');
    }

    // OPERATOR de PARTNER vê apenas do seu partner
    if (role === UserRole.OPERATOR && isPartner) {
      if (lead.ownerType === LeadOwnerType.PARTNER && lead.ownerId === companyId) {
        return;
      }
      throw new ForbiddenException('Acesso negado a este lead');
    }

    throw new ForbiddenException('Acesso negado a este lead');
  }

  /**
   * Criar lead manualmente (por OPERATOR/COADMIN)
   */
  async createManual(
    createLeadDto: CreateLeadDto,
    accessControl: AccessControl,
  ): Promise<Lead> {
    const { companyId, isPartner } = accessControl;

    // Determinar ownership baseado no usuário que está criando
    const lead = this.leadRepository.create({
      ...createLeadDto,
      source: LeadSource.MANUAL,
      ownerType: isPartner ? LeadOwnerType.PARTNER : LeadOwnerType.EMPRESA,
      ownerId: isPartner ? companyId : undefined,
    });

    const savedLead = await this.leadRepository.save(lead);

    this.logger.log(
      `Lead manual criado por ${accessControl.userId} - Owner: ${lead.ownerType}`,
    );

    return savedLead;
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
