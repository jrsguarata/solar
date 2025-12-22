import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Distributor } from './entities/distributor.entity';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';

@Injectable()
export class DistributorsService {
  private readonly logger = new Logger(DistributorsService.name);

  constructor(
    @InjectRepository(Distributor)
    private readonly distributorRepository: Repository<Distributor>,
  ) {}

  async create(createDistributorDto: CreateDistributorDto): Promise<Distributor> {
    const distributor = this.distributorRepository.create(createDistributorDto);
    const saved = await this.distributorRepository.save(distributor);
    this.logger.log(`Distribuidora criada: ${saved.name} (${saved.id})`);
    return saved;
  }

  async findAll(): Promise<Distributor[]> {
    return this.distributorRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Distributor> {
    const distributor = await this.distributorRepository.findOne({ where: { id } });

    if (!distributor) {
      throw new NotFoundException(`Distribuidora com ID ${id} não encontrada`);
    }

    return distributor;
  }

  async update(id: string, updateDistributorDto: UpdateDistributorDto): Promise<Distributor> {
    const distributor = await this.findOne(id);

    Object.assign(distributor, updateDistributorDto);
    const updated = await this.distributorRepository.save(distributor);

    this.logger.log(`Distribuidora atualizada: ${updated.name} (${updated.id})`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const distributor = await this.findOne(id);
    await this.distributorRepository.remove(distributor);
    this.logger.log(`Distribuidora removida: ${distributor.name} (${id})`);
  }
}
