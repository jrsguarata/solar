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
    // Validar se existe landing page para esta empresa
    if (!this.VALID_LANDING_PAGES.includes(createCompanyDto.code)) {
      throw new BadRequestException(
        `Landing page não existe para o código ${createCompanyDto.code}. ` +
        `Por favor, crie o arquivo de landing page antes de cadastrar a empresa no sistema. ` +
        `Códigos válidos: ${this.VALID_LANDING_PAGES.join(', ')}`
      );
    }

    const existingByCode = await this.companiesRepository.findOne({
      where: { code: createCompanyDto.code },
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

    const company = this.companiesRepository.create(createCompanyDto);
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
      relations: ['createdByUser', 'updatedByUser', 'deletedByUser'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser', 'deletedByUser'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return company;
  }

  async findByCode(code: string): Promise<Partial<Company>> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${code}`;

    // Tentar buscar do cache primeiro
    const cachedCompany = await this.cacheManager.get<Partial<Company>>(cacheKey);
    if (cachedCompany) {
      return cachedCompany;
    }

    // Se não estiver no cache, buscar do banco
    const company = await this.companiesRepository.findOne({
      where: { code },
      select: ['id', 'code', 'name', 'cnpj']
    });

    if (!company) {
      throw new NotFoundException(`Empresa com código ${code} não encontrada`);
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

    // Invalidar cache
    const cacheKey = `${this.CACHE_KEY_PREFIX}${company.code}`;
    await this.cacheManager.del(cacheKey);

    await this.companiesRepository.softDelete(company.id);
  }
}
