import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateConcessionaireDto {
  @ApiProperty({
    example: 'uuid-distributor',
    description: 'ID da distribuidora',
  })
  @IsUUID('4', { message: 'ID da distribuidora deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Distribuidora não pode estar vazia' })
  distributorId: string;

  @ApiProperty({
    example: '12345678901234',
    description: 'CNPJ da concessionária (14 caracteres)',
  })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ não pode estar vazio' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
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

  @ApiProperty({ example: 'SP', description: 'Estado (UF - 2 caracteres)' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma UF válida (ex: SP)' })
  state: string;
}
