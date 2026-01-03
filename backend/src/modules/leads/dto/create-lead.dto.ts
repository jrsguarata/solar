import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { LeadStatus, LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: '11987654321' })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsNotEmpty({ message: 'Telefone não pode estar vazio' })
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
  phone: string;

  @ApiPropertyOptional({ example: '12345678900' })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  cpf?: string;

  @ApiPropertyOptional({ example: '12345678000100' })
  @IsOptional()
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 dígitos' })
  cnpj?: string;

  @ApiPropertyOptional({ example: 'Empresa XYZ Ltda' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: '50+' })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({ example: '01310100' })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP não pode estar vazio' })
  @Length(8, 9, { message: 'CEP deve ter 8 ou 9 caracteres' })
  cep: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString({ message: 'Rua deve ser uma string' })
  @IsNotEmpty({ message: 'Rua não pode estar vazia' })
  street: string;

  @ApiProperty({ example: '1000' })
  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número não pode estar vazio' })
  number: string;

  @ApiPropertyOptional({ example: 'Apto 101' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro não pode estar vazio' })
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade não pode estar vazia' })
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  state: string;

  @ApiPropertyOptional({ example: 500.5 })
  @IsOptional()
  @IsNumber({}, { message: 'Consumo médio deve ser um número' })
  averageConsumptionKwh?: number;

  @ApiPropertyOptional({ example: 350.75 })
  @IsOptional()
  @IsNumber({}, { message: 'Valor médio da conta deve ser um número' })
  averageBillValue?: number;

  @ApiPropertyOptional({ example: 'ENEL' })
  @IsOptional()
  @IsString()
  concessionaire?: string;

  @ApiPropertyOptional({ example: 'LEAD' })
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'Status inválido' })
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'LANDING_PAGE' })
  @IsOptional()
  @IsEnum(LeadSource, { message: 'Origem inválida' })
  source?: LeadSource;

  @ApiPropertyOptional({ example: 'uuid-do-usuario' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Mensagem do formulário de contato' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'Observações gerais sobre o lead' })
  @IsOptional()
  @IsString()
  notes?: string;
}
