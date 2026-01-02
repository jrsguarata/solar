import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsUUID, Matches, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { IsPartnerOnlyForOperator } from '../../../common/validators/partner-only-for-operator.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @ApiProperty({ example: '11987654321', description: 'Número de celular (apenas dígitos)' })
  @IsString({ message: 'Celular deve ser uma string' })
  @IsNotEmpty({ message: 'Celular não pode estar vazio' })
  @Matches(/^[0-9]{10,11}$/, { message: 'Número de celular deve conter 10 ou 11 dígitos' })
  mobile: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;

  @ApiProperty({ example: 'USER', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Perfil deve ser USER, OPERATOR, COADMIN ou ADMIN' })
  role?: UserRole;

  @ApiProperty({ example: 'uuid-da-company', required: false })
  @IsOptional()
  @IsUUID(undefined, { message: 'ID da empresa deve ser um UUID válido' })
  companyId?: string;

  @ApiProperty({ example: 'uuid-do-parceiro', required: false, description: 'Apenas para usuários OPERATOR' })
  @IsOptional()
  @IsUUID(undefined, { message: 'ID do parceiro deve ser um UUID válido' })
  @IsPartnerOnlyForOperator()
  partnerId?: string;
}
