import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@example.com', description: 'E-mail para contato' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '11987654321', description: 'Telefone (apenas dígitos)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
  phone: string;

  @ApiProperty({ example: 'Empresa XYZ', description: 'Nome da empresa (opcional)', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da distribuidora de energia (opcional)',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da distribuidora deve ser um UUID válido' })
  distributorId?: string;

  @ApiProperty({
    example: 'Gostaria de saber mais sobre geração distribuída',
    description: 'Mensagem do contato'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
