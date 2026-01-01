import { Injectable, UnauthorizedException, ConflictException, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateInitialAdminDto } from './dto/create-initial-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  // Armazenamento temporário de códigos de recuperação (em produção, usar Redis)
  private recoveryCodes: Map<string, { code: string; expiresAt: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string, companyId?: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new UnauthorizedException('Conta de usuário desativada');
    }

    // Validar company se fornecido (apenas para usuários não-ADMIN)
    if (companyId && user.role !== UserRole.ADMIN) {
      if (user.companyId !== companyId) {
        throw new ForbiddenException('Usuário não pertence a esta empresa');
      }
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
        company: user.company ? {
          id: user.company.id,
          name: user.company.name,
          code: user.company.code,
        } : undefined,
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

  /**
   * Solicitar recuperação de senha - Gera código e "envia" SMS
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Buscar usuário pelo email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Nenhum usuário encontrado com este email');
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      throw new BadRequestException('Conta de usuário desativada');
    }

    // Verificar se usuário tem celular cadastrado
    if (!user.mobile) {
      throw new BadRequestException('Usuário não possui celular cadastrado');
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Armazenar código com validade de 15 minutos usando o celular como chave
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    this.recoveryCodes.set(user.mobile, { code, expiresAt });

    // TODO: Integrar com serviço de SMS real (Twilio, AWS SNS, etc.)
    console.log(`[SMS] Código de recuperação para ${user.mobile}: ${code}`);

    return {
      message: 'Código de recuperação enviado para o celular cadastrado',
      phone: user.mobile, // Retornar telefone mascarado para exibir na UI
      // Em desenvolvimento, retornar o código (REMOVER EM PRODUÇÃO)
      code: process.env.NODE_ENV === 'development' ? code : undefined,
    };
  }

  /**
   * Resetar senha com código de verificação
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { phone, code, newPassword } = resetPasswordDto;

    // Verificar se existe código para este telefone
    const storedData = this.recoveryCodes.get(phone);

    if (!storedData) {
      throw new BadRequestException('Código de recuperação não encontrado ou expirado');
    }

    // Verificar se código expirou
    if (new Date() > storedData.expiresAt) {
      this.recoveryCodes.delete(phone);
      throw new BadRequestException('Código de recuperação expirado. Solicite um novo código');
    }

    // Verificar se código está correto
    if (storedData.code !== code) {
      throw new BadRequestException('Código de recuperação inválido');
    }

    // Buscar usuário
    const user = await this.usersRepository.findOne({
      where: { mobile: phone },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    // Remover código usado
    this.recoveryCodes.delete(phone);

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
