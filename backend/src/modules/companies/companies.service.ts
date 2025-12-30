import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RequestContextService } from '../../common/context/request-context';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
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
    return this.companiesRepository.save(company);
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

  async findByCode(code: string): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { code } });
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { cnpj } });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    const userId = RequestContextService.getUserId();

    if (updateCompanyDto.code && updateCompanyDto.code !== company.code) {
      const existingByCode = await this.findByCode(updateCompanyDto.code);
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

    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.softDelete(company.id);
  }
}
