import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInitialAdminDto {
  @ApiProperty({
    example: 'admin@solar.com',
    description: 'Email do administrador',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'Administrador do Sistema',
    description: 'Nome completo do administrador',
  })
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: '11987654321',
    description: 'Número de celular (apenas dígitos)',
  })
  @IsString({ message: 'Celular deve ser um texto' })
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @Matches(/^[0-9]{10,11}$/, { message: 'Número de celular deve conter 10 ou 11 dígitos' })
  mobile: string;

  @ApiProperty({
    example: 'SenhaSegura@123',
    description: 'Senha do administrador (mínimo 8 caracteres)',
  })
  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
