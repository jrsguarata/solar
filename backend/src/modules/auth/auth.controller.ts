import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateInitialAdminDto } from './dto/create-initial-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Atualizar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token de atualização inválido' })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário atual' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário obtido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('setup/initial-admin')
  @ApiOperation({
    summary: 'Criar primeiro usuário administrador (Funciona apenas se não houver admin)',
    description: 'Este endpoint só funciona se não houver nenhum usuário ADMIN no sistema. Após criar o primeiro admin, este endpoint será desabilitado automaticamente.'
  })
  @ApiResponse({ status: 201, description: 'Administrador inicial criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sistema já possui um administrador' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  createInitialAdmin(@Body() createInitialAdminDto: CreateInitialAdminDto) {
    return this.authService.createInitialAdmin(createInitialAdminDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description: 'Envia código de 6 dígitos para o celular cadastrado. Código válido por 15 minutos.'
  })
  @ApiResponse({ status: 200, description: 'Código de recuperação enviado' })
  @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado com este telefone' })
  @ApiResponse({ status: 400, description: 'Conta de usuário desativada' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetar senha com código de verificação',
    description: 'Valida o código enviado por SMS e altera a senha do usuário'
  })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
