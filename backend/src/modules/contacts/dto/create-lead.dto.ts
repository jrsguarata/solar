import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Length } from 'class-validator';

export class CreateLeadDto {
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

  @ApiProperty({ example: '01310-100', description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{5}-?[0-9]{3}$/, { message: 'CEP deve estar no formato 00000-000' })
  cep: string;

  @ApiProperty({ example: 'Avenida Paulista', description: 'Logradouro/Rua' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Bela Vista', description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: '1000', description: 'Número da casa' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Apto 42', description: 'Complemento (opcional)', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado (sigla com 2 letras)' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'Estado deve ter exatamente 2 caracteres' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve conter apenas letras maiúsculas' })
  state: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID da empresa (opcional)',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  companyId?: string;

  @ApiProperty({
    example: 'Gostaria de saber mais sobre geração distribuída',
    description: 'Mensagem do contato'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
