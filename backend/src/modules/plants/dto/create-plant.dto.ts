import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Length, Matches, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantDto {
  @ApiProperty({ example: 'PLT001' })
  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código não pode estar vazio' })
  code: string;

  @ApiProperty({ example: 'Usina Solar Central' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsString({ message: 'ID da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'ID da empresa não pode estar vazio' })
  companyId: string;

  @ApiProperty({ example: 150.50, description: 'Potência instalada em kWh' })
  @IsNumber({}, { message: 'Potência instalada deve ser um número' })
  @IsNotEmpty({ message: 'Potência instalada não pode estar vazia' })
  @Min(0, { message: 'Potência instalada deve ser maior ou igual a zero' })
  @Type(() => Number)
  installedPower: number;

  @ApiProperty({ example: 'uuid-da-concessionaria', description: 'ID da concessionária' })
  @IsString({ message: 'ID da concessionária deve ser uma string' })
  @IsNotEmpty({ message: 'ID da concessionária não pode estar vazio' })
  concessionaryId: string;

  @ApiProperty({ example: '123456789', description: 'Código da unidade consumidora' })
  @IsString({ message: 'Unidade consumidora deve ser uma string' })
  @IsNotEmpty({ message: 'Unidade consumidora não pode estar vazia' })
  consumerUnit: string;

  @ApiProperty({ example: '12345678', description: 'CEP (8 caracteres)' })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP não pode estar vazio' })
  @Length(8, 8, { message: 'CEP deve ter 8 caracteres' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  zipCode: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Nome da rua' })
  @IsString({ message: 'Nome da rua deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da rua não pode estar vazio' })
  streetName: string;

  @ApiProperty({ example: '123', description: 'Número do endereço' })
  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número não pode estar vazio' })
  number: string;

  @ApiProperty({ example: 'Sala 101', description: 'Complemento (opcional)', required: false })
  @IsString({ message: 'Complemento deve ser uma string' })
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro não pode estar vazio' })
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade não pode estar vazia' })
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado (UF - 2 caracteres)' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma UF válida (ex: SP)' })
  state: string;
}
