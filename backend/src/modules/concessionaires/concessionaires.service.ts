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
      .leftJoinAndSelect('concessionaire.deletedByUser', 'deletedByUser');

    // Todos os usuários veem apenas concessionárias da sua empresa
    queryBuilder.where('concessionaire.companyId = :companyId', {
      companyId: currentUser.companyId,
    });

    return queryBuilder
      .orderBy('concessionaire.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Concessionaire> {
    const concessionaire = await this.concessionairesRepository.findOne({
      where: { id },
      relations: ['distributor', 'company', 'createdByUser', 'updatedByUser', 'deletedByUser'],
    });

    if (!concessionaire) {
      throw new NotFoundException(
        `Concessionária com ID ${id} não encontrada`,
      );
    }

    // Usuários só podem ver concessionária da sua empresa
    if (concessionaire.companyId !== currentUser.companyId) {
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

    Object.assign(concessionaire, updateConcessionaireDto);

    return this.concessionairesRepository.save(concessionaire);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const concessionaire = await this.findOne(id, currentUser);
    await this.concessionairesRepository.softDelete(concessionaire.id);
  }
}
