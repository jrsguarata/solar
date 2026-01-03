import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lead, LeadOwnerType, LeadSource, LeadStatus } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UserRole } from '../users/entities/user.entity';

export interface AccessControl {
  userId: string;
  role: UserRole;
  companyId: string;
  isPartner: boolean;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(LeadNote)
    private readonly leadNoteRepository: Repository<LeadNote>,
  ) {}

  /**
   * Criar lead (público - formulário da landing page)
   */
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...createLeadDto,
      source: createLeadDto.source || LeadSource.LANDING_PAGE,
      status: createLeadDto.status || LeadStatus.LEAD,
    });

    const savedLead = await this.leadRepository.save(lead);

    this.logger.log(`Lead criado: ${savedLead.email} - ${savedLead.source}`);

    return savedLead;
  }

  /**
   * Criar lead manualmente (por OPERATOR/COADMIN)
   */
  async createManual(
    createLeadDto: CreateLeadDto,
    accessControl: AccessControl,
  ): Promise<Lead> {
    const { companyId, isPartner, userId } = accessControl;

    // Determinar ownership baseado no usuário que está criando
    const lead = this.leadRepository.create({
      ...createLeadDto,
      source: LeadSource.MANUAL,
      status: createLeadDto.status || LeadStatus.LEAD,
      ownerType: isPartner ? LeadOwnerType.PARTNER : LeadOwnerType.EMPRESA,
      ownerId: isPartner ? companyId : undefined,
      createdBy: userId,
    });

    const savedLead = await this.leadRepository.save(lead);

    this.logger.log(
      `Lead manual criado por ${userId} - Owner: ${lead.ownerType}`,
    );

    return savedLead;
  }

  /**
   * Listar leads com controle de acesso multi-tenant
   */
  async findAll(accessControl?: AccessControl): Promise<Lead[]> {
    // Se não houver controle de acesso, retornar todos (ADMIN)
    if (!accessControl) {
      return this.leadRepository.find({
        relations: ['leadNotes', 'leadNotes.createdByUser', 'assignedUser', 'proposals'],
        order: { createdAt: 'DESC' },
      });
    }

    const where = this.buildWhereClause(accessControl);

    return this.leadRepository.find({
      where,
      relations: ['leadNotes', 'leadNotes.createdByUser', 'assignedUser', 'proposals'],
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

  /**
   * Buscar lead por ID com validação de acesso
   */
  async findOne(id: string, accessControl?: AccessControl): Promise<Lead | null> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['leadNotes', 'leadNotes.createdByUser', 'assignedUser', 'proposals'],
      order: { leadNotes: { createdAt: 'DESC' } },
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
   * Atualizar lead (status, responsável, notas)
   */
  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
    userId: string,
  ): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['leadNotes', 'leadNotes.createdByUser'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    // Atualizar campos do lead
    if (updateLeadDto.status) {
      lead.status = updateLeadDto.status;
    }

    if (updateLeadDto.assignedTo !== undefined) {
      lead.assignedTo = updateLeadDto.assignedTo;
    }

    if (updateLeadDto.notes) {
      lead.notes = updateLeadDto.notes;
    }

    lead.updatedBy = userId;
    await this.leadRepository.save(lead);

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

    this.logger.log(`Lead atualizado: ${id} - Status: ${lead.status}`);

    return updatedLead;
  }

  /**
   * Avançar lead no funil de vendas
   */
  async advanceStatus(id: string, userId: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } });

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    const statusFlow: Record<LeadStatus, LeadStatus | null> = {
      [LeadStatus.LEAD]: LeadStatus.SUSPECT,
      [LeadStatus.SUSPECT]: LeadStatus.PROSPECT,
      [LeadStatus.PROSPECT]: LeadStatus.QUALIFIED,
      [LeadStatus.QUALIFIED]: LeadStatus.PROPOSAL_SENT,
      [LeadStatus.PROPOSAL_SENT]: LeadStatus.NEGOTIATION,
      [LeadStatus.NEGOTIATION]: LeadStatus.WON,
      [LeadStatus.WON]: null,
      [LeadStatus.LOST]: null,
      [LeadStatus.ARCHIVED]: null,
    };

    const nextStatus = statusFlow[lead.status];

    if (!nextStatus) {
      throw new ForbiddenException(`Não é possível avançar do status ${lead.status}`);
    }

    lead.status = nextStatus;
    lead.updatedBy = userId;
    await this.leadRepository.save(lead);

    this.logger.log(`Lead ${id} avançou para ${nextStatus}`);

    return this.findOne(id);
  }

  /**
   * Marcar lead como ganho
   */
  async markAsWon(id: string, userId: string, note?: string): Promise<Lead> {
    return this.update(id, { status: LeadStatus.WON, note }, userId);
  }

  /**
   * Marcar lead como perdido
   */
  async markAsLost(id: string, userId: string, note?: string): Promise<Lead> {
    return this.update(id, { status: LeadStatus.LOST, note }, userId);
  }

  /**
   * Arquivar lead
   */
  async archive(id: string, userId: string, note?: string): Promise<Lead> {
    return this.update(id, { status: LeadStatus.ARCHIVED, note }, userId);
  }
}
