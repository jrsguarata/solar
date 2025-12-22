import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateInitialAdminDto } from './dto/create-initial-admin.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new UnauthorizedException('Conta de usuário desativada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return this.login(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Verificar se o usuário está ativo
      if (!user.isActive) {
        throw new UnauthorizedException('Conta de usuário desativada');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Token de atualização inválido');
    }
  }

  async createInitialAdmin(createInitialAdminDto: CreateInitialAdminDto) {
    // Verificar se já existe algum usuário ADMIN
    const existingAdmin = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      throw new ForbiddenException(
        'Sistema já possui um administrador. Este endpoint está desabilitado.',
      );
    }

    // Verificar se email já existe
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createInitialAdminDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email já existe');
    }

    // Criar o primeiro ADMIN
    const hashedPassword = await bcrypt.hash(createInitialAdminDto.password, 10);

    const admin = this.usersRepository.create({
      email: createInitialAdminDto.email,
      name: createInitialAdminDto.name,
      mobile: createInitialAdminDto.mobile,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    const savedAdmin = await this.usersRepository.save(admin);

    return this.login(savedAdmin);
  }
}
