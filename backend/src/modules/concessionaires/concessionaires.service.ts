import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concessionaire } from './entities/concessionaire.entity';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';

@Injectable()
export class ConcessionairesService {
  constructor(
    @InjectRepository(Concessionaire)
    private concessionairesRepository: Repository<Concessionaire>,
  ) {}

  async create(
    createConcessionaireDto: CreateConcessionaireDto,
    currentUser: any,
  ): Promise<Concessionaire> {
    const concessionaire = this.concessionairesRepository.create({
      ...createConcessionaireDto,
      companyId: currentUser.companyId, // Sempre usa a company do usuário logado
    });

    return this.concessionairesRepository.save(concessionaire);
  }

  async findAll(currentUser: any): Promise<Concessionaire[]> {
    const queryBuilder = this.concessionairesRepository
      .createQueryBuilder('concessionaire')
      .leftJoinAndSelect('concessionaire.distributor', 'distributor')
      .leftJoinAndSelect('concessionaire.company', 'company')
      .leftJoinAndSelect('concessionaire.createdByUser', 'createdByUser')
      .leftJoinAndSelect('concessionaire.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('concessionaire.deactivatedByUser', 'deactivatedByUser')
      .withDeleted(); // Inclui registros com soft delete

    // ADMIN vê todas as concessionárias
    // Outros perfis veem apenas concessionárias da sua empresa
    if (currentUser.role !== 'ADMIN' && currentUser.companyId) {
      queryBuilder.where('concessionaire.companyId = :companyId', {
        companyId: currentUser.companyId,
      });
    }

    return queryBuilder
      .orderBy('concessionaire.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Concessionaire> {
    const concessionaire = await this.concessionairesRepository.findOne({
      where: { id },
      relations: ['distributor', 'company', 'createdByUser', 'updatedByUser', 'deactivatedByUser'],
      withDeleted: true, // Permite encontrar concessionárias desativadas
    });

    if (!concessionaire) {
      throw new NotFoundException(
        `Concessionária com ID ${id} não encontrada`,
      );
    }

    // ADMIN pode ver qualquer concessionária
    // Outros perfis só podem ver concessionária da sua empresa
    if (currentUser.role !== 'ADMIN' && concessionaire.companyId !== currentUser.companyId) {
      throw new ForbiddenException('Acesso negado a esta concessionária');
    }

    return concessionaire;
  }

  async update(
    id: string,
    updateConcessionaireDto: UpdateConcessionaireDto,
    currentUser: any,
  ): Promise<Concessionaire> {
    const concessionaire = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();
    const wasActive = concessionaire.isActive;

    Object.assign(concessionaire, updateConcessionaireDto);

    // Setar campos de auditoria diretamente nas propriedades de coluna
    (concessionaire as any).updated_by = userId;
    (concessionaire as any).updated_at = new Date();

    // Se a concessionária foi desativada
    if (wasActive && updateConcessionaireDto.isActive === false) {
      const oldValues = await this.concessionairesRepository.manager.query(
        'SELECT * FROM concessionaires WHERE id = $1',
        [concessionaire.id]
      );

      const savedConcessionaire = await this.concessionairesRepository.save(concessionaire);
      await this.concessionairesRepository.softDelete(savedConcessionaire.id);

      await this.concessionairesRepository.manager.query(
        'UPDATE concessionaires SET deactivated_by = $1 WHERE id = $2',
        [userId, savedConcessionaire.id]
      );

      const newValues = await this.concessionairesRepository.manager.query(
        'SELECT * FROM concessionaires WHERE id = $1',
        [savedConcessionaire.id]
      );

      await this.createManualAuditLog(
        savedConcessionaire.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedConcessionaire = await this.findOne(savedConcessionaire.id, currentUser);
      return updatedConcessionaire;
    }

    // Se a concessionária foi reativada
    if (!wasActive && updateConcessionaireDto.isActive === true) {
      const oldValues = await this.concessionairesRepository.manager.query(
        'SELECT * FROM concessionaires WHERE id = $1',
        [concessionaire.id]
      );

      const savedConcessionaire = await this.concessionairesRepository.save(concessionaire);
      await this.concessionairesRepository.restore(savedConcessionaire.id);

      await this.concessionairesRepository.manager.query(
        'UPDATE concessionaires SET deactivated_by = NULL WHERE id = $1',
        [savedConcessionaire.id]
      );

      const newValues = await this.concessionairesRepository.manager.query(
        'SELECT * FROM concessionaires WHERE id = $1',
        [savedConcessionaire.id]
      );

      await this.createManualAuditLog(
        savedConcessionaire.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedConcessionaire = await this.findOne(savedConcessionaire.id, currentUser);
      return updatedConcessionaire;
    }

    return this.concessionairesRepository.save(concessionaire);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const concessionaire = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();

    const oldValues = await this.concessionairesRepository.manager.query(
      'SELECT * FROM concessionaires WHERE id = $1',
      [concessionaire.id]
    );

    concessionaire.isActive = false;
    await this.concessionairesRepository.save(concessionaire);
    await this.concessionairesRepository.softDelete(concessionaire.id);

    await this.concessionairesRepository.manager.query(
      'UPDATE concessionaires SET deactivated_by = $1 WHERE id = $2',
      [userId, concessionaire.id]
    );

    const newValues = await this.concessionairesRepository.manager.query(
      'SELECT * FROM concessionaires WHERE id = $1',
      [concessionaire.id]
    );

    await this.createManualAuditLog(
      concessionaire.id,
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

      const auditLog = this.concessionairesRepository.manager.create(AuditLog, {
        tableName: 'concessionaires',
        recordId,
        action,
        oldValues: this.sanitizeAuditValues(oldValues),
        newValues: this.sanitizeAuditValues(newValues),
        changedFields,
        userId,
      });

      const queryRunner = this.concessionairesRepository.manager.connection.createQueryRunner();
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
