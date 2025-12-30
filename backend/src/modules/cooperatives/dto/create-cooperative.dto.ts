import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Length,
  Matches,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCooperativeDto {
  @ApiProperty({ example: 'COOP001', description: 'Código único da cooperativa' })
  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código não pode estar vazio' })
  code: string;

  @ApiProperty({ example: 'Cooperativa Solar Central', description: 'Nome da cooperativa' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @ApiProperty({ example: 'uuid-da-empresa', description: 'ID da empresa vinculada' })
  @IsString({ message: 'ID da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'ID da empresa não pode estar vazio' })
  companyId: string;

  @ApiProperty({ example: '12345678901234', description: 'CNPJ da cooperativa (14 dígitos)' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ não pode estar vazio' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  @Matches(/^[0-9A-Za-z]{14}$/, { message: 'CNPJ deve conter apenas números e letras (14 caracteres)' })
  cnpj: string;

  @ApiProperty({ example: '12345678', description: 'CEP (8 caracteres)' })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP não pode estar vazio' })
  @Length(8, 8, { message: 'CEP deve ter 8 caracteres' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  zipCode: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Nome da rua' })
  @IsString({ message: 'Nome da rua deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da rua não pode estar vazio' })
  streetName: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade não pode estar vazia' })
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado (UF - 2 letras)' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve conter apenas letras maiúsculas (UF)' })
  state: string;

  @ApiProperty({ example: 5000.50, description: 'Energia mensal em kWh' })
  @IsNumber({}, { message: 'Energia mensal deve ser um número' })
  @IsNotEmpty({ message: 'Energia mensal não pode estar vazia' })
  @Min(0, { message: 'Energia mensal deve ser maior ou igual a zero' })
  @Type(() => Number)
  monthlyEnergy: number;

  @ApiProperty({ example: '2020-01-15', description: 'Data de fundação (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Data de fundação deve ser uma data válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Data de fundação não pode estar vazia' })
  foundationDate: string;

  @ApiProperty({
    example: '2021-06-20',
    description: 'Data de aprovação de operação (YYYY-MM-DD) - Opcional',
    required: false,
  })
  @IsDateString({}, { message: 'Data de aprovação deve ser uma data válida (YYYY-MM-DD)' })
  @IsOptional()
  operationApprovalDate?: string;
}
