import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const userId = RequestContextService.getUserId();

    // Normalizar código para uppercase
    const normalizedCode = createPartnerDto.code.toUpperCase();

    // Verificar se código já existe
    const existingByCode = await this.partnersRepository.findOne({
      where: { code: normalizedCode },
    });

    if (existingByCode) {
      throw new ConflictException('Código do parceiro já existe');
    }

    // Verificar se CNPJ já existe
    const existingByCnpj = await this.partnersRepository.findOne({
      where: { cnpj: createPartnerDto.cnpj },
    });

    if (existingByCnpj) {
      throw new ConflictException('CNPJ já existe');
    }

    // Criar parceiro com código normalizado
    const partner = this.partnersRepository.create({
      ...createPartnerDto,
      code: normalizedCode,
    });

    // Setar apenas created_by no CREATE (updated_by/updated_at ficam NULL)
    (partner as any).created_by = userId;

    return this.partnersRepository.save(partner);
  }

  async findAll(): Promise<Partner[]> {
    return this.partnersRepository.find({
      relations: ['createdByUser', 'updatedByUser', 'deactivatedByUser'],
      order: { name: 'ASC' },
      withDeleted: true, // Inclui registros com soft delete
    });
  }

  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnersRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser', 'deactivatedByUser'],
      withDeleted: true, // Permite encontrar parceiros desativados
    });

    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${id} não encontrado`);
    }

    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const partner = await this.findOne(id);
    const userId = RequestContextService.getUserId();
    const wasActive = partner.isActive;

    // Se está alterando o código, validar se não existe outro parceiro com esse código
    if (updatePartnerDto.code && updatePartnerDto.code !== partner.code) {
      const normalizedCode = updatePartnerDto.code.toUpperCase();
      const existingByCode = await this.partnersRepository.findOne({
        where: { code: normalizedCode },
      });

      if (existingByCode && existingByCode.id !== id) {
        throw new ConflictException('Código do parceiro já existe');
      }

      updatePartnerDto.code = normalizedCode;
    }

    // Se está alterando o CNPJ, validar se não existe outro parceiro com esse CNPJ
    if (updatePartnerDto.cnpj && updatePartnerDto.cnpj !== partner.cnpj) {
      const existingByCnpj = await this.partnersRepository.findOne({
        where: { cnpj: updatePartnerDto.cnpj },
      });

      if (existingByCnpj && existingByCnpj.id !== id) {
        throw new ConflictException('CNPJ já existe');
      }
    }

    Object.assign(partner, updatePartnerDto);

    // Setar campos de auditoria diretamente nas propriedades de coluna
    (partner as any).updated_by = userId;
    (partner as any).updated_at = new Date();

    // Se o parceiro foi desativado
    if (wasActive && updatePartnerDto.isActive === false) {
      const oldValues = await this.partnersRepository.manager.query(
        'SELECT * FROM partners WHERE id = $1',
        [partner.id]
      );

      const savedPartner = await this.partnersRepository.save(partner);
      await this.partnersRepository.softDelete(savedPartner.id);

      await this.partnersRepository.manager.query(
        'UPDATE partners SET deactivated_by = $1 WHERE id = $2',
        [userId, savedPartner.id]
      );

      const newValues = await this.partnersRepository.manager.query(
        'SELECT * FROM partners WHERE id = $1',
        [savedPartner.id]
      );

      await this.createManualAuditLog(
        savedPartner.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedPartner = await this.findOne(savedPartner.id);
      return updatedPartner;
    }

    // Se o parceiro foi reativado
    if (!wasActive && updatePartnerDto.isActive === true) {
      const oldValues = await this.partnersRepository.manager.query(
        'SELECT * FROM partners WHERE id = $1',
        [partner.id]
      );

      const savedPartner = await this.partnersRepository.save(partner);
      await this.partnersRepository.restore(savedPartner.id);

      await this.partnersRepository.manager.query(
        'UPDATE partners SET deactivated_by = NULL WHERE id = $1',
        [savedPartner.id]
      );

      const newValues = await this.partnersRepository.manager.query(
        'SELECT * FROM partners WHERE id = $1',
        [savedPartner.id]
      );

      await this.createManualAuditLog(
        savedPartner.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      const updatedPartner = await this.findOne(savedPartner.id);
      return updatedPartner;
    }

    return this.partnersRepository.save(partner);
  }

  async remove(id: string): Promise<void> {
    const partner = await this.findOne(id);
    const userId = RequestContextService.getUserId();

    const oldValues = await this.partnersRepository.manager.query(
      'SELECT * FROM partners WHERE id = $1',
      [partner.id]
    );

    partner.isActive = false;
    await this.partnersRepository.save(partner);
    await this.partnersRepository.softDelete(partner.id);

    await this.partnersRepository.manager.query(
      'UPDATE partners SET deactivated_by = $1 WHERE id = $2',
      [userId, partner.id]
    );

    const newValues = await this.partnersRepository.manager.query(
      'SELECT * FROM partners WHERE id = $1',
      [partner.id]
    );

    await this.createManualAuditLog(
      partner.id,
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

      const auditLog = this.partnersRepository.manager.create(AuditLog, {
        tableName: 'partners',
        recordId,
        action,
        oldValues: this.sanitizeAuditValues(oldValues),
        newValues: this.sanitizeAuditValues(newValues),
        changedFields,
        userId,
      });

      const queryRunner = this.partnersRepository.manager.connection.createQueryRunner();
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
