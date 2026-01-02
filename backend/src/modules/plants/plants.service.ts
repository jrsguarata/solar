import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
  ) {}

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const userId = RequestContextService.getUserId();
    const plant = this.plantsRepository.create(createPlantDto);

    // Setar apenas created_by no CREATE (updated_by/updated_at ficam NULL)
    (plant as any).created_by = userId;

    return this.plantsRepository.save(plant);
  }

  async findAll(currentUser: any): Promise<Plant[]> {
    const queryBuilder = this.plantsRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.company', 'company')
      .leftJoinAndSelect('plant.concessionaire', 'concessionaire')
      .leftJoinAndSelect('concessionaire.distributor', 'distributor')
      .leftJoinAndSelect('plant.createdByUser', 'createdByUser')
      .leftJoinAndSelect('plant.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('plant.deactivatedByUser', 'deactivatedByUser')
      .withDeleted(); // Inclui registros com soft delete

    // ADMIN vê todas as usinas
    // Outros perfis veem apenas usinas da sua empresa
    if (currentUser.role !== 'ADMIN' && currentUser.companyId) {
      queryBuilder.where('plant.companyId = :companyId', {
        companyId: currentUser.companyId,
      });
    }

    return queryBuilder
      .orderBy('plant.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Plant> {
    const plant = await this.plantsRepository.findOne({
      where: { id },
      relations: ['company', 'concessionaire', 'concessionaire.distributor', 'createdByUser', 'updatedByUser', 'deactivatedByUser'],
      withDeleted: true, // Permite encontrar usinas desativadas
    });

    if (!plant) {
      throw new NotFoundException(`Usina com ID ${id} não encontrada`);
    }

    // COADMIN só acessa usinas da sua empresa
    if (currentUser && currentUser.role === 'COADMIN' && plant.companyId !== currentUser.companyId) {
      throw new ForbiddenException('Acesso negado');
    }

    return plant;
  }

  async update(
    id: string,
    updatePlantDto: UpdatePlantDto,
    currentUser: any,
  ): Promise<Plant> {
    const plant = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();
    const wasActive = plant.isActive;

    Object.assign(plant, updatePlantDto);

    // Setar campos de auditoria diretamente nas propriedades de coluna
    (plant as any).updated_by = userId;
    (plant as any).updated_at = new Date();

    // Se a usina foi desativada
    if (wasActive && updatePlantDto.isActive === false) {
      const oldValues = await this.plantsRepository.manager.query(
        'SELECT * FROM plants WHERE id = $1',
        [plant.id]
      );

      const savedPlant = await this.plantsRepository.save(plant);
      await this.plantsRepository.softDelete(savedPlant.id);

      await this.plantsRepository.manager.query(
        'UPDATE plants SET deactivated_by = $1 WHERE id = $2',
        [userId, savedPlant.id]
      );

      const newValues = await this.plantsRepository.manager.query(
        'SELECT * FROM plants WHERE id = $1',
        [savedPlant.id]
      );

      await this.createManualAuditLog(
        savedPlant.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedPlant = await this.findOne(savedPlant.id, currentUser);
      return updatedPlant;
    }

    // Se a usina foi reativada
    if (!wasActive && updatePlantDto.isActive === true) {
      const oldValues = await this.plantsRepository.manager.query(
        'SELECT * FROM plants WHERE id = $1',
        [plant.id]
      );

      const savedPlant = await this.plantsRepository.save(plant);
      await this.plantsRepository.restore(savedPlant.id);

      await this.plantsRepository.manager.query(
        'UPDATE plants SET deactivated_by = NULL WHERE id = $1',
        [savedPlant.id]
      );

      const newValues = await this.plantsRepository.manager.query(
        'SELECT * FROM plants WHERE id = $1',
        [savedPlant.id]
      );

      await this.createManualAuditLog(
        savedPlant.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedPlant = await this.findOne(savedPlant.id, currentUser);
      return updatedPlant;
    }

    return this.plantsRepository.save(plant);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const plant = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();

    const oldValues = await this.plantsRepository.manager.query(
      'SELECT * FROM plants WHERE id = $1',
      [plant.id]
    );

    plant.isActive = false;
    await this.plantsRepository.save(plant);
    await this.plantsRepository.softDelete(plant.id);

    await this.plantsRepository.manager.query(
      'UPDATE plants SET deactivated_by = $1 WHERE id = $2',
      [userId, plant.id]
    );

    const newValues = await this.plantsRepository.manager.query(
      'SELECT * FROM plants WHERE id = $1',
      [plant.id]
    );

    await this.createManualAuditLog(
      plant.id,
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

      const auditLog = this.plantsRepository.manager.create(AuditLog, {
        tableName: 'plants',
        recordId,
        action,
        oldValues: this.sanitizeAuditValues(oldValues),
        newValues: this.sanitizeAuditValues(newValues),
        changedFields,
        userId,
      });

      const queryRunner = this.plantsRepository.manager.connection.createQueryRunner();
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
