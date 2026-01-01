import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';

@Injectable()
export class CompaniesService {
  private readonly CACHE_KEY_PREFIX = 'company:code:';
  private readonly CACHE_TTL = 3600; // 1 hora em segundos

  // Lista de códigos de empresas que possuem landing page configurada
  // IMPORTANTE: Atualize esta lista sempre que criar uma nova landing page
  private readonly VALID_LANDING_PAGES = ['EMP01'];

  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Normalizar código para uppercase
    const normalizedCode = createCompanyDto.code.toUpperCase();

    // Validar se existe landing page para esta empresa
    if (!this.VALID_LANDING_PAGES.includes(normalizedCode)) {
      throw new BadRequestException(
        `Landing page não existe para o código ${normalizedCode}. ` +
        `Por favor, crie o arquivo de landing page antes de cadastrar a empresa no sistema. ` +
        `Códigos válidos: ${this.VALID_LANDING_PAGES.join(', ')}`
      );
    }

    const existingByCode = await this.companiesRepository.findOne({
      where: { code: normalizedCode },
    });

    if (existingByCode) {
      throw new ConflictException('Código da empresa já existe');
    }

    const existingByCnpj = await this.companiesRepository.findOne({
      where: { cnpj: createCompanyDto.cnpj },
    });

    if (existingByCnpj) {
      throw new ConflictException('CNPJ já existe');
    }

    // Criar empresa com código normalizado
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      code: normalizedCode,
    });
    const savedCompany = await this.companiesRepository.save(company);

    // Cachear a nova empresa
    const cacheKey = `${this.CACHE_KEY_PREFIX}${savedCompany.code}`;
    await this.cacheManager.set(cacheKey, {
      id: savedCompany.id,
      code: savedCompany.code,
      name: savedCompany.name,
      cnpj: savedCompany.cnpj,
    }, this.CACHE_TTL);

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      relations: ['createdByUser', 'updatedByUser', 'deactivatedByUser'],
      order: { name: 'ASC' },
      withDeleted: true, // Inclui registros com soft delete
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser', 'deactivatedByUser'],
      withDeleted: true, // Permite encontrar empresas desativadas (soft deleted)
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return company;
  }

  async findByCode(code: string): Promise<Partial<Company>> {
    // Normalizar código para uppercase para busca case-insensitive
    const normalizedCode = code.toUpperCase();
    const cacheKey = `${this.CACHE_KEY_PREFIX}${normalizedCode}`;

    // Tentar buscar do cache primeiro
    const cachedCompany = await this.cacheManager.get<Partial<Company>>(cacheKey);
    if (cachedCompany) {
      return cachedCompany;
    }

    // Se não estiver no cache, buscar do banco
    const company = await this.companiesRepository.findOne({
      where: { code: normalizedCode },
      select: ['id', 'code', 'name', 'cnpj']
    });

    if (!company) {
      throw new NotFoundException(`Empresa com código ${normalizedCode} não encontrada`);
    }

    // Salvar no cache por 1 hora
    await this.cacheManager.set(cacheKey, company, this.CACHE_TTL);

    return company;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { cnpj } });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    const userId = RequestContextService.getUserId();
    const oldCode = company.code;
    const wasActive = company.isActive;

    // Normalizar código para uppercase se fornecido
    if (updateCompanyDto.code) {
      updateCompanyDto.code = updateCompanyDto.code.toUpperCase();
    }

    if (updateCompanyDto.code && updateCompanyDto.code !== company.code) {
      const existingByCode = await this.companiesRepository.findOne({
        where: { code: updateCompanyDto.code },
      });
      if (existingByCode) {
        throw new ConflictException('Código da empresa já existe');
      }
    }

    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingByCnpj = await this.findByCnpj(updateCompanyDto.cnpj);
      if (existingByCnpj) {
        throw new ConflictException('CNPJ já existe');
      }
    }

    Object.assign(company, updateCompanyDto);

    // Setar campos de auditoria diretamente nas propriedades de coluna
    (company as any).updated_by = userId;
    (company as any).updated_at = new Date();

    // Se a empresa foi desativada (estava ativa e agora está inativa)
    if (wasActive && updateCompanyDto.isActive === false) {
      // Buscar valores antigos ANTES de fazer qualquer mudança
      const oldValues = await this.companiesRepository.manager.query(
        'SELECT * FROM companies WHERE id = $1',
        [company.id]
      );

      // Salvar a entidade primeiro com isActive = false
      const savedCompany = await this.companiesRepository.save(company);

      // Fazer soft delete (isso seta deactivated_at automaticamente)
      await this.companiesRepository.softDelete(savedCompany.id);

      // Setar deactivated_by manualmente com SQL direto (QueryBuilder tem problema com propriedades herdadas)
      await this.companiesRepository.manager.query(
        'UPDATE companies SET deactivated_by = $1 WHERE id = $2',
        [userId, savedCompany.id]
      );

      // Buscar valores novos APÓS todas as mudanças
      const newValues = await this.companiesRepository.manager.query(
        'SELECT * FROM companies WHERE id = $1',
        [savedCompany.id]
      );

      // Registrar auditoria manualmente porque manager.query() não dispara subscriber
      await this.createManualAuditLog(
        savedCompany.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      // Invalidar cache
      const cacheKey = `${this.CACHE_KEY_PREFIX}${savedCompany.code}`;
      await this.cacheManager.del(cacheKey);

      // Buscar a empresa atualizada para retornar com todos os campos corretos
      const updatedCompany = await this.findOne(savedCompany.id);
      return updatedCompany;
    }

    // Se a empresa foi reativada (estava inativa e agora está ativa)
    if (!wasActive && updateCompanyDto.isActive === true) {
      // Buscar valores antigos ANTES de fazer qualquer mudança
      const oldValues = await this.companiesRepository.manager.query(
        'SELECT * FROM companies WHERE id = $1',
        [company.id]
      );

      // Salvar a entidade primeiro com isActive = true
      const savedCompany = await this.companiesRepository.save(company);

      // Restaurar soft delete do TypeORM (limpa deactivated_at)
      await this.companiesRepository.restore(savedCompany.id);

      // Limpar deactivated_by manualmente com SQL direto
      await this.companiesRepository.manager.query(
        'UPDATE companies SET deactivated_by = NULL WHERE id = $1',
        [savedCompany.id]
      );

      // Buscar valores novos APÓS todas as mudanças
      const newValues = await this.companiesRepository.manager.query(
        'SELECT * FROM companies WHERE id = $1',
        [savedCompany.id]
      );

      // Registrar auditoria manualmente
      await this.createManualAuditLog(
        savedCompany.id,
        AuditAction.UPDATE,
        oldValues[0],
        newValues[0],
        userId
      );

      // Invalidar cache
      const cacheKey = `${this.CACHE_KEY_PREFIX}${savedCompany.code}`;
      await this.cacheManager.del(cacheKey);

      // Buscar a empresa atualizada para retornar com todos os campos corretos
      const updatedCompany = await this.findOne(savedCompany.id);
      return updatedCompany;
    }

    const updatedCompany = await this.companiesRepository.save(company);

    // Invalidar cache antigo se o código mudou
    if (oldCode !== updatedCompany.code) {
      await this.cacheManager.del(`${this.CACHE_KEY_PREFIX}${oldCode}`);
    }

    // Atualizar cache com novo código
    const cacheKey = `${this.CACHE_KEY_PREFIX}${updatedCompany.code}`;
    await this.cacheManager.set(cacheKey, {
      id: updatedCompany.id,
      code: updatedCompany.code,
      name: updatedCompany.name,
      cnpj: updatedCompany.cnpj,
    }, this.CACHE_TTL);

    return updatedCompany;
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    const userId = RequestContextService.getUserId();

    // Buscar valores antigos
    const oldValues = await this.companiesRepository.manager.query(
      'SELECT * FROM companies WHERE id = $1',
      [company.id]
    );

    // Invalidar cache
    const cacheKey = `${this.CACHE_KEY_PREFIX}${company.code}`;
    await this.cacheManager.del(cacheKey);

    // Setar isActive = false antes de fazer soft delete
    company.isActive = false;
    await this.companiesRepository.save(company);

    // Fazer soft delete (seta deactivated_at)
    await this.companiesRepository.softDelete(company.id);

    // Setar deactivated_by manualmente com SQL direto
    await this.companiesRepository.manager.query(
      'UPDATE companies SET deactivated_by = $1 WHERE id = $2',
      [userId, company.id]
    );

    // Buscar valores novos
    const newValues = await this.companiesRepository.manager.query(
      'SELECT * FROM companies WHERE id = $1',
      [company.id]
    );

    // Registrar auditoria manualmente
    await this.createManualAuditLog(
      company.id,
      AuditAction.UPDATE,
      oldValues[0],
      newValues[0],
      userId
    );
  }

  /**
   * Cria registro de auditoria manual quando operações via SQL direto são usadas
   * (porque manager.query() não dispara eventos de subscriber)
   */
  private async createManualAuditLog(
    recordId: string,
    action: AuditAction,
    oldValues: any,
    newValues: any,
    userId: string | undefined
  ): Promise<void> {
    try {
      // Calcular campos alterados
      const changedFields: string[] = [];
      if (oldValues && newValues) {
        const allKeys = new Set([
          ...Object.keys(oldValues),
          ...Object.keys(newValues)
        ]);

        for (const key of allKeys) {
          // Ignorar campos de auditoria que sempre mudam
          if (['updated_at', 'updated_by'].includes(key)) {
            continue;
          }

          if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
            changedFields.push(key);
          }
        }
      }

      // Criar registro de auditoria
      const auditLog = this.companiesRepository.manager.create(AuditLog, {
        tableName: 'companies',
        recordId,
        action,
        oldValues: this.sanitizeAuditValues(oldValues),
        newValues: this.sanitizeAuditValues(newValues),
        changedFields,
        userId,
      });

      // Salvar em transação separada
      const queryRunner = this.companiesRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();

      try {
        await queryRunner.manager.save(auditLog);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      // Não propagar erro de auditoria para não quebrar a operação principal
      console.error('Erro ao criar log de auditoria manual:', error);
    }
  }

  /**
   * Sanitiza valores para auditoria (remove campos sensíveis e desnecessários)
   */
  private sanitizeAuditValues(values: any): Record<string, any> | undefined {
    if (!values) {
      return undefined;
    }

    const sanitized: Record<string, any> = {};

    // Lista de campos a ignorar
    const ignoreFields = ['password', 'token', 'secret'];

    for (const key in values) {
      if (values.hasOwnProperty(key) && !ignoreFields.includes(key)) {
        sanitized[key] = values[key];
      }
    }

    return sanitized;
  }
}
