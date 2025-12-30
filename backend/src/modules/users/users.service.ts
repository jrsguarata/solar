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
import { RequestContextService } from '../../common/context/request-context';
import { AuditLog, AuditAction } from '../../common/entities/audit-log.entity';
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
      return this.usersRepository.find({
        relations: ['company', 'createdByUser', 'updatedByUser', 'deactivatedByUser'],
      });
    }

    // COADMIN, OPERATOR e USER veem apenas usuários da sua empresa
    if (currentUser.companyId) {
      return this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .leftJoinAndSelect('user.createdByUser', 'createdByUser')
        .leftJoinAndSelect('user.updatedByUser', 'updatedByUser')
        .leftJoinAndSelect('user.deactivatedByUser', 'deactivatedByUser')
        .where('user.company_id = :companyId', { companyId: currentUser.companyId })
        .getMany();
    }

    // Se não tem empresa, retorna vazio
    return [];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['company', 'createdByUser', 'updatedByUser', 'deactivatedByUser'],
    });

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
    // Verificar se usuário existe
    await this.findOne(id);
    const userId = RequestContextService.getUserId();

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // SOLUÇÃO: Usar save() do repositório mas forçando a inclusão dos campos de auditoria
    // Carregar o usuário novamente
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Aplicar mudanças do DTO
    Object.assign(user, updateUserDto);

    // CRITICAL: Setar campos de auditoria DIRETAMENTE nas propriedades de coluna
    // Não usar as relações, usar as colunas diretamente
    (user as any).updated_by = userId;
    (user as any).updated_at = new Date();

    // Salvar usando save() que vai incluir todos os campos modificados
    await this.usersRepository.save(user);

    // Retornar o usuário atualizado com todas as relações
    return this.findOne(id);
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

    const userId = RequestContextService.getUserId();
    const userIdToSet = deactivatedBy || userId;

    // SOLUÇÃO: Setar campos diretamente usando as propriedades de coluna
    // REGRA DE AUDITORIA: Apenas is_active, deactivated_at e deactivated_by devem ser atualizados
    user.isActive = false;
    user.deactivatedAt = new Date();
    (user as any).deactivated_by = userIdToSet;

    await this.usersRepository.save(user);

    return this.findOne(id);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new BadRequestException('Usuário já está ativo');
    }

    const userId = RequestContextService.getUserId();

    // Capturar valores ANTES da mudança para o audit log
    const oldValues = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getRawOne();

    // SOLUÇÃO FINAL: Usar QueryBuilder.update() para garantir que NULL seja setado
    // Como QueryBuilder não dispara subscribers, criar audit log MANUALMENTE
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        isActive: true,
        deactivatedAt: () => 'NULL',
        deactivated_by: () => 'NULL', // Usar SQL function para setar NULL
        updatedAt: new Date(),
        updated_by: userId,
      } as any)
      .where('id = :id', { id })
      .execute();

    // Buscar valores DEPOIS da mudança
    const newValues = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getRawOne();

    // Criar audit log MANUALMENTE
    const changedFields: string[] = [];
    for (const key in oldValues) {
      if (key.startsWith('user_')) {
        const cleanKey = key.replace('user_', '');
        if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
          changedFields.push(cleanKey);
        }
      }
    }

    // Sanitizar valores removendo prefixo "user_"
    const sanitizeValues = (values: any) => {
      const sanitized: any = {};
      for (const key in values) {
        if (key.startsWith('user_')) {
          const cleanKey = key.replace('user_', '');
          sanitized[cleanKey] = values[key];
        }
      }
      return sanitized;
    };

    const auditLog = this.usersRepository.manager.create(AuditLog, {
      tableName: 'users',
      recordId: id,
      action: AuditAction.UPDATE,
      oldValues: sanitizeValues(oldValues),
      newValues: sanitizeValues(newValues),
      changedFields: changedFields.filter(f => f !== 'updated_at'),
      userId,
    });

    await this.usersRepository.manager.save(AuditLog, auditLog);

    return this.findOne(id);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Buscar usuário com a senha
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password', 'isActive'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      throw new BadRequestException('Usuário está desativado');
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await this.usersRepository.update(userId, { password: hashedPassword });
  }
}
