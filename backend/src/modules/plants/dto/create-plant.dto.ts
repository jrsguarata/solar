import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Length, Matches, Min } from 'class-validator';
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

  @ApiProperty({ example: 150.50, description: 'Potência instalada em kWp' })
  @IsNumber({}, { message: 'Potência instalada deve ser um número' })
  @IsNotEmpty({ message: 'Potência instalada não pode estar vazia' })
  @Min(0, { message: 'Potência instalada deve ser maior ou igual a zero' })
  @Type(() => Number)
  installedPower: number;

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

  @ApiProperty({ example: 'SP', description: 'Estado (UF - 2 caracteres)' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma UF válida (ex: SP)' })
  state: string;

  @ApiProperty({ example: -23.5505199, description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({ example: -46.6333094, description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @Type(() => Number)
  longitude?: number;
}
