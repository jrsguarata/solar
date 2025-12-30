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

@Injectable()
export class CooperativesService {
  constructor(
    @InjectRepository(Cooperative)
    private cooperativesRepository: Repository<Cooperative>,
  ) {}

  async create(createCooperativeDto: CreateCooperativeDto): Promise<Cooperative> {
    const userId = RequestContextService.getUserId();
    const cooperative = this.cooperativesRepository.create(createCooperativeDto);

    // Setar campos de auditoria
    (cooperative as any).created_by = userId;
    (cooperative as any).updated_by = userId;

    return this.cooperativesRepository.save(cooperative);
  }

  async findAll(currentUser: any): Promise<Cooperative[]> {
    const query = this.cooperativesRepository
      .createQueryBuilder('cooperative')
      .leftJoinAndSelect('cooperative.company', 'company')
      .leftJoinAndSelect('cooperative.plant', 'plant')
      .leftJoinAndSelect('cooperative.createdByUser', 'createdByUser')
      .leftJoinAndSelect('cooperative.updatedByUser', 'updatedByUser')
      .orderBy('cooperative.createdAt', 'DESC');

    // COADMIN só vê cooperativas da sua empresa
    if (currentUser.role === 'COADMIN') {
      query.where('cooperative.companyId = :companyId', {
        companyId: currentUser.companyId,
      });
    }

    return query.getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Cooperative> {
    const cooperative = await this.cooperativesRepository.findOne({
      where: { id },
      relations: ['company', 'plant', 'createdByUser', 'updatedByUser'],
    });

    if (!cooperative) {
      throw new NotFoundException(`Cooperativa com ID ${id} não encontrada`);
    }

    // COADMIN só pode acessar cooperativas da sua empresa
    if (
      currentUser.role === 'COADMIN' &&
      cooperative.companyId !== currentUser.companyId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta cooperativa',
      );
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

    Object.assign(cooperative, updateCooperativeDto);
    (cooperative as any).updated_by = userId;

    return this.cooperativesRepository.save(cooperative);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const cooperative = await this.findOne(id, currentUser);
    await this.cooperativesRepository.softDelete(cooperative.id);
  }
}
