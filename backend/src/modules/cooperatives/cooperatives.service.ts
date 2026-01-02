import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cooperative } from './entities/cooperative.entity';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';

@Injectable()
export class CooperativesService {
  constructor(
    @InjectRepository(Cooperative)
    private cooperativesRepository: Repository<Cooperative>,
  ) {}

  async create(createCooperativeDto: CreateCooperativeDto): Promise<Cooperative> {
    const userId = RequestContextService.getUserId();
    const cooperative = this.cooperativesRepository.create(createCooperativeDto);

    // Setar apenas created_by no CREATE (updated_by/updated_at ficam NULL)
    (cooperative as any).created_by = userId;

    return this.cooperativesRepository.save(cooperative);
  }

  async findAll(currentUser: any): Promise<Cooperative[]> {
    const queryBuilder = this.cooperativesRepository
      .createQueryBuilder('cooperative')
      .leftJoinAndSelect('cooperative.company', 'company')
      .leftJoinAndSelect('cooperative.plant', 'plant')
      .leftJoinAndSelect('cooperative.createdByUser', 'createdByUser')
      .leftJoinAndSelect('cooperative.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('cooperative.deactivatedByUser', 'deactivatedByUser')
      .withDeleted(); // Inclui registros com soft delete

    // ADMIN vê todas as cooperativas
    // Outros perfis veem apenas cooperativas da sua empresa
    if (currentUser.role !== 'ADMIN' && currentUser.companyId) {
      queryBuilder.where('cooperative.companyId = :companyId', {
        companyId: currentUser.companyId,
      });
    }

    return queryBuilder
      .orderBy('cooperative.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Cooperative> {
    const cooperative = await this.cooperativesRepository.findOne({
      where: { id },
      relations: ['company', 'plant', 'createdByUser', 'updatedByUser', 'deactivatedByUser'],
      withDeleted: true, // Permite encontrar cooperativas desativadas
    });

    if (!cooperative) {
      throw new NotFoundException(`Cooperativa com ID ${id} não encontrada`);
    }

    // COADMIN só pode acessar cooperativas da sua empresa
    if (currentUser && currentUser.role === 'COADMIN' && cooperative.companyId !== currentUser.companyId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta cooperativa');
    }

    return cooperative;
  }

  async update(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
    currentUser: any,
  ): Promise<Cooperative> {
    const cooperative = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();
    const wasActive = cooperative.isActive;

    Object.assign(cooperative, updateCooperativeDto);

    // Setar campos de auditoria diretamente nas propriedades de coluna
    (cooperative as any).updated_by = userId;
    (cooperative as any).updated_at = new Date();

    // Se a cooperativa foi desativada
    if (wasActive && updateCooperativeDto.isActive === false) {
      const oldValues = await this.cooperativesRepository.manager.query(
        'SELECT * FROM cooperatives WHERE id = $1',
        [cooperative.id]
      );

      const savedCooperative = await this.cooperativesRepository.save(cooperative);
      await this.cooperativesRepository.softDelete(savedCooperative.id);

      await this.cooperativesRepository.manager.query(
        'UPDATE cooperatives SET deactivated_by = $1 WHERE id = $2',
        [userId, savedCooperative.id]
      );

      const newValues = await this.cooperativesRepository.manager.query(
        'SELECT * FROM cooperatives WHERE id = $1',
        [savedCooperative.id]
      );

      await this.createManualAuditLog(
        savedCooperative.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedCooperative = await this.findOne(savedCooperative.id, currentUser);
      return updatedCooperative;
    }

    // Se a cooperativa foi reativada
    if (!wasActive && updateCooperativeDto.isActive === true) {
      const oldValues = await this.cooperativesRepository.manager.query(
        'SELECT * FROM cooperatives WHERE id = $1',
        [cooperative.id]
      );

      const savedCooperative = await this.cooperativesRepository.save(cooperative);
      await this.cooperativesRepository.restore(savedCooperative.id);

      await this.cooperativesRepository.manager.query(
        'UPDATE cooperatives SET deactivated_by = NULL WHERE id = $1',
        [savedCooperative.id]
      );

      const newValues = await this.cooperativesRepository.manager.query(
        'SELECT * FROM cooperatives WHERE id = $1',
        [savedCooperative.id]
      );

      await this.createManualAuditLog(
        savedCooperative.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedCooperative = await this.findOne(savedCooperative.id, currentUser);
      return updatedCooperative;
    }

    return this.cooperativesRepository.save(cooperative);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const cooperative = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();

    const oldValues = await this.cooperativesRepository.manager.query(
      'SELECT * FROM cooperatives WHERE id = $1',
      [cooperative.id]
    );

    cooperative.isActive = false;
    await this.cooperativesRepository.save(cooperative);
    await this.cooperativesRepository.softDelete(cooperative.id);

    await this.cooperativesRepository.manager.query(
      'UPDATE cooperatives SET deactivated_by = $1 WHERE id = $2',
      [userId, cooperative.id]
    );

    const newValues = await this.cooperativesRepository.manager.query(
      'SELECT * FROM cooperatives WHERE id = $1',
      [cooperative.id]
    );

    await this.createManualAuditLog(
      cooperative.id,
      AuditAction.UPDATE,
      oldValues[0],
      newValues[0],
      userId
    );
  }

  private async createManualAuditLog(
    recordId: string,
    action: AuditAction,
    oldValues: any,
    newValues: any,
    userId: string | undefined
  ): Promise<void> {
    try {
      const changedFields: string[] = [];
      if (oldValues && newValues) {
        const allKeys = new Set([
          ...Object.keys(oldValues),
          ...Object.keys(newValues)
        ]);

        for (const key of allKeys) {
          if (['updated_at', 'updated_by'].includes(key)) {
            continue;
          }

          if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
            changedFields.push(key);
          }
        }
      }

      const auditLog = this.cooperativesRepository.manager.create(AuditLog, {
        tableName: 'cooperatives',
        recordId,
        action,
        oldValues: this.sanitizeAuditValues(oldValues),
        newValues: this.sanitizeAuditValues(newValues),
        changedFields,
        userId,
      });

      const queryRunner = this.cooperativesRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();

      try {
        await queryRunner.manager.save(auditLog);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Erro ao criar log de auditoria manual:', error);
    }
  }

  private sanitizeAuditValues(values: any): Record<string, any> | undefined {
    if (!values) {
      return undefined;
    }

    const sanitized: Record<string, any> = {};
    const ignoreFields = ['password', 'token', 'secret'];

    for (const key in values) {
      if (values.hasOwnProperty(key) && !ignoreFields.includes(key)) {
        sanitized[key] = values[key];
      }
    }

    return sanitized;
  }
}
