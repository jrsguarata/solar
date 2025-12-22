import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompaniesService } from '../companies/companies.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private companiesService: CompaniesService,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser?: any): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    // Se COADMIN está criando, deve ser da mesma empresa
    if (currentUser && currentUser.role === UserRole.COADMIN) {
      if (!currentUser.companyId) {
        throw new BadRequestException('COADMIN deve pertencer a uma empresa');
      }

      // Forçar que o novo usuário seja da mesma empresa do COADMIN
      createUserDto.companyId = currentUser.companyId;

      // COADMIN não pode criar ADMIN ou COADMIN
      if (
        createUserDto['role'] === UserRole.ADMIN ||
        createUserDto['role'] === UserRole.COADMIN
      ) {
        throw new BadRequestException(
          'COADMIN não pode criar usuários com perfil ADMIN ou COADMIN',
        );
      }
    }

    // Validar que usuários OPERATOR, COADMIN e USER devem ter companyId
    if (createUserDto.companyId) {
      const company = await this.companiesService.findOne(createUserDto.companyId);
      if (!company) {
        throw new BadRequestException('Empresa não encontrada');
      }
    } else {
      // Se não tem companyId, só pode ser ADMIN
      if (createUserDto['role'] && createUserDto['role'] !== UserRole.ADMIN) {
        throw new BadRequestException('Usuários com perfil USER, OPERATOR ou COADMIN devem pertencer a uma empresa');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      mobile: createUserDto.mobile,
      password: hashedPassword,
      role: createUserDto['role'] || UserRole.USER,
      isActive: true,
    });

    // Se tem companyId, definir a relação
    if (createUserDto.companyId) {
      user.company = { id: createUserDto.companyId } as any;
    }

    return this.usersRepository.save(user);
  }

  async findAll(currentUser?: any): Promise<User[]> {
    // ADMIN vê todos os usuários
    if (!currentUser || currentUser.role === UserRole.ADMIN) {
      return this.usersRepository.find();
    }

    // COADMIN, OPERATOR e USER veem apenas usuários da sua empresa
    if (currentUser.companyId) {
      return this.usersRepository
        .createQueryBuilder('user')
        .where('user.company_id = :companyId', { companyId: currentUser.companyId })
        .getMany();
    }

    // Se não tem empresa, retorna vazio
    return [];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softDelete(user.id);
  }

  async deactivate(id: string, deactivatedBy?: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user.isActive) {
      throw new BadRequestException('Usuário já está desativado');
    }

    user.isActive = false;
    user.deactivatedAt = new Date();
    if (deactivatedBy) {
      user.deactivatedBy = deactivatedBy;
    }

    return this.usersRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new BadRequestException('Usuário já está ativo');
    }

    user.isActive = true;
    user.deactivatedAt = undefined;
    user.deactivatedBy = undefined;

    return this.usersRepository.save(user);
  }
}
