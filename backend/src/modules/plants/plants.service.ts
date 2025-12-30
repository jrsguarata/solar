import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { RequestContextService } from '../../common/context/request-context';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
  ) {}

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const userId = RequestContextService.getUserId();
    const plant = this.plantsRepository.create(createPlantDto);
    
    // Setar campos de auditoria
    (plant as any).created_by = userId;
    (plant as any).updated_by = userId;

    return this.plantsRepository.save(plant);
  }

  async findAll(currentUser: any): Promise<Plant[]> {
    const query = this.plantsRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.company', 'company')
      .leftJoinAndSelect('plant.createdByUser', 'createdByUser')
      .leftJoinAndSelect('plant.updatedByUser', 'updatedByUser')
      .orderBy('plant.createdAt', 'DESC');

    // COADMIN só vê usinas da sua empresa
    if (currentUser.role === 'COADMIN') {
      query.where('plant.companyId = :companyId', { companyId: currentUser.companyId });
    }

    return query.getMany();
  }

  async findOne(id: string, currentUser?: any): Promise<Plant> {
    const plant = await this.plantsRepository.findOne({
      where: { id },
      relations: ['company', 'createdByUser', 'updatedByUser'],
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

  async update(id: string, updatePlantDto: UpdatePlantDto, currentUser: any): Promise<Plant> {
    const plant = await this.findOne(id, currentUser);
    const userId = RequestContextService.getUserId();

    Object.assign(plant, updatePlantDto);

    // Setar campos de auditoria
    (plant as any).updated_by = userId;
    (plant as any).updated_at = new Date();

    return this.plantsRepository.save(plant);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const plant = await this.findOne(id, currentUser);
    await this.plantsRepository.softDelete(plant.id);
  }
}
